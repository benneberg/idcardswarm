import { AgentCard, Institution, GuildMemory } from '../types';

/**
 * Institutional Culture & Guild Memory Vector Engine
 * Aggregates collective cultural DNA vectors from affiliated agents
 * and injects passive institutional buffs and priority bias modulators.
 */

export const PREDEFINED_INSTITUTIONS: Omit<Institution, 'createdAt' | 'updatedAt'>[] = [
  {
    id: 'inst-sre-guild',
    name: 'DevOps SRE & Resiliency Guild',
    description: 'Specialists dedicated to zero downtime, continuous verification, and resilient distributed architectures.',
    motto: 'Zero entropy through continuous verification and automated resilience.',
    archetypeKey: 'sre-guild',
    memberAgentIds: [],
    cultural_vector: {
      creativity: 0.45,
      strategic_thinking: 0.75,
      technical_depth: 0.88,
      communication: 0.60,
      leadership: 0.70,
      reliability: 0.92,
      curiosity: 0.65,
      adaptability: 0.78
    },
    passive_buffs: [
      {
        name: 'Fault Tolerant Discipline',
        description: '+15% Reliability and +10% Technical Depth on infrastructure/audit tasks.',
        statBuffs: { reliability: 0.15, technical_depth: 0.10 },
        priorityBiasShift: { correctness: 0.20, speed: -0.05, elegance: 0 }
      }
    ],
    guild_memory: [
      {
        id: 'mem-1',
        title: 'Distributed State Invariants',
        lesson: 'Always enforce atomic transactions when multiple nodes compete for unassigned directives.',
        recordedAt: '2026-06-01T10:00:00Z',
        contributorAgentId: 'system',
        tag: 'architecture'
      }
    ]
  },
  {
    id: 'inst-review-board',
    name: 'Scientific Review & Empirical Board',
    description: 'Peer-review council that audits analytical hypotheses and validates factual groundings.',
    motto: 'Rigorous empirical verification before deployment; truth over conjecture.',
    archetypeKey: 'review-board',
    memberAgentIds: [],
    cultural_vector: {
      creativity: 0.50,
      strategic_thinking: 0.85,
      technical_depth: 0.82,
      communication: 0.75,
      leadership: 0.72,
      reliability: 0.90,
      curiosity: 0.88,
      adaptability: 0.65
    },
    passive_buffs: [
      {
        name: 'Peer Review Scrutiny',
        description: '+18% Research Ability & Strategic Depth; enforces strict verification bias.',
        statBuffs: { research_ability: 0.18, strategic_thinking: 0.12 },
        priorityBiasShift: { correctness: 0.25, elegance: 0.05, speed: -0.10 }
      }
    ],
    guild_memory: [
      {
        id: 'mem-2',
        title: 'Cognitive Bias Mitigation',
        lesson: 'Never accept single-pass inferences without an independent critic audit pass.',
        recordedAt: '2026-06-02T14:30:00Z',
        contributorAgentId: 'system',
        tag: 'validation'
      }
    ]
  },
  {
    id: 'inst-creative-studio',
    name: 'Creative Narrative & Experience Studio',
    description: 'Guild focused on distinct voices, expressive typography, and human-centered design.',
    motto: 'Expressive resonance and aesthetic elegance across all digital interfaces.',
    archetypeKey: 'creative-studio',
    memberAgentIds: [],
    cultural_vector: {
      creativity: 0.92,
      strategic_thinking: 0.60,
      technical_depth: 0.55,
      communication: 0.88,
      leadership: 0.58,
      reliability: 0.70,
      curiosity: 0.90,
      adaptability: 0.85
    },
    passive_buffs: [
      {
        name: 'Aesthetic Resonance',
        description: '+20% Creativity and +15% Communication; boosts elegance priority bias.',
        statBuffs: { creativity: 0.20, communication: 0.15 },
        priorityBiasShift: { elegance: 0.25, speed: 0.05, correctness: -0.05 }
      }
    ],
    guild_memory: [
      {
        id: 'mem-3',
        title: 'Voice Coherence Principle',
        lesson: 'Personas must maintain distinct tonality and avoid generic corporate homogenization.',
        recordedAt: '2026-06-03T09:15:00Z',
        contributorAgentId: 'system',
        tag: 'narrative'
      }
    ]
  },
  {
    id: 'inst-security-taskforce',
    name: 'Autonomous Security Taskforce',
    description: 'Defensive engineering collective protecting against data exfiltration and privilege escalations.',
    motto: 'Defense in depth, zero-trust boundary verification, and immutable auditing.',
    archetypeKey: 'security-taskforce',
    memberAgentIds: [],
    cultural_vector: {
      creativity: 0.40,
      strategic_thinking: 0.88,
      technical_depth: 0.90,
      communication: 0.65,
      leadership: 0.75,
      reliability: 0.95,
      curiosity: 0.70,
      adaptability: 0.80
    },
    passive_buffs: [
      {
        name: 'Zero Trust Bastion',
        description: '+16% Reliability and +12% Technical Depth; clamps risk tolerance.',
        statBuffs: { reliability: 0.16, technical_depth: 0.12, risk_tolerance: -0.15 },
        priorityBiasShift: { correctness: 0.30, speed: -0.10 }
      }
    ],
    guild_memory: [
      {
        id: 'mem-4',
        title: 'Immutable Ownership Invariant',
        lesson: 'Cross-tenant modifications must be denied at the rules layer regardless of caller claims.',
        recordedAt: '2026-06-04T16:00:00Z',
        contributorAgentId: 'system',
        tag: 'security'
      }
    ]
  }
];

