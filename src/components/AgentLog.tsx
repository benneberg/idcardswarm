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
  const [tab, setTab] = useState<'logs' | 'evolution'>('logs');
  const agentTasks = tasks.filter(t => t.assigned_agents.includes(agent.id));
  const sortedLogs = agentTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleEvolve = async (key: string) => {
    if (!agent.skill_points || agent.skill_points <= 0) return;

    const newVector = { ...agent.capability_vector };
    newVector[key] = Math.min(1, (newVector[key] || 0) + 0.05);

    await updateDoc(doc(db, 'agents', agent.id), {
      capability_vector: newVector,
      skill_points: agent.skill_points - 1,
      updatedAt: serverTimestamp()
    });
  };

  return (
    <div className="bg-white border-4 border-black editorial-shadow overflow-hidden">
      <div className="bg-black text-white p-6 flex justify-between items-center">
        <div>
           <p className="text-[10px] font-mono opacity-50 uppercase tracking-widest mb-1">Chronological Feed // ID_{agent.id.slice(0, 8).toUpperCase()}</p>
           <h3 className="text-2xl font-serif">{agent.persona_metadata?.name || agent.role} Swarm Dossier</h3>
        </div>
        <div className="text-right">
           <p className="text-[10px] font-mono opacity-50 uppercase">Skill Points Available</p>
           <p className="text-2xl font-serif italic text-yellow-400">{agent.skill_points || 0}</p>
        </div>
      </div>

      <div className="flex border-b border-black font-mono text-[10px] uppercase font-bold">
        <button 
          onClick={() => setTab('logs')}
          className={`px-8 py-4 border-r border-black hover:bg-black/5 transition-colors ${tab === 'logs' ? 'bg-black text-white' : ''}`}
        >
          Interaction Logs
        </button>
        <button 
          onClick={() => setTab('evolution')}
          className={`px-8 py-4 hover:bg-black/5 transition-colors flex items-center gap-2 ${tab === 'evolution' ? 'bg-black text-white' : ''}`}
        >
          <TrendingUp size={12} />
          Vector Evolution
        </button>
      </div>

      <div className="p-8 max-h-[600px] overflow-y-auto">
        <AnimatePresence mode="wait">
          {tab === 'logs' ? (
            <motion.div 
              key="logs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {sortedLogs.length === 0 ? (
                <div className="py-20 text-center border-2 border-dashed border-black/10">
                  <p className="font-serif italic text-xl opacity-40">No recorded history in the current cycle.</p>
                </div>
              ) : (
                sortedLogs.map((task, idx) => (
                  <div 
                    key={task.id}
                    className="relative pl-12 pb-8 border-l border-black/10 last:border-0"
                  >
                    <div className="absolute left-[-10px] top-0 w-5 h-5 bg-black border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-1 h-1 bg-white" />
                    </div>
                    
                    <div className="flex items-center gap-4 mb-2">
                      <span className="font-mono text-[10px] bg-stone-100 px-2 py-1 uppercase tracking-tighter">
                        {new Date(task.createdAt).toLocaleString()}
                      </span>
                      <span className="font-mono text-[10px] text-orange-600 font-bold uppercase tracking-widest">
                        {task.status}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-lg font-serif font-bold leading-tight underline decoration-1 underline-offset-4">
                        {task.type}: {task.id.replace(/_/g, ' ')}
                      </h4>
                      <p className="text-sm font-sans italic opacity-70 leading-relaxed max-w-2xl">
                        "{task.description}"
                      </p>
                      
                      <div className="flex gap-6 mt-4">
                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
                          <Layers size={12} />
                          COMPLEXITY: {task.complexity || 5}/10
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-mono opacity-50">
                          <Zap size={12} />
                          XP YIELD: {(task.complexity || 5) * 10}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="evolution"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              <div className="bg-zinc-50 border border-black/10 p-6">
                <p className="font-serif italic text-lg mb-4">"Continuous iterative refinement is the only path to swarm sovereignty."</p>
                <p className="text-[10px] font-mono uppercase opacity-40">Spend Skill Points to refine capability vectors by +5% per increment.</p>
              </div>

              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                   <CapabilityRadar capabilityVector={agent.capability_vector} />
                </div>
                <div className="lg:w-1/2 space-y-6">
                  {Object.entries(agent.capability_vector || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between group">
                    <div className="w-full mr-8">
                       <div className="flex justify-between mb-2">
                         <span className="font-mono text-xs uppercase font-bold">{key.replace('_', ' ')}</span>
                         <span className="font-mono text-xs">{(Number(value) * 100).toFixed(0)}%</span>
                       </div>
                       <div className="h-2 bg-black/5 w-full relative">
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
                      className="shrink-0 bg-black text-white p-3 hover:opacity-80 disabled:opacity-20 transition-all"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
