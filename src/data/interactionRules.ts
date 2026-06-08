/**
 * Interaction Rules for the idCard Personas Swarm
 */

export interface InteractionRule {
  id: string;
  name: string;
  description: string;
  condition: (context: any) => boolean;
  effect: (pair: { source: any; target: any }) => any;
}

export const SWARM_RULES = [
  {
    id: 'rule_trust_alignment',
    name: 'Implicit Trust Alignment',
    description: 'Agents with similar capability vectors or shared motivations develop faster trust connections.',
    factor: 'Matching Capabilties',
  },
  {
    id: 'rule_proximity_bias',
    name: 'Task Proximity',
    description: 'Direct collaboration on the same swarm task increases interaction frequency and influence.',
    factor: 'Shared Goal',
  },
  {
    id: 'rule_status_hierarchy',
    name: 'Experience Lead',
    description: 'Senior or Staff level agents exert higher influence on simulator personas during critical decision phases.',
    factor: 'Seniority',
  },
  {
    id: 'rule_conflict_resolution',
    name: 'Divergent Motivation',
    description: 'Conflicting motivations (e.g., Efficiency vs. Privacy) trigger critical review cycles between personas.',
    factor: 'Motivation Delta',
  }
];

export interface SwarmConnection {
  source: string; // Agent ID
  target: string; // Agent ID
  type: 'trust' | 'influence' | 'collaboration' | 'conflict' | 'pheromone';
  strength: number; // 0 to 1
  metadata?: any;
}

export interface SwarmEvent {
  id: string;
  timestamp: string;
  agentIds: string[];
  type: string;
  description: string;
  impact_score: number;
}