/**
 * Calculates the aggregate cultural DNA vector across all active members of an institution.
 * Returns normalized scores clamped to [0.05, 0.95].
 */
export function calculateInstitutionalCulture(members: AgentCard[]): Institution['cultural_vector'] {
  const defaultVector = {
    creativity: 0.50,
    strategic_thinking: 0.50,
    technical_depth: 0.50,
    communication: 0.50,
    leadership: 0.50,
    reliability: 0.50,
    curiosity: 0.50,
    adaptability: 0.50
  };

  if (!members || members.length === 0) {
    return defaultVector;
  }

  const dimensions = [
    'creativity',
    'strategic_thinking',
    'technical_depth',
    'communication',
    'leadership',
    'reliability',
    'curiosity',
    'adaptability'
  ] as const;

  const sumVector: Record<string, number> = {};
  dimensions.forEach(dim => { sumVector[dim] = 0; });

  let validCount = 0;
  members.forEach(member => {
    if (!member.capability_vector) return;
    validCount++;
    dimensions.forEach(dim => {
      sumVector[dim] += member.capability_vector?.[dim] ?? 0.50;
    });
  });

  if (validCount === 0) return defaultVector;

  const result: any = {};
  dimensions.forEach(dim => {
    const rawMean = sumVector[dim] / validCount;
    // Strictly clamp within canonical boundaries [0.05, 0.95]
    result[dim] = Math.max(0.05, Math.min(0.95, Math.round(rawMean * 1000) / 1000));
  });

  return result as Institution['cultural_vector'];
}

/**
 * Applies passive institutional buffs and priority bias modulations to an agent.
 * Reflects collective guild priorities in execution demeanor and evaluation behavior.
 */
export function applyInstitutionalBuffs(agent: AgentCard, institution?: Institution): AgentCard {
  if (!institution || !agent) return agent;

  const modifiedAgent: AgentCard = JSON.parse(JSON.stringify(agent));
  const currentVector = { ...(modifiedAgent.capability_vector || {}) };

  // 1. Apply stat buffs
  (institution.passive_buffs || []).forEach(buff => {
    if (buff.statBuffs) {
      Object.entries(buff.statBuffs).forEach(([stat, boost]) => {
        const currentVal = currentVector[stat] ?? 0.50;
        const newVal = Math.max(0.05, Math.min(0.95, currentVal + boost));
        currentVector[stat] = Math.round(newVal * 1000) / 1000;
      });
    }

    // 2. Modulate priority bias
    if (buff.priorityBiasShift && modifiedAgent.priority_bias) {
      const shift = buff.priorityBiasShift;
      modifiedAgent.priority_bias = {
        correctness: Math.max(0.05, Math.min(1.0, (modifiedAgent.priority_bias.correctness || 0.33) + (shift.correctness || 0))),
        speed: Math.max(0.05, Math.min(1.0, (modifiedAgent.priority_bias.speed || 0.33) + (shift.speed || 0))),
        elegance: Math.max(0.05, Math.min(1.0, (modifiedAgent.priority_bias.elegance || 0.33) + (shift.elegance || 0)))
      };
    }
  });

  modifiedAgent.capability_vector = currentVector;
  modifiedAgent.guild_name = institution.name;
  modifiedAgent.institution_id = institution.id;

  // Add behavioral rule anchor
  const guildAnchor = `[Guild Order: ${institution.name}]: Adhere to motto: "${institution.motto}"`;
  if (!modifiedAgent.behavior_rules) {
    modifiedAgent.behavior_rules = [guildAnchor];
  } else if (!modifiedAgent.behavior_rules.some(r => r.includes(institution.name))) {
    modifiedAgent.behavior_rules.push(guildAnchor);
  }

  return modifiedAgent;
}
