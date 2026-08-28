import React, { useState, useMemo } from 'react';
import { AgentCard } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { GitBranch, Dna, ArrowRight, ShieldCheck, Zap, Sparkles, ChevronRight, User } from 'lucide-react';

interface LineageVisualizerProps {
  agents: AgentCard[];
  onSelectAgent?: (agent: AgentCard) => void;
}

export const LineageVisualizer: React.FC<LineageVisualizerProps> = ({ agents, onSelectAgent }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentCard | null>(null);

  // Group agents by generation
  const { generations, maxGen, familyTrees } = useMemo(() => {
    const genMap = new Map<number, AgentCard[]>();
    let max = 1;

    agents.forEach(agent => {
      const gen = agent.lineage?.generation || 1;
      if (gen > max) max = gen;
      if (!genMap.has(gen)) genMap.set(gen, []);
      genMap.get(gen)!.push(agent);
    });

    // Build parent-child relationships
    const trees: { parent: AgentCard; children: AgentCard[] }[] = [];
    agents.forEach(agent => {
      const children = agents.filter(a => a.lineage?.parent_id === agent.id);
      if (children.length > 0) {
        trees.push({ parent: agent, children });
      }
    });

    return {
      generations: genMap,
      maxGen: max,
      familyTrees: trees
    };
  }, [agents]);

  const handleAgentClick = (agent: AgentCard) => {
    setSelectedAgent(agent);
    if (onSelectAgent) {
      onSelectAgent(agent);
    }
  };

  return (
    <div className="w-full bg-white border-2 border-black p-6 editorial-shadow">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 pb-4 border-b border-black/10">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest opacity-60 mb-1">
            <GitBranch size={14} />
            <span>Genealogical DNA Map // Lineage Inheritance Engine</span>
          </div>
          <h3 className="text-2xl font-serif font-bold tracking-tight">Ecosystem Ancestry & Mutation Trees</h3>
        </div>
        <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-black rounded-full inline-block"></span>
            <span>Genesis (Gen 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full inline-block"></span>
            <span>Heir Offspring (Gen 2+)</span>
          </div>
          <div className="px-3 py-1 bg-stone-100 border border-black/20">
            <span>Depth: {maxGen} Generations</span>
          </div>
        </div>
      </div>

      {/* Multi-Generational Horizontal Swimlane Layout */}
      <div className="relative overflow-x-auto pb-6">
        <div className="min-w-[800px] flex gap-12 items-start relative">
          {Array.from({ length: maxGen }, (_, i) => i + 1).map((genNum) => {
            const genAgents = generations.get(genNum) || [];
            return (
              <div key={genNum} className="flex-1 flex flex-col gap-4">
                {/* Generation Header */}
                <div className="p-3 bg-stone-50 border-2 border-black/10 flex justify-between items-center">
                  <span className="font-mono text-xs uppercase font-bold tracking-widest flex items-center gap-1.5">
                    <Dna size={12} className={genNum === 1 ? 'text-black' : 'text-blue-600'} />
                    Generation {genNum}
                  </span>
                  <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-white border border-black/10">
                    {genAgents.length} {genAgents.length === 1 ? 'Node' : 'Nodes'}
                  </span>
                </div>

                {/* Agents in Generation */}
                <div className="flex flex-col gap-4">
                  {genAgents.length === 0 ? (
                    <div className="p-6 border border-dashed border-black/20 text-center text-[10px] font-mono uppercase opacity-40">
                      No lineage nodes in Gen {genNum}
                    </div>
                  ) : (
                    genAgents.map(agent => {
                      const isSelected = selectedAgent?.id === agent.id;
                      const parent = agent.lineage?.parent_id ? agents.find(a => a.id === agent.lineage?.parent_id) : null;
                      const childrenCount = agents.filter(a => a.lineage?.parent_id === agent.id).length;
                      const mutations = agent.lineage?.mutations || [];

                      return (
                        <motion.div
                          key={agent.id}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleAgentClick(agent)}
                          className={`p-4 border-2 transition-all cursor-pointer relative ${
                            isSelected 
                              ? 'border-black bg-stone-50 editorial-shadow' 
                              : 'border-black/20 bg-white hover:border-black/60'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex items-center gap-2">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-mono font-bold ${
                                genNum === 1 ? 'bg-black' : 'bg-blue-600'
                              }`}>
                                {genNum}
                              </div>
                              <div>
                                <h4 className="font-serif font-bold text-sm leading-none">
                                  {agent.persona_metadata?.name || agent.role}
                                </h4>
                                <p className="text-[9px] font-mono uppercase tracking-widest opacity-50 mt-0.5">
                                  {agent.role}
                                </p>
                              </div>
                            </div>
                            <span className="text-[8px] font-mono uppercase font-bold px-1.5 py-0.5 bg-black/5">
                              LVL {agent.level || 1}
                            </span>
                          </div>

                          {/* Lineage Trace Info */}
                          {parent && (
                            <div className="mt-2 pt-2 border-t border-black/5 flex items-center gap-1 text-[8px] font-mono uppercase text-blue-700">
                              <span>Heir of:</span>
                              <span className="font-bold underline">{parent.persona_metadata?.name || parent.role}</span>
                            </div>
                          )}

                          {/* Offspring Indicators */}
                          {childrenCount > 0 && (
                            <div className="mt-1 flex items-center gap-1 text-[8px] font-mono uppercase text-emerald-700">
                              <span>Offspring:</span>
                              <span className="font-bold">{childrenCount} successor{childrenCount > 1 ? 's' : ''} spawned</span>
                            </div>
                          )}

                          {/* Mutation badges */}
                          {mutations.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {mutations.map((m, idx) => (
                                <span key={idx} className="text-[7px] font-mono uppercase px-1.5 py-0.5 bg-amber-100 text-amber-900 border border-amber-300 flex items-center gap-1">
                                  <Sparkles size={8} />
                                  {m}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Capability Snapshot Mini Bars */}
                          <div className="mt-3 grid grid-cols-3 gap-1 pt-2 border-t border-black/5 text-[8px] font-mono uppercase">
                            <div>
                              <span className="opacity-40 block text-[6px]">TECH</span>
                              <div className="h-1 bg-black/10 rounded-xs overflow-hidden mt-0.5">
                                <div 
                                  className="h-full bg-black" 
                                  style={{ width: `${Math.round((agent.capability_vector?.technical_depth ?? 0.5) * 100)}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className="opacity-40 block text-[6px]">CREAT</span>
                              <div className="h-1 bg-black/10 rounded-xs overflow-hidden mt-0.5">
                                <div 
                                  className="h-full bg-black" 
                                  style={{ width: `${Math.round((agent.capability_vector?.creativity ?? 0.5) * 100)}%` }}
                                />
                              </div>
                            </div>
                            <div>
                              <span className="opacity-40 block text-[6px]">RELIAB</span>
                              <div className="h-1 bg-black/10 rounded-xs overflow-hidden mt-0.5">
                                <div 
                                  className="h-full bg-black" 
                                  style={{ width: `${Math.round((agent.capability_vector?.reliability ?? 0.5) * 100)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Detailed Ancestry Card */}
      <AnimatePresence>
        {selectedAgent && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="mt-6 p-6 bg-stone-50 border-2 border-black editorial-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-black text-white font-mono text-[9px] uppercase tracking-widest">
                  Gen {selectedAgent.lineage?.generation || 1} Inspector
                </span>
                <span className="font-mono text-[9px] uppercase opacity-50">
                  ID: {selectedAgent.id.slice(0, 12)}
                </span>
              </div>
              <h4 className="text-xl font-serif font-bold">
                {selectedAgent.persona_metadata?.name || selectedAgent.role}
              </h4>
              <p className="text-xs font-mono text-stone-600 max-w-2xl leading-relaxed">
                {selectedAgent.persona_metadata?.bio || 'Autonomous ecosystem agent node.'}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right font-mono text-[9px] uppercase">
                <div className="opacity-50">Experience & Mastery</div>
                <div className="font-bold text-sm">LVL {selectedAgent.level || 1} // {selectedAgent.exp || 0} XP</div>
              </div>
              <button 
                onClick={() => setSelectedAgent(null)}
                className="px-4 py-2 bg-black text-white text-[10px] font-mono uppercase tracking-widest hover:bg-black/80 transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
