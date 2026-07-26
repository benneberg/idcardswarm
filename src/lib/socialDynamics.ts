import { AgentCard, PersonaMetadata, SwarmEnvironment } from '../types';
import { SwarmConnection } from '../data/interactionRules';

/**
 * SocialDynamicsEngine
 * Logic for calculating interactions, influence, and knowledge sharing between personas.
 */

export const applyEnvironmentalModifiers = (agent: AgentCard, env: SwarmEnvironment): AgentCard => {
  if (!agent.capability_vector || !agent.persona_metadata) return agent;
  
  const modifiedAgent = JSON.parse(JSON.stringify(agent)) as AgentCard;
  const p = modifiedAgent.persona_metadata.personality;
  const c = modifiedAgent.capability_vector;

  // Modify capabilities based on environment condition
  switch (env.condition) {
    case 'crunch_time':
      // High conscientiousness thrives, low risk tolerance breaks under pressure
      if (p.conscientiousness > 75) c.reliability = Math.min(1.0, (c.reliability || 0) + (0.2 * env.intensity));
      if (p.risk_tolerance < 40) c.adaptability = Math.max(0.1, (c.adaptability || 0) - (0.3 * env.intensity));
      break;
      
    case 'innovation_phase':
      // High openness thrives, pure executors might struggle slightly with ambiguity
      if (p.openness > 70) c.creativity = Math.min(1.0, (c.creativity || 0) + (0.3 * env.intensity));
      if (modifiedAgent.mode === 'executor') c.adaptability = Math.max(0.1, (c.adaptability || 0) - (0.1 * env.intensity));
      break;
      
    case 'maintenance_mode':
      // Low extraversion/high conscientiousness prefer this
      if (p.conscientiousness > 80) c.reliability = Math.min(1.0, (c.reliability || 0) + (0.15 * env.intensity));
      if (p.openness > 80) c.satisfaction = Math.max(0.1, (modifiedAgent.satisfaction || 0) - (0.2 * env.intensity));
      break;
      
    case 'resource_starved':
      // High tech proficiency adapts better
      if (modifiedAgent.persona_metadata.tech_proficiency > 85) {
        c.adaptability = Math.min(1.0, (c.adaptability || 0) + (0.1 * env.intensity));
      } else {
        c.reliability = Math.max(0.1, (c.reliability || 0) - (0.3 * env.intensity));
      }
      break;
      
    case 'high_ambiguity':
      // Strategic thinkers and risk tolerant agents do well
      if (p.risk_tolerance > 70) c.strategic_thinking = Math.min(1.0, (c.strategic_thinking || 0) + (0.25 * env.intensity));
      if (p.conscientiousness > 85 && p.risk_tolerance < 40) c.reliability = Math.max(0.1, (c.reliability || 0) - (0.4 * env.intensity));
      break;
  }

  // Global Resource Impact
  if (env.resources < 0.3) {
    c.reliability = (c.reliability || 0) * (0.8 + env.resources); // Degrades slightly
  }

  return modifiedAgent;
};

export const calculateInteractionChance = (a: AgentCard, b: AgentCard, env?: SwarmEnvironment): number => {
  if (!a.persona_metadata || !b.persona_metadata) return 0;
  
  const m1 = a.persona_metadata;
  const m2 = b.persona_metadata;
  
  // Rule 1: Similar Tech Proficiency attracts
  const techDelta = Math.abs(m1.tech_proficiency - m2.tech_proficiency);
  const techScore = 1 - (techDelta / 100);
  
  // Rule 2: Shared Motivations
  const sharedMotivations = m1.motivations.filter(m => m2.motivations.includes(m)).length;
  const motivationScore = sharedMotivations > 0 ? 0.3 : 0;
  
  // Rule 3: Personality Archetypes
  const personalityMatch = 1 - (
    Math.abs(m1.personality.openness - m2.personality.openness) +
    Math.abs((m1.personality.extraversion || 50) - (m2.personality.extraversion || 50))
  ) / 200;

  let baseChance = (techScore * 0.4 + personalityMatch * 0.4 + motivationScore) * 1.0;

  // Environment influences interaction rates
  if (env) {
    if (env.condition === 'crunch_time') {
      // Less time for random interactions, highly targeted to useful people (high tech proficiency)
      baseChance *= 0.7; 
      if (m2.tech_proficiency > 85) baseChance += 0.2 * env.intensity;
    } else if (env.condition === 'innovation_phase') {
      // More cross-pollination
      baseChance *= 1.2;
    } else if (env.condition === 'resource_starved') {
      // Interactions drop as everyone focuses on survival/efficiency
      baseChance *= 0.6;
    }
  }

  return Math.max(0, Math.min(1.0, baseChance));
};

