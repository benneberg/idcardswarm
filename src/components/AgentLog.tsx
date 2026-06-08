import React, { useState } from 'react';
import { AgentCard, SwarmTask } from '../types';
import { db } from '../lib/firebase';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Layers, Clock, Zap, TrendingUp, ChevronRight, Plus } from 'lucide-react';
import { CapabilityRadar } from './CapabilityRadar.tsx';

interface Props {
  agent: AgentCard;
  tasks: SwarmTask[];
}

export const AgentLog: React.FC<Props> = ({ agent, tasks }) => {
  const [tab, setTab] = useState<'logs' | 'evolution' | 'relationships'>('logs');
  const agentTasks = tasks.filter(t => t.assigned_agents.includes(agent.id));
  const sortedLogs = agentTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleEvolve = async (key: string) => {
    if (!agent.skill_points || agent.skill_points <= 0) return;

    const newVector = { ...agent.capability_vector };
    newVector[key] = Math.min(1, (Number(newVector[key]) || 0) + 0.05);

    await updateDoc(doc(db, 'agents', agent.id), {
      capability_vector: newVector,
      skill_points: agent.skill_points - 1,
      updatedAt: serverTimestamp()
    });
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
          className={`px-8 py-4 hover:bg-black/5 transition-colors shrink-0 flex items-center gap-2 ${tab === 'relationships' ? 'bg-black text-white' : ''}`}
        >
          <MessageSquare size={12} />
          Relationship Graph
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
          ) : (
            <motion.div 
              key="relationships"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 text-center border-2 border-dashed border-black/10"
            >
              <Share2 className="mx-auto mb-4 opacity-10" size={48} />
              <p className="font-serif italic text-xl opacity-40">Relational trust networks are populating based on simulation cycles.</p>
              <p className="text-[10px] font-mono uppercase opacity-40 mt-2">Connecting context bridges... 42% synced</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
