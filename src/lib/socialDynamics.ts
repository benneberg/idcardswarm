import { AgentCard, PersonaMetadata } from '../types';
import { SwarmConnection } from '../data/interactionRules';

/**
 * SocialDynamicsEngine
 * Logic for calculating interactions, influence, and knowledge sharing between personas.
 */

export const calculateInteractionChance = (a: AgentCard, b: AgentCard): number => {
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
    Math.abs(m1.personality.extraversion - m2.personality.extraversion)
  ) / 200;

  return (techScore * 0.4 + personalityMatch * 0.4 + motivationScore) * 1.0;
};

export const simulateBond = (source: AgentCard, target: AgentCard): SwarmConnection | null => {
  const chance = calculateInteractionChance(source, target);
  
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
    return {
      source: source.id,
      target: target.id,
      type: 'conflict',
      strength: 1 - chance,
      metadata: { reason: 'Divergent Value Systems' }
    };
  }

  return null;
};

/**
 * Exchange 'idCards' (Knowledge Units)
 * When personas interact, they might adopt tags or skills from each other.
 */
export const exchangeKnowledge = (source: AgentCard, target: AgentCard) => {
  if (!source.persona_metadata || !target.persona_metadata) return null;
  
  const sourceSkills = source.skills || [];
  const targetSkills = target.skills || [];
  
  // 10% chance to adopt a unique skill from the other
  const newSkillsForTarget = sourceSkills.filter(s => !targetSkills.includes(s));
  const newSkillsForSource = targetSkills.filter(s => !sourceSkills.includes(s));
  
  return {
    sourceUpdate: newSkillsForSource.length > 0 && Math.random() > 0.9 ? newSkillsForSource[0] : null,
    targetUpdate: newSkillsForTarget.length > 0 && Math.random() > 0.9 ? newSkillsForTarget[0] : null
  };
};

/**
 * Influence Attributes
 * Higher status agents (Seniority/Reputation) slightly nudge the attributes of others.
 */
export const applyInfluence = (influencer: AgentCard, influenced: AgentCard) => {
  const rolePriority = { 'staff': 4, 'senior': 3, 'mid': 2, 'junior': 1 };
  const p1 = rolePriority[influencer.experience_level || 'junior'];
  const p2 = rolePriority[influenced.experience_level || 'junior'];
  
  if (p1 > p2 && Math.random() > 0.7) {
    // Influencer nudges Tech Proficiency towards their own
    const delta = influencer.persona_metadata!.tech_proficiency - influenced.persona_metadata!.tech_proficiency;
    return {
      tech_nudge: delta * 0.05, // 5% nudge
      personality_nudge: influencer.persona_metadata!.personality.openness > influenced.persona_metadata!.personality.openness ? 1 : -1
    };
  }
  return null;
};