export const simulateBond = (source: AgentCard, target: AgentCard, env?: SwarmEnvironment): SwarmConnection | null => {
  const chance = calculateInteractionChance(source, target, env);
  
  if (chance > 0.65) {
    return {
      source: source.id,
      target: target.id,
      type: 'trust',
      strength: chance,
      metadata: { lastInteraction: new Date().toISOString() }
    };
  }
  
  if (chance < 0.25) {
    // If under crunch time, conflicts escalate faster
    const conflictStrength = env && env.condition === 'crunch_time' ? (1 - chance) * 1.5 : (1 - chance);
    return {
      source: source.id,
      target: target.id,
      type: 'conflict',
      strength: Math.min(1.0, conflictStrength),
      metadata: { reason: 'Divergent Value Systems' }
    };
  }

  return null;
};

/**
 * Exchange 'idCards' (Knowledge Units)
 * When personas interact, they might adopt tags or skills from each other.
 */
export const exchangeKnowledge = (source: AgentCard, target: AgentCard, env?: SwarmEnvironment) => {
  if (!source.persona_metadata || !target.persona_metadata) return null;
  
  const sourceSkills = source.skills || [];
  const targetSkills = target.skills || [];
  
  const newSkillsForTarget = sourceSkills.filter(s => !targetSkills.includes(s));
  const newSkillsForSource = targetSkills.filter(s => !sourceSkills.includes(s));
  
  let exchangeChance = 0.1; // 10% base chance
  
  if (env) {
    if (env.condition === 'innovation_phase') exchangeChance = 0.25;
    else if (env.condition === 'crunch_time') exchangeChance = 0.02;
  }
  
  return {
    sourceUpdate: newSkillsForSource.length > 0 && Math.random() < exchangeChance ? newSkillsForSource[0] : null,
    targetUpdate: newSkillsForTarget.length > 0 && Math.random() < exchangeChance ? newSkillsForTarget[0] : null
  };
};

/**
 * Influence Attributes
 * Higher status agents (Seniority/Reputation) slightly nudge the attributes of others.
 */
export const applyInfluence = (influencer: AgentCard, influenced: AgentCard, env?: SwarmEnvironment) => {
  const rolePriority: Record<string, number> = { 'staff': 4, 'senior': 3, 'mid': 2, 'junior': 1 };
  const p1 = rolePriority[influencer.experience_level || 'junior'] || 1;
  const p2 = rolePriority[influenced.experience_level || 'junior'] || 1;
  
  let influenceThreshold = 0.7; // 30% chance to influence
  
  if (env) {
    if (env.condition === 'resource_starved') influenceThreshold = 0.4; // 60% chance, juniors look to seniors
    if (env.condition === 'innovation_phase') influenceThreshold = 0.9; // 10% chance, more independent thinking
  }
  
  if (p1 > p2 && Math.random() > influenceThreshold) {
    // Influencer nudges Tech Proficiency towards their own
    const delta = influencer.persona_metadata!.tech_proficiency - influenced.persona_metadata!.tech_proficiency;
    
    // In crunch time, influence is stronger (forceful)
    const nudgeMultiplier = env?.condition === 'crunch_time' ? 0.1 : 0.05;
    
    return {
      tech_nudge: delta * nudgeMultiplier,
      personality_nudge: influencer.persona_metadata!.personality.openness > influenced.persona_metadata!.personality.openness ? 1 : -1
    };
  }
  return null;
};
