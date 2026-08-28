import React, { useState } from 'react';
import { SWARM_ARCHETYPES } from '../data/archetypes';
import { AgentCard, SwarmArchetype } from '../types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Building2, Users2, Zap, Rocket, Globe, Shield, Code, Sparkles, Check, Loader2, Share2, Plus } from 'lucide-react';

interface Props {
  onSelect?: (archetypeId: string) => void;
  agents?: AgentCard[];
  userId?: string;
}

const COMMUNITY_ARCHETYPES: (SwarmArchetype & { author: string; stars: number; tags: string[] })[] = [
  {
    id: 'sre-resilience-guild',
    name: 'DevOps & SRE Resilience Guild',
    description: 'Chaos-tested operations swarm specialized in low-latency observability, zero-downtime rollouts, and incident mitigation.',
    author: 'Civitas Infra Core',
    stars: 142,
    tags: ['Cloud', 'Kubernetes', 'Incident Response'],
    composition: [
      { role: 'Incident Commander', description: 'Zero-panic triage & communication', count: 1 },
      { role: 'Kernel & Mesh Architect', description: 'Deep distributed systems knowledge', count: 1 },
      { role: 'Observability Critic', description: 'Anomaly detection & telemetry verification', count: 1 }
    ]
  },
  {
    id: 'secops-red-team',
    name: 'Autonomous Security Taskforce',
    description: 'High-scrutiny penetration testing & defense guild enforcing zero-trust invariants and cryptographic audits.',
    author: 'SecGuard Collective',
    stars: 189,
    tags: ['Security', 'Zero-Trust', 'Audit'],
    composition: [
      { role: 'Red Team Adversary', description: 'Fuzzing & boundary exploitation', count: 1 },
      { role: 'Zero-Trust Auditor', description: 'Least-privilege ABAC invariant verification', count: 1 },
      { role: 'Cryptographic Lead', description: 'Deterministic hashing & signature validation', count: 1 }
    ]
  },
  {
    id: 'growth-synthesis-cell',
    name: 'Product Growth & Intelligence Cell',
    description: 'Rapid hypothesis generation and user cohort synthesis for consumer apps and mobile productivity ecosystems.',
    author: 'Civitas Ventures',
    stars: 97,
    tags: ['Product', 'Analytics', 'Growth'],
    composition: [
      { role: 'Growth Strategist', description: 'Viral mechanics & funnel optimization', count: 1 },
      { role: 'Behavioral Researcher', description: 'Persona psychometrics & user interview simulation', count: 1 },
      { role: 'Fullstack Prototyper', description: 'Rapid frontend sprint execution', count: 1 }
    ]
  }
];

