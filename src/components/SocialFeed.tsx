import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Zap, Heart, MessageSquare } from 'lucide-react';
import { SwarmConnection } from '../data/interactionRules';

interface Props {
  relationships: any[];
  agents: any[];
}

export const SocialFeed: React.FC<Props> = ({ relationships = [], agents = [] }) => {
  const sortedRels = [...relationships]
    .filter(r => r?.lastInteraction)
    .sort((a, b) => new Date(b.lastInteraction?.seconds * 1000 || b.lastInteraction).getTime() - new Date(a.lastInteraction?.seconds * 1000 || a.lastInteraction).getTime())
    .slice(0, 5);

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.persona_metadata?.name || id;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-b border-black pb-2">
        <MessageSquare size={16} />
        <h3 className="font-mono text-xs uppercase tracking-widest font-bold">Resonance Feed</h3>
      </div>
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {sortedRels.map((rel, idx) => (
            <motion.div
              key={rel.id || idx}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-3 bg-white/50 editorial-border text-[11px] font-mono leading-tight flex gap-3"
            >
              <div className="mt-1">
                {rel.type === 'trust' ? <Heart size={12} className="text-red-500" /> : 
                 rel.type === 'conflict' ? <Zap size={12} className="text-amber-500" /> : 
                 <Share2 size={12} className="text-blue-500" />}
              </div>
              <div>
                <p>
                  <span className="font-bold">{getAgentName(rel.sourceId || rel.source)}</span> 
                  {rel.type === 'trust' ? ' formed a bond with ' : 
                   rel.type === 'conflict' ? ' encountered friction with ' : 
                   ' interacted with '}
                  <span className="font-bold">{getAgentName(rel.targetId || rel.target)}</span>
                </p>
                <div className="mt-1 opacity-40 uppercase text-[8px] flex justify-between">
                   <span>Resonance: {Math.round((rel.trust || rel.strength || 0) * 100)}%</span>
                   <span>{new Date(rel.lastInteraction?.seconds * 1000 || rel.lastInteraction).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {sortedRels.length === 0 && (
          <p className="text-[10px] font-mono opacity-30 text-center py-4">No resonance detected yet...</p>
        )}
      </div>
    </div>
  );
};
