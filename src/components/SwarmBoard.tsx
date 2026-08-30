import React, { useState } from 'react';
import { AgentCard, SwarmJob, SwarmTask, SwarmEnvironment, SwarmEnvironmentCondition, WorkspaceRole } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Plus, Search, Activity, ChevronRight, CheckCircle2, AlertCircle, Loader2, Users, CloudRain, Sun, Wind, CloudLightning, ShieldAlert, ThumbsUp, ThumbsDown, Coins, GitFork, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { SocialFeed } from './SocialFeed';

interface Props {
  agents: AgentCard[];
  onStartJob: (goal: string, selectedAgentIds: string[]) => void;
  onRateTask?: (taskId: string, rating: 'up' | 'down') => void;
  activeJob?: SwarmJob;
  tasks: SwarmTask[];
  relationships?: any[];
  currentEnvironment?: SwarmEnvironment;
  setCurrentEnvironment?: (env: SwarmEnvironment) => void;
  userRole?: WorkspaceRole;
}

export const SwarmBoard: React.FC<Props> = ({ 
  agents = [], 
  onStartJob, 
  onRateTask,
  activeJob, 
  tasks = [], 
  relationships = [],
  currentEnvironment,
  setCurrentEnvironment,
  userRole = 'admin'
}) => {
  const [goal, setGoal] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [expandedBidsTaskId, setExpandedBidsTaskId] = useState<string | null>(null);

  const toggleAgent = (id: string) => {
    setSelectedAgents(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  const isViewer = userRole === 'viewer';
  const executors = agents.filter(a => a.mode === 'executor');
  const critics = agents.filter(a => a.mode === 'critic');

  const envOptions: { value: SwarmEnvironmentCondition; label: string; icon: React.ReactNode; desc: string }[] = [
    { value: 'innovation_phase', label: 'Innovation Phase', icon: <Sun size={14} />, desc: 'Creativity up, base interactions up. Unstructured.' },
    { value: 'crunch_time', label: 'Crunch Time', icon: <CloudLightning size={14} />, desc: 'Deadlines loom. Conscientiousness thrives, adaptability drops.' },
    { value: 'maintenance_mode', label: 'Maintenance', icon: <Wind size={14} />, desc: 'Focus on stability. Low extraversion agents prefer this.' },
    { value: 'resource_starved', label: 'Resource Starved', icon: <CloudRain size={14} />, desc: 'Budget/compute low. Technical depth drives adaptability.' },
    { value: 'high_ambiguity', label: 'High Ambiguity', icon: <ShieldAlert size={14} />, desc: 'Vague requirements. Strategic thinkers thrive.' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Left: Configuration */}
      <div className="lg:col-span-4 space-y-8">
        
        {currentEnvironment && setCurrentEnvironment && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 border-b border-black pb-2">
              <Activity size={16} />
              <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Swarm Environment</h3>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {envOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setCurrentEnvironment({ ...currentEnvironment, condition: opt.value })}
                  className={`flex items-start gap-3 p-3 editorial-border transition-all text-left ${
                    currentEnvironment.condition === opt.value ? 'bg-black text-white' : 'bg-white hover:bg-stone-100'
                  }`}
                >
                  <div className="mt-0.5">{opt.icon}</div>
                  <div>
                    <div className="font-serif text-sm font-bold uppercase">{opt.label}</div>
                    <div className={`font-mono text-[9px] uppercase mt-1 ${currentEnvironment.condition === opt.value ? 'opacity-80' : 'opacity-60'}`}>
                      {opt.desc}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-black pb-2">
            <Plus size={16} />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Initiate Objective</h3>
          </div>
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe the system or feature you wish to simulate..."
            className="w-full h-32 p-4 editorial-border bg-white font-serif text-lg focus:outline-none focus:ring-2 ring-black/5"
          />
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b border-black pb-2">
            <Activity size={16} />
            <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Select Active Pool</h3>
          </div>
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-mono opacity-60">Executors</p>
            <div className="grid grid-cols-1 gap-2">
              {executors.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`flex items-center justify-between p-3 editorial-border transition-all ${
                    selectedAgents.includes(agent.id) ? 'bg-black text-white' : 'bg-white hover:bg-stone-100'
                  }`}
                >
                  <span className="font-serif text-sm font-bold uppercase">{agent.role}</span>
                  {selectedAgents.includes(agent.id) && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
            
            <p className="text-[10px] uppercase font-mono opacity-60 mt-4">Critics</p>
            <div className="grid grid-cols-1 gap-2">
              {critics.map(agent => (
                <button
                  key={agent.id}
                  onClick={() => toggleAgent(agent.id)}
                  className={`flex items-center justify-between p-3 editorial-border translate-x-1 ${
                    selectedAgents.includes(agent.id) ? 'bg-red-600 text-white border-red-600' : 'bg-[#F2EFE9] hover:bg-stone-100'
                  }`}
                >
                  <span className="font-serif text-sm font-bold uppercase">{agent.role}</span>
                  {selectedAgents.includes(agent.id) && <CheckCircle2 size={14} />}
                </button>
              ))}
            </div>
          </div>
        </section>

        {isViewer && (
          <div className="p-3 border border-amber-600/40 bg-amber-50 text-amber-900 font-mono text-[10px] uppercase flex items-center gap-2">
            <ShieldAlert size={14} className="text-amber-700 shrink-0" />
            <span>Viewer Mode: Read-only observation. Launching simulations requires Contributor or Admin role.</span>
          </div>
        )}

        <button
          onClick={() => onStartJob(goal, selectedAgents)}
          disabled={!goal || selectedAgents.length === 0 || !!activeJob || isViewer}
          className="w-full py-4 bg-black text-white font-mono uppercase tracking-[0.3em] font-bold text-sm editorial-shadow hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {activeJob ? 'Swarm Active...' : isViewer ? 'Read-Only (Viewer)' : 'Launch Simulation'}
        </button>

        <div className="pt-8">
           <SocialFeed relationships={relationships} agents={agents} />
        </div>
      </div>

      {/* Right: Active Swarm Timeline */}
      <div className="lg:col-span-8 flex flex-col">
        <div className="flex items-center justify-between border-b border-black pb-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black flex items-center justify-center text-white font-mono italic">
              {activeJob ? '01' : '00'}
            </div>
            <div>
              <h3 className="font-serif text-3xl font-bold tracking-tight">Active Execution</h3>
              <p className="font-mono text-[10px] uppercase opacity-60">
                {activeJob ? `Task Graph: ${tasks.length} Nodes` : 'System Idle // Awaiting Input'}
              </p>
            </div>
          </div>
          {activeJob && (
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-black text-white text-[10px] font-mono uppercase tracking-widest animate-pulse">Running</span>
            </div>
          )}
        </div>

        <div className="flex-1 space-y-6">
          <AnimatePresence mode="popLayout">
            {tasks.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center border-2 border-dashed border-black/10 p-12 text-center"
              >
                <div className="w-24 h-24 rounded-full border border-black/10 flex items-center justify-center mb-6">
                  <Search className="opacity-20" size={40} />
                </div>
                <p className="font-serif italic text-2xl opacity-40">The workspace is currently vacant.</p>
                <p className="font-mono text-[10px] uppercase mt-2 opacity-30">Initiate a goal to populate the task graph.</p>
              </motion.div>
            ) : (
              tasks.map((task, idx) => (
                <motion.div
                  key={task.id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="editorial-border bg-white p-6 editorial-shadow flex gap-6 items-start"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="font-mono text-[10px] font-bold">#{idx + 1}</div>
                    <div className={`w-1 h-full border-l border-dotted border-black/30 my-2`} />
                    {task.status === 'done' ? (
                      <CheckCircle2 className="text-green-600" size={20} />
                    ) : task.status === 'in_progress' ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-black" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-serif text-xl font-bold uppercase tracking-tight">{task.id.replace(/_/g, ' ')}</h4>
                      <div className="flex items-center gap-2">
                        {task.is_delegated && (
                          <span className="font-mono text-[9px] px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 uppercase font-bold flex items-center gap-1">
                            <GitFork size={10} /> Delegated
                          </span>
                        )}
                        <span className="font-mono text-[10px] px-2 bg-stone-100 uppercase">{task.type}</span>
                      </div>
                    </div>
                    <p className="font-sans text-sm italic mb-3 opacity-70">"{task.description}"</p>

                    {/* Peer-to-Peer Delegation Banner */}
                    {(task.delegated_by || task.is_delegated) && (
                      <div className="mb-3 p-2.5 bg-stone-50 border-l-2 border-indigo-600 font-mono text-[10px] space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-indigo-950">
                          <GitFork size={11} className="text-indigo-600" />
                          <span>Autonomous Peer Delegation</span>
                        </div>
                        <p className="text-stone-600 font-sans text-xs">
                          Assigned by <strong>{agents.find(a => a.id === task.delegated_by)?.role || task.delegated_by || 'Lead'}</strong> to <strong>{agents.find(a => a.id === task.delegated_to)?.role || task.delegated_to || 'Peer'}</strong>: "{task.delegation_reason}"
                        </p>
                      </div>
                    )}

                    {/* Decomposed Subtask Indicators */}
                    {task.subtask_ids && task.subtask_ids.length > 0 && (
                      <div className="mb-3 flex items-center gap-1.5 font-mono text-[9px] text-stone-500 bg-stone-100/70 px-2 py-1 border border-black/10">
                        <GitFork size={10} />
                        <span>Decomposed into {task.subtask_ids.length} peer sub-task node(s)</span>
                      </div>
                    )}

                    {/* Market-Based Task Auction & Bids Order Book */}
                    {task.winning_bid && (
                      <div className="mb-3 p-2 border border-black/15 bg-[#FDFCF9] space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Coins size={12} className="text-amber-700" />
                            <span className="font-mono text-[9px] uppercase font-bold text-stone-800">Auction Cleared</span>
                            <span className="font-mono text-[9px] px-1.5 py-0.2 bg-amber-100 text-amber-900 font-bold border border-amber-300">
                              Wager: {task.winning_bid.bidAmount} Tokens
                            </span>
                            <span className="font-mono text-[9px] text-stone-500">
                              (Resonance: {Math.round(task.winning_bid.resonanceScore * 100)}%)
                            </span>
                          </div>
                          {task.bids && task.bids.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setExpandedBidsTaskId(expandedBidsTaskId === task.id ? null : task.id)}
                              className="font-mono text-[9px] uppercase text-stone-600 hover:text-black flex items-center gap-0.5"
                            >
                              {expandedBidsTaskId === task.id ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                              {task.bids.length} Bids
                            </button>
                          )}
                        </div>

                        {/* Expandable Order Book */}
                        {expandedBidsTaskId === task.id && task.bids && (
                          <div className="pt-2 border-t border-black/10 space-y-1 font-mono text-[9px]">
                            <div className="text-stone-400 uppercase text-[8px]">Order Book Wagers</div>
                            {task.bids.map((b, bIdx) => {
                              const bidder = agents.find(a => a.id === b.agentId);
                              const isWinner = b.agentId === task.winning_bid?.agentId;
                              return (
                                <div key={bIdx} className={`flex items-center justify-between p-1 border ${isWinner ? 'bg-amber-50 border-amber-300 font-bold' : 'border-stone-200'}`}>
                                  <span>{bidder?.role || b.agentId}</span>
                                  <div className="flex items-center gap-2">
                                    <span>{b.bidAmount} TKN</span>
                                    <span className="text-stone-400">{Math.round(b.resonanceScore * 100)}% Res</span>
                                    {isWinner && <span className="text-amber-800 text-[8px] uppercase">Winner</span>}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}

                    {task.output?.content && (
                      <div className="mt-4 space-y-2">
                        <div className="p-4 bg-stone-50 editorial-border font-mono text-[11px] max-h-40 overflow-y-auto whitespace-pre-wrap">
                          {task.output.content}
                        </div>

                        {/* Human-in-the-Loop Feedback Controls */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-black/10">
                          <span className="font-mono text-[9px] uppercase opacity-60">
                            Executed By: {agents.find(a => a.id === task.assigned_agents?.[0])?.role || 'Swarm Node'}
                          </span>

                          <div className="flex items-center gap-2">
                            {(task.output as any)?.userRating ? (
                              <span className={`px-2 py-0.5 font-mono text-[9px] uppercase font-bold border ${
                                (task.output as any).userRating.type === 'up'
                                  ? 'bg-green-50 border-green-600 text-green-800'
                                  : 'bg-red-50 border-red-600 text-red-800'
                              }`}>
                                {(task.output as any).userRating.type === 'up' ? '✓ Approved (+5 Rep)' : 'Critiqued (-3 Rep)'}
                              </span>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <span className="font-mono text-[9px] uppercase opacity-50">Review:</span>
                                <button
                                  type="button"
                                  onClick={() => onRateTask?.(task.id, 'up')}
                                  className="px-2 py-1 border border-black bg-white hover:bg-green-50 text-green-700 transition-colors flex items-center gap-1 text-[9px] font-mono font-bold uppercase"
                                  title="Approve artifact (+5 Rep, +4 Trust)"
                                >
                                  <ThumbsUp size={10} /> Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => onRateTask?.(task.id, 'down')}
                                  className="px-2 py-1 border border-black bg-white hover:bg-red-50 text-red-700 transition-colors flex items-center gap-1 text-[9px] font-mono font-bold uppercase"
                                  title="Critique artifact (-3 Rep, -3 Trust)"
                                >
                                  <ThumbsDown size={10} /> Critique
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