export const ArchetypeSelector: React.FC<Props> = ({ onSelect, agents = [], userId }) => {
  const [tab, setTab] = useState<'foundational' | 'community'>('foundational');
  const [deployingId, setDeployingId] = useState<string | null>(null);
  const [deployedId, setDeployedId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const getIcon = (id: string) => {
    switch (id) {
      case 'research_institute':
      case 'research-consortium':
        return <Building2 size={22} />;
      case 'engineering_guild':
      case 'sre-resilience-guild':
        return <Code size={22} />;
      case 'startup_swarm':
      case 'startup-core':
        return <Rocket size={22} />;
      case 'secops-red-team':
        return <Shield size={22} />;
      default:
        return <Zap size={22} />;
    }
  };

  const handleDeployArchetype = async (arch: SwarmArchetype) => {
    if (!userId) {
      setStatusMessage('Please authenticate with Google to deploy templates to your workspace.');
      setTimeout(() => setStatusMessage(null), 4000);
      return;
    }

    setDeployingId(arch.id);
    try {
      for (const comp of arch.composition) {
        for (let i = 0; i < comp.count; i++) {
          const isCritic = comp.role.toLowerCase().includes('critic') || comp.role.toLowerCase().includes('auditor');
          await addDoc(collection(db, 'agents'), {
            role: comp.role,
            mode: isCritic ? 'critic' : 'executor',
            skills: [comp.role, 'Autonomous Reasoning', 'Swarm Coordination'],
            experience_level: 'senior',
            context_budget: 8000,
            priority_bias: { correctness: 0.7, speed: 0.5, elegance: 0.6 },
            strengths: [comp.description],
            weaknesses: ['Experimental Archetype Prototype'],
            tools: ['terminal', 'linter', 'evaluator'],
            behavior_rules: [`Strictly fulfill mandate as ${comp.role}`],
            capability_vector: {
              technical_depth: 0.85,
              creativity: 0.70,
              reliability: 0.90,
              curiosity: 0.75,
              adaptability: 0.80,
              leadership: 0.65
            },
            level: 1,
            exp: 0,
            reputation: 60,
            trustScore: 65,
            satisfaction: 0.85,
            lifecycle_stage: 'initialization',
            lineage: {
              generation: 1,
              mutations: [`Templated from ${arch.name}`]
            },
            persona_metadata: {
              name: `${comp.role} #${Math.floor(Math.random() * 900 + 100)}`,
              age: 32,
              occupation: comp.role,
              bio: `Autonomous operative templated from ${arch.name}: ${comp.description}`,
              motivations: ['Ecosystem excellence', 'Collaborative consensus'],
              pain_points: ['Siloed communications', 'Unclear task specs'],
              tech_proficiency: 85,
              personality: {
                openness: 75,
                conscientiousness: 90,
                risk_tolerance: 50,
                extraversion: 60,
                agreeableness: 70
              }
            },
            userId,
            ownerId: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
      }

      setDeployedId(arch.id);
      setStatusMessage(`Successfully deployed ${arch.name} (${arch.composition.reduce((acc, c) => acc + c.count, 0)} agents provisioned).`);
      if (onSelect) onSelect(arch.id);
      setTimeout(() => {
        setDeployedId(null);
        setStatusMessage(null);
      }, 4000);
    } catch (err: any) {
      console.error('Failed to deploy archetype:', err);
      setStatusMessage('Deployment failed: Firestore access requires active credentials.');
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setDeployingId(null);
    }
  };

  const activeList = tab === 'foundational' ? SWARM_ARCHETYPES : COMMUNITY_ARCHETYPES;

  return (
    <div className="space-y-6">
      {/* Tab Switcher & Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-black/10">
        <div className="flex p-1 bg-stone-200/80 border border-black/10 rounded-sm">
          <button
            onClick={() => setTab('foundational')}
            className={`px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
              tab === 'foundational' ? 'bg-black text-white' : 'opacity-50 hover:opacity-100'
            }`}
          >
            System Blueprints
          </button>
          <button
            onClick={() => setTab('community')}
            className={`flex items-center gap-1.5 px-4 py-2 font-mono text-[10px] uppercase tracking-widest transition-all ${
              tab === 'community' ? 'bg-black text-white' : 'opacity-50 hover:opacity-100'
            }`}
          >
            <Globe size={12} />
            Community Guilds
          </button>
        </div>

        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] font-mono uppercase px-3 py-1.5 bg-black text-white"
          >
            {statusMessage}
          </motion.div>
        )}
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeList.map((arch) => {
          const isCommunity = 'stars' in arch;
          const isDeploying = deployingId === arch.id;
          const isDeployed = deployedId === arch.id;

          return (
            <motion.div
              key={arch.id}
              whileHover={{ y: -4 }}
              className="bg-white border-2 border-black p-6 editorial-shadow flex flex-col justify-between group transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    {getIcon(arch.id)}
                  </div>
                  {isCommunity && (
                    <span className="text-[9px] font-mono bg-stone-100 border border-black/10 px-2 py-0.5 uppercase tracking-wider">
                      ⭐ {(arch as any).stars} stars
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-serif font-bold mb-2 group-hover:underline">{arch.name}</h3>
                <p className="text-[11px] font-mono opacity-60 mb-4 leading-relaxed uppercase tracking-widest">
                  {arch.description}
                </p>

                {isCommunity && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(arch as any).tags?.map((t: string, idx: number) => (
                      <span key={idx} className="text-[7px] font-mono bg-blue-50 text-blue-800 px-2 py-0.5 uppercase">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="space-y-2 pt-4 border-t border-black/5">
                  <p className="text-[8px] font-mono uppercase font-bold opacity-40">Composition DNA</p>
                  <div className="flex flex-wrap gap-1.5">
                    {arch.composition.map((c, i) => (
                      <span key={i} className="text-[7px] font-mono bg-black/5 px-2 py-1 uppercase">
                        {c.count}x {c.role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-black/10 flex gap-2">
                <button
                  onClick={() => handleDeployArchetype(arch)}
                  disabled={isDeploying}
                  className={`w-full py-2.5 px-4 font-mono text-[9px] uppercase font-bold tracking-widest transition-all flex items-center justify-center gap-2 ${
                    isDeployed 
                      ? 'bg-emerald-600 text-white'
                      : 'bg-black text-white hover:bg-black/80'
                  }`}
                >
                  {isDeploying ? (
                    <>
                      <Loader2 size={12} className="animate-spin" /> Provisioning...
                    </>
                  ) : isDeployed ? (
                    <>
                      <Check size={12} /> Provisioned
                    </>
                  ) : (
                    <>
                      <Rocket size={12} /> Deploy Guild
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
