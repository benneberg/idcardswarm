import React from 'react';
import { AgentCard } from '../types';
import { motion } from 'motion/react';

interface Props {
  agent: AgentCard;
  onSelect?: (agent: AgentCard) => void;
  className?: string;
  selected?: boolean;
}

export const AgentCardItem: React.FC<Props> = ({ agent, onSelect, className = '', selected }) => {
  const isSimulator = agent.mode === 'simulator';
  const isCritic = agent.mode === 'critic';
  const persona = agent.persona_metadata;

  const currentLevel = agent.level || 1;
  const currentExp = agent.exp || 0;
  const expToNext = currentLevel * 1000;
  const progress = (currentExp / expToNext) * 100;

  const reputation = agent.reputation || 50;
  const trustScore = agent.trustScore || 50;
  const lifecycle = agent.lifecycle_stage || 'collaboration';

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      onClick={() => onSelect?.(agent)}
      className={`
        relative p-5 flex flex-col justify-between editorial-border cursor-pointer transition-colors group
        ${isSimulator ? 'bg-[#1A1A1A] text-white' : isCritic ? 'bg-[#F2EFE9]' : 'bg-white'}
        ${selected ? 'ring-4 ring-blue-500 ring-offset-2 shadow-2xl' : 'editorial-shadow'}
        ${className}
      `}
    >
      <div className="absolute -top-1 -right-1 w-12 h-12 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 p-1 bg-blue-500 text-white text-[8px] font-bold font-mono rotate-45 transform translate-x-3 translate-y-1 w-20 text-center uppercase tracking-widest whitespace-nowrap">
           Citizen
        </div>
      </div>

      <div>
        <div className="flex justify-between font-mono text-[10px] mb-4">
          <span className={isSimulator ? 'opacity-60' : ''}>CITIZEN_{agent.id.slice(0, 8).toUpperCase()}</span>
          <div className="flex gap-2 items-center">
             <span className="px-2 bg-stone-200 text-stone-600 uppercase text-[8px] font-bold tracking-widest">{lifecycle}</span>
             {(agent.lineage?.generation || 1) > 1 && (
               <span className="px-2 bg-blue-100 text-blue-600 uppercase text-[8px] font-bold tracking-widest">GEN {agent.lineage?.generation}</span>
             )}
             <span className="opacity-50">LVL {currentLevel}</span>
             <span className={`px-2 uppercase ${
               isSimulator ? 'bg-zinc-800 text-zinc-400' : 
               isCritic ? 'bg-red-600 text-white' : 
               'bg-black text-white'
             }`}>
               {agent.mode}
             </span>
          </div>
        </div>

        <div className="flex justify-between mb-2">
           <div className="flex gap-4">
              <div>
                <p className="text-[8px] opacity-40 font-mono uppercase">Reputation</p>
                <p className="text-xs font-serif font-bold italic">{reputation}</p>
              </div>
              <div>
                <p className="text-[8px] opacity-40 font-mono uppercase">Trust Score</p>
                <p className="text-xs font-serif font-bold italic">{trustScore}</p>
              </div>
           </div>
           {persona?.personality && (
             <div className="flex gap-1 items-end h-6">
                {Object.entries(persona.personality).map(([trait, val]) => (
                  <div key={trait} className="w-1 bg-white/10 relative h-full">
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-blue-400" 
                      style={{ height: `${val}%` }}
                    />
                  </div>
                ))}
             </div>
           )}
        </div>

        <div className="h-1 bg-black/10 w-full mb-4 overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className={`h-full ${isSimulator ? 'bg-zinc-600' : isCritic ? 'bg-red-600' : 'bg-black'}`}
          />
        </div>
        
        <div className={`h-48 mb-4 border border-black/20 overflow-hidden relative flex items-center justify-center ${
          isSimulator ? 'bg-zinc-800' : isCritic ? 'bg-zinc-300' : 'bg-slate-50'
        }`}>
          {persona?.avatar_url ? (
            <img 
              src={persona.avatar_url} 
              alt={persona.name} 
              className="w-full h-full object-cover grayscale opacity-90 hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-4xl font-serif italic opacity-10 select-none">
              {agent.role.slice(0, 2).toUpperCase()}
            </span>
          )}
        </div>

        {persona ? (
          <div className="mb-4">
            <h2 className="text-2xl font-serif font-bold tracking-tight leading-tight">
              {persona.name}
            </h2>
            <p className={`text-[10px] font-mono uppercase tracking-wider mb-2 ${isSimulator ? 'text-zinc-400' : 'text-zinc-500'}`}>
              {persona.occupation} • Age {persona.age}
            </p>
            <p className="text-[11px] leading-relaxed opacity-70 line-clamp-2 italic">
              {persona.bio}
            </p>
          </div>
        ) : (
          <h2 className="text-2xl font-serif font-bold uppercase tracking-tight mb-1 leading-tight">
            {agent.role}
          </h2>
        )}

        <p className={`text-[10px] font-mono uppercase font-bold mt-2 ${
          isSimulator ? 'text-zinc-400' : isCritic ? 'text-red-800' : 'text-orange-700'
        }`}>
          {agent.skills.slice(0, 3).join(' • ')}
        </p>
      </div>

      <div className={`border-t pt-3 mt-4 text-[10px] leading-relaxed font-mono uppercase tracking-tighter ${
        isSimulator ? 'border-zinc-700 opacity-80' : 'border-black'
      }`}>
        RULE: {agent.behavior_rules[0] || 'Executing assigned protocols.'}
      </div>
    </motion.div>
  );
};
