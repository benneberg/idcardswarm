import React from 'react';
import { SWARM_ARCHETYPES } from '../data/archetypes';
import { motion } from 'motion/react';
import { Building2, Users2, Zap, Rocket } from 'lucide-react';

interface Props {
  onSelect: (archetypeId: string) => void;
}

export const ArchetypeSelector: React.FC<Props> = ({ onSelect }) => {
  const getIcon = (id: string) => {
    switch (id) {
      case 'research_institute': return <Building2 size={24} />;
      case 'engineering_guild': return <Users2 size={24} />;
      case 'startup_swarm': return <Rocket size={24} />;
      default: return <Zap size={24} />;
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {SWARM_ARCHETYPES.map((arch) => (
        <motion.div
          key={arch.id}
          whileHover={{ y: -5 }}
          className="bg-white border-2 border-black p-6 editorial-shadow cursor-pointer group"
          onClick={() => onSelect(arch.id)}
        >
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
            {getIcon(arch.id)}
          </div>
          <h3 className="text-xl font-serif font-bold mb-2 group-hover:underline">{arch.name}</h3>
          <p className="text-[11px] font-mono opacity-60 mb-4 leading-relaxed uppercase tracking-widest">{arch.description}</p>
          
          <div className="space-y-2 mt-4 pt-4 border-t border-black/5">
             <p className="text-[8px] font-mono uppercase font-bold opacity-40">CompositionDNA</p>
             <div className="flex flex-wrap gap-2">
                {arch.composition.map((c, i) => (
                  <span key={i} className="text-[7px] font-mono bg-black/5 px-2 py-1 uppercase">{c.count}x {c.role}</span>
                ))}
             </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
