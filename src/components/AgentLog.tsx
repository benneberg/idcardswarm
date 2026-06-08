import React, { useState, useEffect } from 'react';
import { AgentCard, SwarmTask } from '../types';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp, setDoc, getDoc, collection, addDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Layers, Clock, Zap, TrendingUp, ChevronRight, Plus, Share2, Send, GitBranch } from 'lucide-react';
import { CapabilityRadar } from './CapabilityRadar.tsx';
import { spawnOffspring } from '../lib/agentService';

interface Props {
  agent: AgentCard;
  tasks: SwarmTask[];
}

export const AgentLog: React.FC<Props> = ({ agent, tasks }) => {
  const [tab, setTab] = useState<'logs' | 'evolution' | 'relationships' | 'legacy' | 'genealogy'>('logs');
  const [quickTaskText, setQuickTaskText] = useState('');
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [ancestry, setAncestry] = useState<AgentCard[]>([]);

  const agentTasks = tasks.filter(t => t.assigned_agents.includes(agent.id));
  const sortedLogs = agentTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  useEffect(() => {
    if (tab === 'genealogy') {
      loadAncestry(agent);
    }
  }, [tab, agent]);

  const loadAncestry = async (current: AgentCard) => {
    const family: AgentCard[] = [];
    let parentId = current.lineage?.parent_id;
    
    while (parentId) {
      const parentDoc = await getDoc(doc(db, 'agents', parentId));
      if (parentDoc.exists()) {
        const parentData = { id: parentDoc.id, ...parentDoc.data() } as AgentCard;
        family.push(parentData);
        parentId = parentData.lineage?.parent_id;
        if (family.length > 5) break; // Safety break
      } else {
        break;
      }
    }
    setAncestry(family);
  };

  const handleQuickTask = async () => {
    if (!quickTaskText.trim() || !auth.currentUser) return;
    setIsSubmittingTask(true);
    
    try {
      // Create a direct task for this agent
      const taskData = {
        description: quickTaskText,
        type: 'Quick Directive',
        assigned_agents: [agent.id],
        status: 'pending',
        jobId: 'quick-tasks',
        dependencies: [],
        input: {},
        routing_tags: ['direct'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: auth.currentUser.uid
      };
      
      await addDoc(collection(db, 'tasks'), taskData);
      setQuickTaskText('');
      alert('Quick Directive issued to agent neural path.');
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, 'tasks');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  const handleSpawnHeir = async () => {
    try {
      const offspring = await spawnOffspring(agent);
      alert(`${offspring.persona_metadata?.name} has been initialized successfully.`);
    } catch (e) {
      console.error(e);
      alert('Failed to spawn offspring. Ensure agent has full behavioral metadata.');
    }
  };

  const handleEvolve = async (key: string) => {
    if (!agent.skill_points || agent.skill_points <= 0) return;

    const newVector = { ...agent.capability_vector };
    newVector[key] = Math.min(1, (Number(newVector[key]) || 0) + 0.05);

    try {
      await updateDoc(doc(db, 'agents', agent.id), {
        capability_vector: newVector,
        skill_points: agent.skill_points - 1,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `agents/${agent.id}`);
    }
  };

  const currentLevel = agent.level || 1;
  const reputation = agent.reputation || 50;
  const trustScore = agent.trustScore || 50;
  const lifecycle = agent.lifecycle_stage || 'collaboration';

  return (
    <div className="bg-white border-4 border-black editorial-shadow overflow-hidden">
      <div className="bg-black text-white p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <div className="flex items-center gap-4 mb-2">
              <p className="text-[10px] font-mono opacity-50 uppercase tracking-[0.3em]">Persistent Identity // {lifecycle} stage</p>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
           </div>
           <h3 className="text-4xl font-serif font-bold tracking-tight mb-2">{agent.persona_metadata?.name || agent.role}</h3>
           <div className="flex gap-4 font-mono text-[10px] uppercase">
              <span className="text-zinc-400">Level {currentLevel}</span>
              <span className="text-yellow-400">Reputation {reputation}</span>
              <span className="text-blue-400">Trust {trustScore}</span>
           </div>
        </div>
        <div className="text-right flex items-center gap-6 bg-zinc-900 p-4 border border-zinc-800">
           <div>
             <p className="text-[8px] font-mono opacity-50 uppercase tracking-widest mb-1">Skill Points</p>
             <p className="text-3xl font-serif italic text-yellow-400 font-bold">{agent.skill_points || 0}</p>
           </div>
           <Zap className="text-yellow-400 opacity-20" size={32} />
        </div>
      </div>

      <div className="flex border-b border-black font-mono text-[10px] uppercase font-bold overflow-x-auto">
        <button 
          onClick={() => setTab('logs')}
          className={`px-8 py-4 border-r border-black hover:bg-black/5 transition-colors shrink-0 ${tab === 'logs' ? 'bg-black text-white' : ''}`}
        >
          Activity Dossier
        </button>
        <button 
          onClick={() => setTab('evolution')}
          className={`px-8 py-4 border-r border-black hover:bg-black/5 transition-colors shrink-0 flex items-center gap-2 ${tab === 'evolution' ? 'bg-black text-white' : ''}`}
        >
          <TrendingUp size={12} />
          Evolution DNA
        </button>
        <button 
          onClick={() => setTab('relationships')}
          className={`px-8 py-4 border-r border-black hover:bg-black/5 transition-colors shrink-0 flex items-center gap-2 ${tab === 'relationships' ? 'bg-black text-white' : ''}`}
        >
          <MessageSquare size={12} />
          Sociometrics
        </button>
        <button 
          onClick={() => setTab('legacy')}
          className={`px-8 py-4 border-r border-black hover:bg-black/5 transition-colors shrink-0 flex items-center gap-2 ${tab === 'legacy' ? 'bg-black text-white' : ''}`}
        >
          <Layers size={12} />
          Lineage
        </button>
        <button 
          onClick={() => setTab('genealogy')}
          className={`px-8 py-4 hover:bg-black/5 transition-colors shrink-0 flex items-center gap-2 ${tab === 'genealogy' ? 'bg-black text-white' : ''}`}
        >
          <GitBranch size={12} />
          Genealogy
        </button>
      </div>

      <div className="p-8 max-h-[600px] overflow-y-auto bg-stone-50/50">
        <AnimatePresence mode="wait">
          {tab === 'logs' ? (
            <motion.div 
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Quick Task Section */}
              <div className="bg-white p-6 border-2 border-black editorial-shadow-sm">
                <h5 className="font-mono text-[10px] uppercase font-bold mb-4 flex items-center gap-2">
                  <Send size={12} />
                  Issue Quick Directive
                </h5>
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    value={quickTaskText}
                    onChange={(e) => setQuickTaskText(e.target.value)}
                    placeholder="Enter immediate task description..."
                    className="flex-1 px-4 py-2 border-2 border-black font-mono text-xs focus:ring-2 focus:ring-black outline-none"
                    disabled={isSubmittingTask}
                  />
                  <button 
                    onClick={handleQuickTask}
                    disabled={!quickTaskText.trim() || isSubmittingTask}
                    className="bg-black text-white px-6 py-2 font-mono text-[10px] uppercase font-bold hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    Deploy
                  </button>
                </div>
              </div>

              {/* Personality Quick View */}
              {agent.persona_metadata?.personality && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 py-6 border-b border-black/10">
                   {Object.entries(agent.persona_metadata.personality).map(([trait, val]) => (
                     <div key={trait} className="space-y-1">
                        <p className="text-[8px] font-mono uppercase opacity-40">{trait.replace('_', ' ')}</p>
                        <div className="h-1 bg-black/5 w-full">
                           <div className="h-full bg-black/60" style={{ width: `${Number(val)}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
              )}

              {sortedLogs.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-black/10">
                  <p className="font-serif italic text-xl opacity-40">No recorded history in the current cycle.</p>
                </div>
              ) : (
                sortedLogs.map((task) => (
                  <div key={task.id} className="relative pl-12 pb-8 border-l border-black/10 last:border-0 font-mono">
                    <div className="absolute left-[-10px] top-0 w-5 h-5 bg-black border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white" />
                    </div>
                    <p className="text-[9px] uppercase opacity-40 mb-2">{new Date(task.createdAt).toLocaleString()}</p>
                    <h4 className="text-lg font-serif font-bold underline mb-2">{task.type}</h4>
                    <p className="text-sm italic opacity-70 mb-4 font-sans">"{task.description}"</p>
                    <div className="flex gap-4 text-[8px] uppercase tracking-widest bg-white p-2 border border-black/5 inline-flex">
                       <span>XP: {(task.confidence || 0.5) * 100}</span>
                       <span>Yield: Positive</span>
                    </div>
                  </div>
                ))
              )}
            </motion.div>
          ) : tab === 'evolution' ? (
            <motion.div 
              key="evolution"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-zinc-900 text-white border-2 border-black p-6 editorial-shadow">
                <p className="font-serif italic text-lg mb-4 text-zinc-300">"Sovereignty is the child of iteration."</p>
                <p className="text-[9px] font-mono uppercase tracking-[0.2em] opacity-50">Authorized genetic refinement protocol active. DNA reconfiguration sequence initialized.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                 <div className="space-y-6">
                     <h4 className="font-mono text-[10px] uppercase tracking-widest border-b border-black/10 pb-2">Career Evolution DNA</h4>
                     <CapabilityRadar capabilityVector={agent.capability_vector} />
                     
                     <div className="bg-white p-4 border border-black/5 editorial-shadow-sm">
                        <p className="text-[8px] font-mono uppercase opacity-40 mb-3">Evolution Timeline</p>
                        <div className="space-y-4">
                           {[
                             { date: 'Initial Registry', label: 'Citizen Identity Initialized', type: 'system' },
                             { date: 'Level 2', label: 'Neural Path Specialization', type: 'milestone' },
                             { date: 'Level 5', label: 'Reputation Milestone: Trusted Partner', type: 'reputation' }
                           ].map((event, i) => (
                             <div key={i} className="flex gap-4 items-start">
                                <div className="shrink-0 w-2 h-2 rounded-full bg-black mt-1" />
                                <div>
                                   <p className="text-[9px] font-bold">{event.label}</p>
                                   <p className="text-[7px] font-mono opacity-40">{event.date}</p>
                                </div>
                             </div>
                           ))}
                        </div>
                     </div>
                 </div>
                 <div className="group space-y-4">
                    <h4 className="font-mono text-[10px] uppercase tracking-widest border-b border-black/10 pb-2">Genetic Vectors</h4>
                    <div className="max-h-[400px] overflow-y-auto pr-4 space-y-6">
                      {Object.entries(agent.capability_vector || {}).map(([key, value]) => (
                        key !== 'coding' && key !== 'system_design' && key !== 'debugging' && key !== 'ui_design' ? (
                          <div key={key} className="flex items-center justify-between">
                            <div className="w-full mr-8">
                              <div className="flex justify-between mb-2">
                                 <span className="font-mono text-[9px] uppercase font-bold tracking-widest">{key.replace(/_/g, ' ')}</span>
                                 <span className="font-mono text-xs font-bold text-blue-600">{(Number(value) * 100).toFixed(0)}%</span>
                              </div>
                              <div className="h-1 bg-black/5 w-full relative">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${Number(value) * 100}%` }}
                                   className="h-full bg-black"
                                 />
                              </div>
                            </div>
                            <button 
                              onClick={() => handleEvolve(key)}
                              disabled={!agent.skill_points || agent.skill_points <= 0 || Number(value) >= 1}
                              className="shrink-0 bg-black text-white p-2 hover:bg-yellow-400 hover:text-black disabled:opacity-10 transition-all border border-black"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                   ) : null
                  ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : tab === 'legacy' ? (
            <motion.div 
              key="legacy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-blue-600 text-white p-8 border-4 border-black editorial-shadow">
                 <h4 className="text-2xl font-serif font-bold italic mb-2 tracking-tight">The Legacy Protocol</h4>
                 <p className="text-xs font-mono opacity-80 uppercase tracking-widest leading-relaxed">Sovereign entities who have achieved specialization may authorize the creation of offspring. These successors inherit 70% of the parent's genetic capability DNA.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="bg-white p-6 border-2 border-black editorial-shadow-sm">
                    <p className="text-[10px] font-mono uppercase font-bold mb-4 opacity-40">Ancestry Stats</p>
                    <div className="space-y-4">
                       <div className="flex justify-between border-b border-black/5 pb-2">
                          <span className="text-[10px] uppercase font-mono">Current Generation</span>
                          <span className="font-serif font-bold italic">Gen {agent.lineage?.generation || 1}</span>
                       </div>
                       <div className="flex justify-between border-b border-black/5 pb-2">
                          <span className="text-[10px] uppercase font-mono">Status</span>
                          <span className="text-[10px] uppercase font-bold text-blue-600">{lifecycle} Stage</span>
                       </div>
                       {agent.lineage?.parent_id && (
                         <div className="flex justify-between border-b border-black/5 pb-2">
                            <span className="text-[10px] uppercase font-mono">Parent Identity</span>
                            <span className="text-[10px] uppercase font-bold truncate max-w-[150px]">{agent.lineage.parent_id.slice(0, 8)}...</span>
                         </div>
                       )}
                    </div>
                 </div>

                 <div className="flex items-center justify-center bg-[#f0f0f0] border-2 border-dashed border-black/20 p-8">
                    {['leadership', 'mentorship', 'legacy'].includes(lifecycle) ? (
                      <button 
                        onClick={handleSpawnHeir}
                        className="bg-black text-white px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-blue-600 transition-colors editorial-shadow"
                      >
                         Spawn Spiritual Successor
                      </button>
                    ) : (
                      <div className="text-center opacity-30">
                         <p className="font-serif italic text-lg opacity-40">"The fruit must ripen before the seed is sown."</p>
                         <p className="text-[8px] font-mono uppercase mt-2">Requirement: Reach Leadership Stage (Level 10)</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="p-6 bg-zinc-50 border border-black/5">
                 <h5 className="text-[10px] font-mono uppercase font-bold mb-4 opacity-40 italic">Active Specialization DNA</h5>
                 <div className="flex flex-wrap gap-2">
                    {Object.entries(agent.capability_vector || {})
                      .sort((a, b) => Number(b[1]) - Number(a[1]))
                      .slice(0, 3)
                      .map(([dna, val]) => (
                        <div key={dna} className="bg-white border border-black/10 px-4 py-2 flex items-center gap-3">
                           <div className="w-2 h-2 rounded-full bg-blue-500" />
                           <span className="text-[10px] font-mono uppercase font-bold">{dna.replace('_', ' ')}</span>
                           <span className="text-[10px] font-mono font-bold text-blue-600">{(Number(val) * 100).toFixed(0)}%</span>
                        </div>
                      ))
                    }
                 </div>
                 <p className="text-[9px] font-mono mt-4 opacity-40 uppercase tracking-widest">Offspring will prioritize these weights during initialization.</p>
              </div>

              {(agent.lineage?.generation || 1) > 1 && (
                <div className="pt-8 border-t border-black/10">
                   <p className="text-[10px] font-mono uppercase mb-4 opacity-40">Lineage Map</p>
                   <div className="flex items-center gap-4">
                      <div className="group relative">
                        <div className="w-12 h-12 border-2 border-dashed border-black bg-stone-200 flex items-center justify-center font-serif font-bold text-xs">ANCESTOR</div>
                        <div className="absolute top-14 left-0 w-max bg-black text-white text-[8px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity uppercase font-mono">Original Root Entity</div>
                      </div>
                      <ChevronRight size={16} opacity={0.3} />
                      <div className="w-14 h-14 border-2 border-black bg-white flex items-center justify-center font-serif font-bold text-sm shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">GEN {agent.lineage?.generation}</div>
                   </div>
                </div>
              )}
            </motion.div>
          ) : tab === 'genealogy' ? (
            <motion.div 
               key="genealogy"
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               exit={{ opacity: 0 }}
               className="space-y-12"
            >
               <div className="text-center p-8 border-2 border-black bg-white mb-12">
                  <h4 className="text-2xl font-serif font-bold italic mb-2 tracking-tight">The Ancestral Chain</h4>
                  <p className="text-[10px] font-mono opacity-50 uppercase tracking-[0.2em]">Visualizing the inherited neural architecture across generations.</p>
               </div>

               <div className="flex flex-col items-center">
                  {/* Current Agent */}
                  <div className="relative flex flex-col items-center">
                     <div className="w-24 h-24 border-4 border-black bg-white editorial-shadow p-2 z-10">
                        <img 
                          src={agent.persona_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} 
                          className="w-full h-full object-cover grayscale" 
                          alt="Root" 
                        />
                     </div>
                     <div className="mt-4 text-center">
                        <p className="font-serif font-bold">{agent.persona_metadata?.name || agent.role}</p>
                        <p className="text-[8px] font-mono uppercase bg-black text-white px-2 py-0.5 inline-block mt-1">Generation {agent.lineage?.generation || 1}</p>
                     </div>
                  </div>

                  {/* Connecting Lines and Ancestors */}
                  {ancestry.map((ancestor, index) => (
                    <React.Fragment key={ancestor.id}>
                       <div className="h-16 w-0.5 bg-black/20" />
                       <div className="relative flex flex-col items-center">
                          <div className="w-16 h-16 border-2 border-black/30 bg-zinc-50 editorial-shadow-sm p-1 grayscale group hover:grayscale-0 transition-all cursor-help">
                             <img 
                               src={ancestor.persona_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${ancestor.id}`} 
                               className="w-full h-full object-cover opacity-60" 
                               alt="Ancestor" 
                             />
                             <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <div className="mt-2 text-center opacity-60">
                             <p className="text-[10px] font-serif font-bold">{ancestor.persona_metadata?.name || ancestor.role}</p>
                             <p className="text-[7px] font-mono uppercase mt-0.5">Generation {ancestor.lineage?.generation || 1}</p>
                          </div>
                       </div>
                    </React.Fragment>
                  ))}
                  
                  {ancestry.length === 0 && agent.lineage?.parent_id && (
                     <div className="mt-8 p-4 bg-zinc-100 border border-dashed border-black/20 text-center animate-pulse">
                        <p className="text-[10px] font-mono uppercase opacity-40">Tracing neural origins...</p>
                     </div>
                  )}

                  {!agent.lineage?.parent_id && (
                    <div className="mt-12 flex flex-col items-center">
                       <div className="w-0.5 h-12 bg-black/20 border-dashed border-l" />
                       <div className="px-6 py-2 border border-black/20 text-[10px] font-mono uppercase opacity-40 italic">
                          Primary Ancestor // Root Entity
                       </div>
                    </div>
                  )}
               </div>
            </motion.div>
          ) : tab === 'relationships' ? (
            <motion.div 
              key="relationships"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center border-2 border-dashed border-black/10"
            >
              <Share2 className="mx-auto mb-4 opacity-10" size={48} />
              <p className="font-serif italic text-xl opacity-40">Relational trust networks are populating based on simulation cycles.</p>
              <p className="text-[10px] font-mono uppercase opacity-40 mt-2">Connecting context bridges... {Math.floor(Math.random() * 20 + 40)}% synced</p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
};
