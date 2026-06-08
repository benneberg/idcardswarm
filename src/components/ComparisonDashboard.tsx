
import React from 'react';
import { AgentCard } from '../types';
import { CapabilityRadar } from './CapabilityRadar.tsx';
import { motion } from 'motion/react';
import { X, TrendingUp, Cpu, Activity } from 'lucide-react';

interface Props {
  agentA: AgentCard;
  agentB: AgentCard;
  onClose: () => void;
}

export const ComparisonDashboard: React.FC<Props> = ({ agentA, agentB, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-6xl h-full max-h-[90vh] editorial-border editorial-shadow flex flex-col overflow-hidden">
        <div className="bg-black text-white p-6 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-serif font-bold tracking-tight">Capability Comparison</h2>
            <p className="text-[10px] font-mono uppercase opacity-50">Cross-Referencing Digital DNA Matrix</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-50">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            {/* AGENT A */}
            <div className="space-y-8">
              <AgentBrief agent={agentA} side="left" />
              <div className="bg-white p-4 md:p-6 border border-black/10 editorial-shadow-sm overflow-hidden">
                <h4 className="font-mono text-[10px] uppercase font-bold mb-4 opacity-40">Capability Vector (A)</h4>
                <div className="h-[250px] md:h-[300px]">
                  <CapabilityRadar capabilityVector={agentA.capability_vector} />
                </div>
              </div>
              <MetricsComparison agent={agentA} />
            </div>

            {/* AGENT B */}
            <div className="space-y-8">
              <AgentBrief agent={agentB} side="right" />
              <div className="bg-white p-4 md:p-6 border border-black/10 editorial-shadow-sm overflow-hidden">
                <h4 className="font-mono text-[10px] uppercase font-bold mb-4 opacity-40">Capability Vector (B)</h4>
                <div className="h-[250px] md:h-[300px]">
                  <CapabilityRadar capabilityVector={agentB.capability_vector} />
                </div>
              </div>
              <MetricsComparison agent={agentB} />
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-black/10">
             <h4 className="font-mono text-[10px] uppercase font-bold mb-8 text-center">Performance History Differential</h4>
             <div className="grid grid-cols-2 gap-8 h-48 items-end px-12">
                {[...Array(12)].map((_, i) => {
                  const valA = 40 + Math.random() * 60;
                  const valB = 40 + Math.random() * 60;
                  return (
                    <div key={i} className="flex flex-col gap-1 items-center group relative">
                       <div className="flex gap-1 items-end w-full">
                          <div className="flex-1 bg-black/80 h-full" style={{ height: `${valA}%` }} />
                          <div className="flex-1 bg-blue-500 h-full" style={{ height: `${valB}%` }} />
                       </div>
                       <div className="absolute -bottom-6 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[8px] p-1 whitespace-nowrap z-10">
                          A: {valA.toFixed(0)}% | B: {valB.toFixed(0)}%
                       </div>
                    </div>
                  );
                })}
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const AgentBrief = ({ agent, side }: { agent: AgentCard, side: 'left' | 'right' }) => (
  <div className={`flex flex-col sm:flex-row gap-4 md:gap-6 items-center ${side === 'right' ? 'sm:flex-row-reverse sm:text-right' : ''}`}>
    <div className="w-16 h-16 md:w-20 md:h-20 bg-zinc-100 border-2 border-black overflow-hidden shrink-0">
      <img 
        src={agent.persona_metadata?.avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${agent.id}`} 
        className="w-full h-full object-cover grayscale" 
        alt={agent.role}
      />
    </div>
    <div className="text-center sm:text-left">
      <h3 className="text-2xl md:text-3xl font-serif font-bold tracking-tighter">{agent.persona_metadata?.name || agent.role}</h3>
      <p className="text-[9px] md:text-[10px] font-mono uppercase font-bold text-blue-600">{agent.role} // LVL {agent.level || 1}</p>
      <div className={`flex gap-3 text-[8px] font-mono uppercase mt-2 opacity-60 justify-center ${side === 'right' ? 'sm:justify-end' : 'sm:justify-start'}`}>
        <span>Reputation: {agent.reputation || 50}</span>
        <span>Trust: {agent.trustScore || 50}</span>
      </div>
    </div>
  </div>
);

const MetricsComparison = ({ agent }: { agent: AgentCard }) => (
  <div className="grid grid-cols-3 gap-2">
    {[
      { label: 'Reliability', value: (agent.capability_vector?.reliability || 0.5) * 100, icon: Activity },
      { label: 'Adaptability', value: (agent.capability_vector?.adaptability || 0.5) * 100, icon: TrendingUp },
      { label: 'Strategic', value: (agent.capability_vector?.strategic_thinking || 0.5) * 100, icon: Cpu }
    ].map((m, i) => (
      <div key={i} className="bg-zinc-900 text-white p-3 border border-black">
        <m.icon size={12} className="opacity-40 mb-2" />
        <p className="text-[10px] font-bold mb-1">{m.value.toFixed(0)}%</p>
        <p className="text-[7px] font-mono uppercase opacity-50 tracking-widest">{m.label}</p>
      </div>
    ))}
  </div>
);
