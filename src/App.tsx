/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { AgentCardItem } from './components/AgentCardItem.tsx';
import { SwarmBoard } from './components/SwarmBoard.tsx';
import { BenchmarkLab } from './components/BenchmarkLab.tsx';
import { SwarmVisualizer } from './components/SwarmVisualizer.tsx';
import { PersonaCreator } from './components/PersonaCreator.tsx';
import { ArchetypeSelector } from './components/ArchetypeSelector.tsx';
import { SummaryDashboard } from './components/SummaryDashboard.tsx';
import { AgentLog } from './components/AgentLog.tsx';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  setDoc,
  doc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, auth } from './lib/firebase.ts';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import type { AgentCard, SwarmJob, SwarmTask } from './types.ts';
import { SEED_PERSONAS } from './data/seedPersonas.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ClipboardList, Settings, Loader2, Share2, Plus, X } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'agents' | 'swarm' | 'jobs' | 'visualizer'>('agents');
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [user, setUser] = useState(auth.currentUser);
  const [loading, setLoading] = useState(true);
  const [activeJob, setActiveJob] = useState<SwarmJob | undefined>();
  const [tasks, setTasks] = useState<SwarmTask[]>([]);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedLogAgent, setSelectedLogAgent] = useState<AgentCard | null>(null);
  const [allJobs, setAllJobs] = useState<SwarmJob[]>([]);
  const [allTasks, setAllTasks] = useState<SwarmTask[]>([]);

  useEffect(() => {
    if (!user) return;
    const unsubJobs = onSnapshot(collection(db, 'jobs'), (snap) => {
      setAllJobs(snap.docs.map(d => ({ ...d.data(), id: d.id } as SwarmJob)));
    });
    // This is expensive but necessary for the global summary
    const unsubAllTasks = onSnapshot(collection(db, 'jobs'), (snap) => {
       // Just mapping to trigger re-renders for global task counts if needed
       // In a real app we'd have a root tasks collection or a better aggregation
    });
    return () => unsubJobs();
  }, [user]);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (!u) {
        setLoading(false);
      }
    });
    return () => unsubAuth();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Login failed:', e);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  useEffect(() => {
    if (!user) return;

    // Listen to Agents
    const qAgents = query(collection(db, 'agents'));
    const unsubAgents = onSnapshot(qAgents, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as AgentCard));
      setAgents(docs);
      
      // Seed if empty
      if (docs.length === 0) {
        seedInitialAgents();
      }
      setLoading(false);
    }, (error) => {
      console.error("Agent pulse failed:", error);
      setLoading(false);
    });

    return () => unsubAgents();
  }, [user]);

  const seedInitialAgents = async () => {
    const defaultAgents: Partial<AgentCard>[] = [
      {
        id: 'arch_001',
        role: 'Systems Architect',
        mode: 'executor',
        skills: ['Architecture', 'Scaling', 'Performance'],
        behavior_rules: ['Prefer simple architecture', 'Focus on scalability'],
        strengths: ['API Design', 'Cloud Infra'],
        experience_level: 'staff',
        tools: ['diagrams', 'docs'],
        ownerId: user?.uid || 'system'
      },
      {
        id: 'sec_lens_001',
        role: 'Security Analyst',
        mode: 'critic',
        skills: ['Vulnerabilities', 'Encryption', 'Auth'],
        behavior_rules: ['Be relentless about security', 'Question every attack surface'],
        strengths: ['Pen testing', 'Audit'],
        experience_level: 'senior',
        tools: ['scanner'],
        ownerId: user?.uid || 'system'
      },
      {
        id: 'ux_lens_001',
        role: 'UX Designer',
        mode: 'critic',
        skills: ['Usability', 'Interface', 'Friction'],
        behavior_rules: ['Advocate for the user', 'Simplify everything'],
        strengths: ['User Flow', 'Accessibility'],
        experience_level: 'senior',
        tools: ['figma'],
        ownerId: user?.uid || 'system'
      }
    ];

    const allAgentsToSeed = [...defaultAgents, ...SEED_PERSONAS];

    for (const a of allAgentsToSeed) {
      const agentId = a.id || `agent_${Math.random().toString(36).substr(2, 9)}`;
      await setDoc(doc(db, 'agents', agentId), {
        ...a,
        id: agentId,
        version: '1.0',
        exp: 0,
        level: 1,
        satisfaction: 0.8,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        capability_vector: a.capability_vector || {
          coding: 0.5,
          system_design: 0.5,
          debugging: 0.5,
          ui_design: 0.5,
          curiosity: 0.5,
          adaptability: 0.5
        },
        lifecycle_stage: a.lifecycle_stage || 'initialization',
        reputation_history: a.reputation_history || [],
        priority_bias: a.priority_bias || { correctness: 0.5, speed: 0.5, elegance: 0.5 },
        context_budget: a.context_budget || 4000,
        weaknesses: a.weaknesses || ['unknown'],
        behavior_rules: a.behavior_rules || ['Follow instructions'],
        ownerId: user?.uid || 'system'
      });
    }
  };

  const handleStartJob = async (goal: string, selectedAgentIds: string[]) => {
    if (!user) return;

    const jobData: Partial<SwarmJob> = {
      goal,
      teamId: 'custom',
      status: 'planning',
      max_iterations: 3,
      current_iteration: 1,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      userId: user.uid
    };

    const jobDoc = await addDoc(collection(db, 'jobs'), jobData);
    const jobId = jobDoc.id;
    setActiveJob({ ...jobData, id: jobId } as SwarmJob);
    setView('swarm');

    // Decompose via Server
    try {
      const selectedAgents = agents.filter(a => selectedAgentIds.includes(a.id));
      const res = await fetch('/api/swarm/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, team: selectedAgents })
      });
      const taskList = await res.json();

      // Add tasks to Firestore
      for (const t of taskList) {
        await addDoc(collection(db, 'jobs', jobId, 'tasks'), {
          ...t,
          jobId,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error('Failed to decompose:', e);
    }
  };

  useEffect(() => {
    if (!activeJob?.id) return;
    const qTasks = query(collection(db, 'jobs', activeJob.id, 'tasks'), orderBy('createdAt', 'asc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      const taskDocs = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as SwarmTask));
      setTasks(taskDocs);
    });
    return () => unsubTasks();
  }, [activeJob?.id]);

  useEffect(() => {
    if (!activeJob?.id || activeJob.status !== 'executing') return;

    const runExecutionLoop = async () => {
      // Find the next task to run
      const nextTask = tasks.find(t => 
        t.status === 'pending' && 
        t.dependencies.every(depId => tasks.find(tt => tt.id === depId)?.status === 'done')
      );

      if (!nextTask) {
        // If all tasks are done, mark job as completed
        if (tasks.length > 0 && tasks.every(t => t.status === 'done')) {
          await updateDoc(doc(db, 'jobs', activeJob.id), { 
            status: 'completed', 
            updatedAt: serverTimestamp() 
          });
        }
        return;
      }

        // Execute Task
        try {
          const taskId = nextTask.id;
          const taskRef = doc(db, 'jobs', activeJob.id, 'tasks', nextTask.id);
          
          // Mark as in_progress
          await updateDoc(taskRef, { 
            status: 'in_progress', 
            startTime: serverTimestamp(),
            updatedAt: serverTimestamp() 
          });

          // Get the agent card for the assigned agent
          const agentId = nextTask.assigned_agents[0];
          const agent = agents.find(a => a.id === agentId);
          
          if (!agent) {
             console.error('Agent not found:', agentId);
             await updateDoc(taskRef, { status: 'failed', updatedAt: new Date().toISOString() });
             return;
          }

          const res = await fetch('/api/swarm/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              task: nextTask, 
              agent, 
              context: tasks.filter(t => t.status === 'done').map(t => t.output?.content).join('\n\n') 
            })
          });
          const result = await res.json();

          // Calculate rewards
          const complexity = nextTask.complexity || Math.floor(Math.random() * 5) + 3;
          const xpEarned = complexity * 100;
          const currentExp = (agent.exp || 0) + xpEarned;
          const currentLevel = agent.level || 1;
          const expToNext = currentLevel * 1000;
          
          const newLevel = currentExp >= expToNext ? currentLevel + 1 : currentLevel;
          const finalExp = currentExp >= expToNext ? currentExp - expToNext : currentExp;
          const skillPointsEarned = currentExp >= expToNext ? 1 : 0;

          // Update Agent Stats
          await updateDoc(doc(db, 'agents', agent.id), {
            exp: finalExp,
            level: newLevel,
            skill_points: (agent.skill_points || 0) + skillPointsEarned,
            satisfaction: Math.min(1, (agent.satisfaction || 0.8) + 0.05),
            updatedAt: serverTimestamp()
          });

          await updateDoc(taskRef, { 
            status: 'done', 
            output: { content: result.content },
            complexity,
            duration: Math.floor((Date.now() - (nextTask.updatedAt ? new Date(nextTask.updatedAt).getTime() : Date.now())) / 1000),
            updatedAt: serverTimestamp() 
          });

      } catch (e) {
        console.error('Execution loop error:', e);
      }
    };

    const interval = setInterval(runExecutionLoop, 5000);
    return () => clearInterval(interval);
  }, [activeJob?.id, activeJob?.status, tasks, agents]);

  if (!user && !loading) {
    return (
      <div className="editorial-container min-h-screen flex items-center justify-center font-sans">
        <div className="max-w-md w-full border-4 border-black p-12 editorial-shadow bg-white text-center">
          <div className="w-16 h-16 bg-black mx-auto mb-8 flex items-center justify-center">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-4xl font-serif mb-4 leading-tight">Access the Swarm Directory.</h1>
          <p className="text-xs font-mono uppercase opacity-40 mb-10 tracking-[0.2em] leading-relaxed">
            Multimodal Agent Orchestration // Registry Access Level: SECURE
          </p>
          <button 
            onClick={handleLogin}
            className="w-full bg-black text-white px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-black/80 transition-all flex items-center justify-center gap-3"
          >
            Authenticate with Google
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="editorial-container flex items-center justify-center font-serif italic text-4xl opacity-40">
        <Loader2 className="animate-spin mr-4" />
        Syncing Persona Registry...
      </div>
    );
  }

  return (
    <div className="editorial-container flex flex-col font-sans">
      <Header />

      <main className="flex-1">
        <SummaryDashboard jobs={allJobs} tasks={tasks} agents={agents} />
        
        <div className="flex gap-8 border-b border-black/10 mb-12 font-mono text-[10px] uppercase tracking-widest font-bold">
          <button 
            onClick={() => setView('agents')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${view === 'agents' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Users size={12} />
            Persona Registry
          </button>
          <button 
            onClick={() => setView('swarm')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${view === 'swarm' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <ClipboardList size={12} />
            Execution Swarm
          </button>
          <button 
            onClick={() => setView('jobs')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${view === 'jobs' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Settings size={12} />
            Benchmarks
          </button>
          <button 
            onClick={() => setView('visualizer')}
            className={`pb-4 border-b-2 transition-all flex items-center gap-2 ${view === 'visualizer' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Share2 size={12} />
            Analytic Canvas
          </button>
        </div>

        <AnimatePresence mode="wait">
          {view === 'agents' && (
            <motion.div 
              key="agents"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="flex justify-between items-end">
                <div className="max-w-4xl border-l-4 border-black pl-6 ml-2">
                  <p className="text-4xl font-serif leading-tight mb-4 tracking-tight">
                    Identifying the <span className="underline underline-offset-8 decoration-1">patterns</span> of intelligence within a persistent entity ecosystem.
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 opacity-40 italic">Registry Status: {agents.length} Sovereigns Verified // 0 Collisions Detected</p>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setShowCreator(true)}
                      className="px-6 py-2 bg-black text-white text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 editorial-shadow"
                    >
                      <Plus size={10} /> Add Citizen
                    </button>
                    <span className="px-3 py-2 border border-[#1A1A1A] text-[10px] font-mono uppercase tracking-widest">Network Health: Stable</span>
                  </div>
                </div>
              </div>

              <section className="bg-stone-50 p-12 border-2 border-black/5 editorial-shadow-sm">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif italic text-xl">I</div>
                    <div>
                       <h3 className="text-2xl font-serif font-bold tracking-tighter uppercase mb-1">Societal Archetypes</h3>
                       <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">Foundational Institutions // Collective DNA Blueprints</p>
                    </div>
                 </div>
                 <ArchetypeSelector onSelect={(id) => {
                   // Integration for spawning groups is handled via future simulation turns
                   console.log('Archetype selection persistent signal emitted:', id);
                 }} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 py-8">
                {agents.map((agent, idx) => (
                  <AgentCardItem 
                    key={agent.id} 
                    agent={agent} 
                    onSelect={(a) => setSelectedLogAgent(a)}
                    className={idx % 4 === 0 ? '-rotate-1' : idx % 4 === 2 ? 'rotate-1' : idx % 4 === 3 ? 'translate-y-4' : ''}
                  />
                ))}
              </div>

              <AnimatePresence>
                {selectedLogAgent && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="max-w-4xl w-full relative">
                      <button 
                        onClick={() => setSelectedLogAgent(null)}
                        className="absolute -top-12 right-0 text-white hover:rotate-90 transition-transform"
                      >
                        <X size={32} />
                      </button>
                      <AgentLog agent={selectedLogAgent} tasks={tasks} />
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {view === 'swarm' && (
            <motion.div 
              key="swarm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SwarmBoard 
                agents={agents} 
                onStartJob={handleStartJob} 
                activeJob={activeJob}
                tasks={tasks}
              />
            </motion.div>
          )}

          {view === 'jobs' && (
            <motion.div 
              key="jobs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <BenchmarkLab agents={agents} />
            </motion.div>
          )}

          {view === 'visualizer' && (
            <motion.div 
              key="visualizer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SwarmVisualizer agents={agents} tasks={tasks} />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showCreator && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <PersonaCreator 
                onClose={() => setShowCreator(false)} 
                onSuccess={() => {/* Toast or notification */}}
              />
            </div>
          )}
        </AnimatePresence>
      </main>

      <footer className="mt-24 pt-6 border-t border-black/10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex gap-12 font-mono text-[10px] uppercase tracking-widest opacity-60">
          <div>Ref: SWARM_DIRECTORY_V1</div>
          <div className="hidden sm:block">Page 01 // 01</div>
          <div>Coord: {user?.uid.slice(0, 8).toUpperCase() || 'OFFLINE'}</div>
        </div>
        <div className="flex items-center gap-6">
          {user && (
            <button 
              onClick={handleLogout}
              className="font-mono text-[10px] uppercase tracking-widest opacity-40 hover:opacity-100 transition-all"
            >
              Terminate Session
            </button>
          )}
          <div className="w-32 h-8 bg-black flex items-center justify-center">
            <span className="text-white font-mono text-[10px] tracking-[0.4em] translate-x-1 uppercase">id_swarm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
