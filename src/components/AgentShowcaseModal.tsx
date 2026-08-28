import React, { useState } from 'react';
import { AgentCard, EntityRelationship } from '../types';
import { motion } from 'motion/react';
import { X, Download, Share2, Check, Shield, Award, Cpu, GitBranch, Sparkles } from 'lucide-react';

interface Props {
  agent: AgentCard;
  relationships?: EntityRelationship[];
  onClose: () => void;
}

export const AgentShowcaseModal: React.FC<Props> = ({ agent, relationships = [], onClose }) => {
  const [copied, setCopied] = useState(false);
  const persona = agent.persona_metadata;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}${window.location.pathname}?agentId=${agent.id}`
    : `https://swarm.civitas.internal?agentId=${agent.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportBlueprint = () => {
    const blueprint = {
      version: '3.0.0',
      exportedAt: new Date().toISOString(),
      agent: {
        role: agent.role,
        mode: agent.mode,
        skills: agent.skills,
        experience_level: agent.experience_level || 'mid',
        behavior_rules: agent.behavior_rules,
        capability_vector: agent.capability_vector || {},
        priority_bias: agent.priority_bias || {},
        persona_metadata: agent.persona_metadata || null,
        level: agent.level || 1,
        reputation: agent.reputation || 50,
        trustScore: agent.trustScore || 50,
        lineage: agent.lineage || { generation: 1 }
      }
    };

    const blob = new Blob([JSON.stringify(blueprint, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.role.toLowerCase().replace(/[^a-z0-9]/g, '_')}_blueprint.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const vector = agent.capability_vector || {
    technical_depth: 0.5,
    curiosity: 0.5,
    reliability: 0.5,
    adaptability: 0.5,
    creativity: 0.5
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white max-w-3xl w-full border-4 border-black editorial-shadow p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-serif italic text-2xl">
              id
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-blue-600 font-bold">
                Ecosystem Showcase // Certified Citizen
              </span>
              <h2 className="text-3xl font-serif font-bold tracking-tight">
                {persona?.name || agent.role}
              </h2>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left Column: Avatar & Basic Specs */}
          <div className="space-y-4">
            <div className="w-full h-56 border-2 border-black bg-stone-100 overflow-hidden relative">
              {persona?.avatar_url ? (
                <img 
                  src={persona.avatar_url} 
                  alt={persona.name} 
                  className="w-full h-full object-cover grayscale"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-serif text-5xl italic opacity-20">
                  {agent.role.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black text-white font-mono text-[9px] uppercase tracking-widest">
                LVL {agent.level || 1} // GEN {agent.lineage?.generation || 1}
              </div>
            </div>

            <div className="p-3 bg-stone-50 border border-black/10 font-mono text-[10px] space-y-1">
              <div className="flex justify-between">
                <span className="opacity-50">Role:</span>
                <span className="font-bold uppercase">{agent.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Mode:</span>
                <span className="uppercase font-bold">{agent.mode}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Reputation:</span>
                <span className="font-bold">{agent.reputation || 50} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Trust Score:</span>
                <span className="font-bold">{agent.trustScore || 50} / 100</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-50">Connections:</span>
                <span className="font-bold">{relationships.length} active</span>
              </div>
            </div>
          </div>

          {/* Right Column: Capability Radar & Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest mb-2 flex items-center gap-2">
                <Cpu size={14} /> Cognitive DNA & Capability Vector
              </h4>
              <div className="space-y-2 bg-stone-50 p-4 border border-black/10">
                {Object.entries(vector).map(([trait, val]) => (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between font-mono text-[9px] uppercase">
                      <span>{trait.replace(/_/g, ' ')}</span>
                      <span className="font-bold">{Math.round((Number(val) || 0) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-black/10 w-full overflow-hidden">
                      <div 
                        className="h-full bg-black transition-all"
                        style={{ width: `${Math.max(5, Math.min(100, (Number(val) || 0) * 100))}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {persona && (
              <div>
                <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
                  Psychographic Dossier
                </h4>
                <p className="font-serif italic text-sm leading-relaxed border-l-2 border-black pl-3 text-stone-800">
                  "{persona.bio}"
                </p>
              </div>
            )}

            <div>
              <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
                Specialized Competencies
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {agent.skills.map((skill, i) => (
                  <span key={i} className="px-2.5 py-1 bg-black text-white text-[9px] font-mono uppercase tracking-wider">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-mono text-[10px] uppercase font-bold tracking-widest mb-2">
                Operational Invariants
              </h4>
              <ul className="space-y-1 font-mono text-[10px] text-stone-700">
                {agent.behavior_rules.map((rule, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">▶</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t-2 border-black pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleExportBlueprint}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-black text-white font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
            >
              <Download size={13} /> Export Blueprint JSON
            </button>
            <button 
              onClick={handleCopyLink}
              className="flex-1 sm:flex-initial px-4 py-2.5 border-2 border-black font-mono text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-stone-100 transition-colors"
            >
              {copied ? <Check size={13} className="text-green-600" /> : <Share2 size={13} />}
              {copied ? 'Link Copied!' : 'Share Profile'}
            </button>
          </div>

          <span className="font-mono text-[9px] uppercase opacity-40">
            ID: {agent.id} // SECURE HASH VERIFIED
          </span>
        </div>
      </motion.div>
    </div>
  );
};
