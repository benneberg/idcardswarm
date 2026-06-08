import React from 'react';
import { SWARM_SCENARIOS } from '../data/seedScenarios';
import { AgentCard } from '../types';
import { motion } from 'motion/react';
import { Zap, Users, Target, FlaskConical } from 'lucide-react';

interface Props {
  agents: AgentCard[];
}

export const BenchmarkLab: React.FC<Props> = ({ agents }) => {
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end border-b-4 border-black pb-8">
        <div className="max-w-xl">
          <div className="flex items-center gap-3 text-xs font-mono uppercase tracking-[0.3em] mb-4 opacity-50">
            <FlaskConical size={14} />
            Experimental Module // Simulations
          </div>
          <h1 className="text-6xl font-serif leading-tight tracking-tighter">
            Benchmark <span className="italic">Scenarios</span>
          </h1>
        </div>
        <div className="text-right font-mono text-[10px] uppercase opacity-40">
          Status: Operational<br />
          Registry: alpha_v2
        </div>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {SWARM_SCENARIOS.map((scenario) => {
          const matchingAgents = agents.filter(a => 
            scenario.recommended_persona_ids.includes(a.id) || 
            (a.persona_metadata && scenario.recommended_persona_ids.some(id => a.persona_metadata!.name.toLowerCase().includes(id.split('-')[0])))
          );

          return (
            <motion.div 
              key={scenario.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group"
            >
              <div className="lg:col-span-4 border-l-4 border-black pl-8 space-y-6">
                <div className="inline-block px-3 py-1 bg-black text-white text-[10px] font-mono tracking-widest uppercase mb-2">
                  Scenario: {scenario.id}
                </div>
                <h3 className="text-3xl font-serif font-bold group-hover:underline decoration-1 underline-offset-4">
                  {scenario.title}
                </h3>
                <div className="space-y-4 opacity-70">
                  <div className="flex gap-3">
                    <Target size={16} className="shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-black">Primary Goal</p>
                      <p className="text-sm leading-relaxed">{scenario.goal}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Users size={16} className="shrink-0 mt-1" />
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest mb-1 text-black">Interaction Dynamics</p>
                      <p className="text-sm leading-relaxed">{scenario.dynamics}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 bg-[#fdfdfd] border border-black/10 editorial-shadow p-8">
                <p className="font-mono text-[10px] uppercase tracking-widest mb-6 opacity-40 border-b border-black/5 pb-2">
                  Contextual Frame
                </p>
                <p className="text-xl font-serif italic mb-8 leading-relaxed">
                  "{scenario.context}"
                </p>
                
                <div className="space-y-4">
                  <p className="text-[10px] font-mono uppercase tracking-widest font-bold">Recommended Entities</p>
                  <div className="flex gap-4 overflow-x-auto pb-4">
                    {matchingAgents.length > 0 ? matchingAgents.map(agent => (
                      <div key={agent.id} className="flex-shrink-0 w-48 border border-black p-4 bg-white hover:bg-black hover:text-white transition-colors cursor-help">
                        <div className="h-12 w-12 bg-zinc-200 mb-3 overflow-hidden">
                           {agent.persona_metadata?.avatar_url ? (
                             <img src={agent.persona_metadata.avatar_url} className="w-full h-full object-cover grayscale" referrerPolicy="no-referrer" />
                           ) : <div className="w-full h-full bg-black/10" />}
                        </div>
                        <p className="text-xs font-bold leading-tight">{agent.persona_metadata?.name || agent.role}</p>
                        <p className="text-[9px] font-mono uppercase opacity-60 mt-1">{agent.role}</p>
                      </div>
                    )) : (
                      <p className="text-xs italic opacity-40 font-mono">No recommended entities currently seeded in registry.</p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                   <button className="flex items-center gap-2 bg-black text-white px-6 py-3 font-mono text-[10px] uppercase tracking-widest hover:opacity-80 transition-opacity">
                     <Zap size={14} />
                     Initialize Run
                   </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="h-24 bg-black/5 flex items-center justify-center border-y border-black/10">
        <p className="font-mono text-[10px] uppercase tracking-[0.5em] opacity-40">End of Simulation Batch // Page 11</p>
      </div>
    </div>
  );
};
