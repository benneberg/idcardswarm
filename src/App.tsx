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
import { ComparisonDashboard } from './components/ComparisonDashboard.tsx';
import { PersonaComparisonTable } from './components/PersonaComparisonTable.tsx';
import { AffinityMapper } from './components/AffinityMapper.tsx';
import { AgentLog } from './components/AgentLog.tsx';
import { SwarmMethodologyGuide } from './components/SwarmMethodologyGuide.tsx';
import { USER_PERSONAS, UserPersona } from './data/userPersonas.ts';
import { spawnOffspring } from './lib/agentService.ts';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut 
} from 'firebase/auth';
import { auth } from './lib/firebase.ts';
import type { AgentCard } from './types.ts';
import { motion, AnimatePresence } from 'motion/react';
import { Users, ClipboardList, Settings, Loader2, Share2, X, Search, Plus, AlertCircle, GitBranch, BookOpen } from 'lucide-react';

// Modular Hooks
import { useAgentRegistry } from './hooks/useAgentRegistry';
import { useSwarmManager } from './hooks/useSwarmManager';
import { getLifecycleStage } from './lib/utils';

export default function App() {
  const [view, setView] = useState<'agents' | 'swarm' | 'jobs' | 'visualizer' | 'insights' | 'blueprint'>('agents');
  const [user, setUser] = useState<any>(null);
  const [legacyAgent, setLegacyAgent] = useState<AgentCard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'executor' | 'critic'>('all');
  const [selectedPersona, setSelectedPersona] = useState<UserPersona | null>(null);
  const [showCreator, setShowCreator] = useState(false);
  const [selectedLogAgent, setSelectedLogAgent] = useState<AgentCard | null>(null);
  const [selectedForComparison, setSelectedForComparison] = useState<AgentCard[]>([]);
  const [selectedUserPersonas, setSelectedUserPersonas] = useState<UserPersona[]>([]);

  // Authentication
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsubAuth();
  }, []);

  const handleLogin = async () => {
    try { await signInWithPopup(auth, new GoogleAuthProvider()); } catch (e) { console.error('Login failed:', e); }
  };

  const handleLogout = async () => {
    try { await signOut(auth); } catch (e) { console.error('Logout failed:', e); }
  };

  // Logic Registry
  const { agents, loading: registryLoading } = useAgentRegistry(user);
  const { 
    jobs, 
    activeJob, 
    setActiveJob, 
    tasks, 
    allTasks, 
    allRelationships, 
    handleStartJob,
    currentEnvironment,
    setCurrentEnvironment
  } = useSwarmManager(user, agents, getLifecycleStage, setLegacyAgent);

  const filteredAgents = agents
    .filter(a => filterMode === 'all' || a.mode === filterMode)
    .filter(a => a.role.toLowerCase().includes(searchQuery.toLowerCase()) || 
                 a.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase())));

  if (!user && !registryLoading) {
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

  if (registryLoading) {
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

      <main className="flex-1 overflow-x-hidden">
        <SummaryDashboard jobs={jobs} tasks={allTasks} agents={agents} />
        
        <div className="flex gap-8 border-b border-black/10 mb-12 font-mono text-[10px] uppercase tracking-widest font-bold overflow-x-auto no-scrollbar touch-pan-x">
          <button 
            onClick={() => setView('agents')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'agents' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Users size={12} />
            Agent Directory
          </button>
          <button 
            onClick={() => setView('swarm')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'swarm' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <ClipboardList size={12} />
            Task Swarm
          </button>
          <button 
            onClick={() => setView('jobs')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'jobs' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Settings size={12} />
            Benchmarks
          </button>
          <button 
            onClick={() => setView('visualizer')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'visualizer' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Share2 size={12} />
            System Map
          </button>
          <button 
            onClick={() => setView('insights')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'insights' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <Users size={12} />
            User Insights
          </button>
          <button 
            onClick={() => setView('blueprint')}
            className={`pb-4 border-b-2 transition-all shrink-0 flex items-center gap-2 ${view === 'blueprint' ? 'border-black opacity-100' : 'border-transparent opacity-40'}`}
          >
            <BookOpen size={12} />
            Simulation Specs
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
                    Monitor agent intelligence and evolutionary <span className="underline underline-offset-8 decoration-1">patterns</span> within the ecosystem.
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 opacity-40 italic">Agent Status: {agents.length} Active Profiles</p>
                  <div className="flex flex-col md:flex-row gap-6 mb-8 mr-2">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20" size={14} />
                      <input type="text" placeholder="Search by role or capability..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white border border-black/10 py-3 pl-10 pr-4 text-xs font-mono uppercase tracking-widest focus:border-black transition-colors outline-none h-full" />
                    </div>
                    <div className="flex bg-black/5 p-1 rounded-sm">
                      {(['all', 'executor', 'critic'] as const).map((m) => (
                        <button key={m} onClick={() => setFilterMode(m)} className={`px-4 py-2 text-[8px] font-mono uppercase tracking-widest transition-all ${filterMode === m ? 'bg-black text-white' : 'opacity-40'}`}> {m} </button>
                      ))}
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setShowCreator(true)}
                        className="px-6 py-2 bg-black text-white text-[10px] font-mono uppercase tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2 editorial-shadow h-full"
                      >
                        <Plus size={10} /> Add Agent
                      </button>
                      {selectedForComparison.length > 0 && (
                        <button 
                           onClick={() => setSelectedForComparison([])}
                           className="px-4 py-2 border-2 border-black text-[10px] font-mono uppercase font-bold hover:bg-zinc-100 transition-colors h-full"
                        >
                           Clear ({selectedForComparison.length})
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <span className="px-3 py-2 border border-[#1A1A1A] text-[10px] font-mono uppercase tracking-widest">Network Health: Stable</span>
                  </div>
                </div>
              </div>

              <section className="bg-stone-50 p-12 border-2 border-black/5 editorial-shadow-sm">
                 <div className="flex items-center gap-4 mb-10">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-serif italic text-xl">I</div>
                    <div>
                       <h3 className="text-2xl font-serif font-bold tracking-tighter uppercase mb-1">Role Templates</h3>
                       <p className="text-[10px] font-mono uppercase tracking-widest opacity-40">System Architectures // Foundational Blueprints</p>
                    </div>
                 </div>
                 <ArchetypeSelector onSelect={(id) => {
                   // Integration for spawning groups is handled via future simulation turns
                   console.log('Archetype selection persistent signal emitted:', id);
                 }} />
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2">
                {filteredAgents.map((agent) => (
                   <AgentCardItem key={agent.id} agent={agent} relationships={allRelationships.filter(r => r.sourceId === agent.id || r.targetId === agent.id)} />
                ))}
                <ArchetypeSelector onSelect={() => {}} agents={agents} userId={user?.uid || ''} />
              </div>

              <AnimatePresence>
                {selectedForComparison.length === 2 && (
                  <ComparisonDashboard 
                    agentA={selectedForComparison[0]} 
                    agentB={selectedForComparison[1]} 
                    onClose={() => setSelectedForComparison([])} 
                  />
                )}
              </AnimatePresence>

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
            <motion.div key="swarm" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <SwarmBoard 
                activeJob={activeJob} 
                tasks={tasks} 
                agents={agents} 
                relationships={allRelationships}
                onStartJob={handleStartJob}
                currentEnvironment={currentEnvironment}
                setCurrentEnvironment={setCurrentEnvironment}
                onExecuteJob={async () => {
                  if (activeJob) {
                    await setActiveJob({ ...activeJob, status: 'executing' });
                  }
                }}
              />
            </motion.div>
          )}

          {view === 'jobs' && (
              <motion.div key="jobs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <BenchmarkLab 
                  agents={agents}
                  jobs={jobs} 
                  onSelectJob={(j: any) => { setActiveJob(j); setView('swarm'); }} 
                />
              </motion.div>
          )}

          {view === 'visualizer' && (
            <motion.div key="visualizer" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div className="border border-black/10 p-12 bg-white editorial-shadow mb-12">
                <h2 className="text-4xl font-serif mb-6 leading-tight">Sociometric Graph & DNA Mapping</h2>
                <p className="text-xs font-mono uppercase tracking-widest opacity-40 mb-12 max-w-xl leading-relaxed">
                  Visualization of the emergent trust networks between agent identities. Mapping cognitive resonance across {agents.length} nodes via {allRelationships.length} edges.
                </p>
                <div className="h-[600px] bg-black/5 rounded-sm relative overflow-hidden flex items-center justify-center">
                  <SwarmVisualizer agents={agents} relationships={allRelationships} tasks={allTasks} />
                </div>
              </div>
            </motion.div>
          )}

          {view === 'insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-16"
            >
              <section className="border-l-4 border-black pl-6 ml-2">
                <h2 className="text-4xl font-serif leading-tight mb-4 tracking-tight">Civitas <span className="italic">Audience</span> Registry.</h2>
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] mb-4 opacity-40 italic">
                  Mapping demographics, motivations, and operational constraints for target ecosystem users.
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                {USER_PERSONAS.map(p => (
                  <div 
                    key={p.id}
                    onClick={() => {
                      setSelectedUserPersonas(prev => 
                        prev.find(up => up.id === p.id) 
                          ? prev.filter(up => up.id !== p.id)
                          : [...prev, p]
                      );
                    }}
                    className={`p-6 border-2 transition-all cursor-pointer ${
                      selectedUserPersonas.find(up => up.id === p.id) 
                        ? 'border-black bg-white editorial-shadow' 
                        : 'border-black/5 bg-stone-50 hover:border-black/20'
                    }`}
                  >
                    <div className="flex flex-col items-center text-center">
                       <img src={p.avatar_url} alt={p.name} className="w-20 h-20 border border-black/10 grayscale mb-4" />
                       <h4 className="font-serif font-bold text-xl leading-tight">{p.name}</h4>
                       <p className="text-[9px] font-mono uppercase text-blue-600 font-bold mb-4">{p.occupation}</p>
                       <div className="text-[10px] leading-relaxed opacity-60 line-clamp-3 italic">
                         "{p.bio}"
                       </div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedUserPersonas.length > 0 && (
                <section>
                   <div className="flex justify-between items-center mb-8">
                      <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest">Active Analysis Panel</h4>
                      <button 
                        onClick={() => setSelectedUserPersonas([])}
                        className="text-[10px] font-mono uppercase underline opacity-40 hover:opacity-100"
                      >
                        Reset Selection
                      </button>
                   </div>
                   <PersonaComparisonTable 
                     personas={selectedUserPersonas} 
                     onRemove={(id) => setSelectedUserPersonas(prev => prev.filter(p => p.id !== id))}
                     onClose={() => setSelectedUserPersonas([])}
                   />
                </section>
              )}

              <section className="pt-12 border-t border-black/10">
                <AffinityMapper />
              </section>
            </motion.div>
          )}

          {view === 'blueprint' && (
            <motion.div 
              key="blueprint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <SwarmMethodologyGuide />
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

        <AnimatePresence>
           {legacyAgent && (
             <motion.div 
               initial={{ opacity: 0, y: 50 }}
               animate={{ opacity: 1, y: 0 }}
               className="fixed bottom-8 right-8 z-[60] max-w-sm"
             >
                <div className="bg-blue-600 text-white border-4 border-black editorial-shadow p-6">
                   <div className="flex gap-4 items-start mb-4">
                      <div className="bg-white text-blue-600 p-2 rounded-full">
                         <AlertCircle size={24} />
                      </div>
                      <div>
                         <h4 className="font-serif font-bold italic text-lg leading-tight">Mastery Milestone: LVL 20</h4>
                         <p className="text-[10px] font-mono uppercase opacity-80 mt-1">{legacyAgent.persona_metadata?.name} has reached master status.</p>
                      </div>
                      <button onClick={() => setLegacyAgent(null)} className="opacity-50 hover:opacity-100">
                         <X size={16} />
                      </button>
                   </div>
                   <div className="bg-black/20 p-4 mb-4 text-[10px] font-mono leading-relaxed uppercase italic">
                      Performance history suggests sufficient specialization to authorize a successor. Update DNA?
                   </div>
                   <button 
                     onClick={() => spawnOffspring(legacyAgent).then(() => setLegacyAgent(null))}
                     className="w-full bg-white text-blue-600 py-3 font-mono text-[10px] uppercase font-bold tracking-widest hover:bg-zinc-100 transition-colors flex items-center justify-center gap-2"
                   >
                      <GitBranch size={14} /> Initialize Heir
                   </button>
                </div>
             </motion.div>
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
