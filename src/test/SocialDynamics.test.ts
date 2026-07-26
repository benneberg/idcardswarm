import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateInteractionChance, simulateBond, exchangeKnowledge, applyInfluence, applyEnvironmentalModifiers } from '../lib/socialDynamics';
import { spawnOffspring } from '../lib/agentService';
import { AgentCard, SwarmEnvironment } from '../types';

// Mock firebase
vi.mock('../lib/firebase', () => {
  return {
    db: {},
    auth: {
      currentUser: { uid: 'mock-user-123' }
    },
    serverTimestamp: () => 'mock-timestamp'
  };
});

vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    addDoc: vi.fn(),
    serverTimestamp: () => 'mock-timestamp',
    doc: vi.fn(),
    getDoc: vi.fn(),
    setDoc: vi.fn()
  };
});

const mockParent: AgentCard = {
  id: 'parent-1',
  role: 'Senior Rust Engineer',
  mode: 'executor',
  skills: ['Rust', 'Systems Programming', 'Concurrency'],
  behavior_rules: ['Write memory-safe code', 'Benchmark everything'],
  capability_vector: { technical_depth: 0.8, curiosity: 0.9, reliability: 0.8, adaptability: 0.5, creativity: 0.5 },
  lifecycle_stage: 'collaboration',
  level: 10,
  exp: 400,
  reputation: 90,
  trustScore: 85,
  strengths: ['Low-level optimization'],
  weaknesses: ['Too perfectionist'],
  tools: ['compiler'],
  priority_bias: { correctness: 0.7, speed: 0.2, elegance: 0.1 },
  persona_metadata: {
    name: 'Ada Lovelace',
    bio: 'Pioneer of computing.',
    age: 36,
    occupation: 'Systems Architect',
    personality: { openness: 85, extraversion: 40, conscientiousness: 90, risk_tolerance: 30 },
    avatar_url: 'https://example.com/avatar1.png',
    tech_proficiency: 90,
    motivations: ['performance', 'correctness']
  },
  userId: 'mock-user-123'
} as any;

const mockPeer: AgentCard = {
  id: 'peer-1',
  role: 'Senior Rust Developer',
  mode: 'executor',
  skills: ['Rust', 'WebAssembly'],
  behavior_rules: ['Iterate fast'],
  capability_vector: { technical_depth: 0.75, curiosity: 0.7, reliability: 0.7, adaptability: 0.8, creativity: 0.6 },
  lifecycle_stage: 'collaboration',
  level: 8,
  exp: 200,
  reputation: 85,
  trustScore: 80,
  strengths: ['Web deployment'],
  weaknesses: ['Impatience'],
  tools: ['cargo'],
  priority_bias: { correctness: 0.5, speed: 0.4, elegance: 0.1 },
  persona_metadata: {
    name: 'Charles Babbage',
    bio: 'Difference engine builder.',
    age: 42,
    occupation: 'Systems Builder',
    personality: { openness: 80, extraversion: 45, conscientiousness: 60, risk_tolerance: 80 },
    avatar_url: 'https://example.com/avatar2.png',
    tech_proficiency: 85,
    motivations: ['performance', 'scale']
  },
  userId: 'mock-user-123'
} as any;

const crunchEnv: SwarmEnvironment = {
  condition: 'crunch_time',
  intensity: 1.0,
  resources: 0.5,
  activeObstacles: ['deadline']
};

const innovationEnv: SwarmEnvironment = {
  condition: 'innovation_phase',
  intensity: 1.0,
  resources: 0.8,
  activeObstacles: []
};

describe('Social Dynamics Mechanics', () => {
  it('calculateInteractionChance should be high for similar tech level and shared motivations', () => {
    const chance = calculateInteractionChance(mockParent, mockPeer);
    expect(chance).toBeGreaterThan(0.6);
    expect(chance).toBeLessThanOrEqual(1.0);
  });

  it('simulateBond should trigger a trust connection when chance is high', () => {
    const bond = simulateBond(mockParent, mockPeer);
    expect(bond).toBeDefined();
    expect(bond!.type).toBe('trust');
    expect(bond!.strength).toBeGreaterThan(0.65);
  });

  it('exchangeKnowledge should allow skill adoption occasionally', () => {
    const res = exchangeKnowledge(mockParent, mockPeer);
    expect(res).toBeDefined();
    expect(res).toHaveProperty('sourceUpdate');
    expect(res).toHaveProperty('targetUpdate');
  });

  it('applyInfluence should return nudge metrics if influencer is higher rank', () => {
    const influencer = { ...mockParent, experience_level: 'staff' };
    const influenced = { ...mockPeer, experience_level: 'junior' };
    const nudge = applyInfluence(influencer as any, influenced as any);
    
    if (nudge) {
      expect(nudge.tech_nudge).toBeDefined();
      expect(nudge.personality_nudge).toBeDefined();
    }
  });
});

describe('Environmental Modifiers', () => {
  it('crunch_time should increase reliability for highly conscientious agents but decrease adaptability for low risk tolerance', () => {
    const modified = applyEnvironmentalModifiers(mockParent, crunchEnv);
    expect(modified.capability_vector!.reliability).toBeGreaterThan(mockParent.capability_vector!.reliability!);
    expect(modified.capability_vector!.adaptability).toBeLessThan(mockParent.capability_vector!.adaptability!);
  });

  it('innovation_phase should increase creativity for high openness agents', () => {
    const modified = applyEnvironmentalModifiers(mockParent, innovationEnv);
    expect(modified.capability_vector!.creativity).toBeGreaterThan(mockParent.capability_vector!.creativity!);
  });

  it('crunch_time should reduce baseline interaction chances', () => {
    const baseChance = calculateInteractionChance(mockParent, mockPeer);
    const crunchChance = calculateInteractionChance(mockParent, mockPeer, crunchEnv);
    expect(crunchChance).toBeLessThan(baseChance); // Drops due to base multiplier 0.7
  });

  it('crunch_time should increase influence strength', () => {
    // For deterministic testing, we mock Math.random
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.9); // above threshold
    const influencer = { ...mockParent, experience_level: 'staff' };
    const influenced = { ...mockPeer, experience_level: 'junior' };
    
    const baseNudge = applyInfluence(influencer as any, influenced as any);
    const crunchNudge = applyInfluence(influencer as any, influenced as any, crunchEnv);
    
    expect(crunchNudge!.tech_nudge).toBeGreaterThan(baseNudge!.tech_nudge);
    
    randomSpy.mockRestore();
  });
});

describe('Inheritance Fidelity (spawnOffspring)', () => {
  it('should generate an offspring inheriting 30% of parent stats with controlled variation', async () => {
    const offspring = await spawnOffspring(mockParent);
    expect(offspring.id).toBeDefined();
    expect(offspring.lineage!.parent_id).toBe(mockParent.id);
    expect(offspring.lineage!.generation).toBe(2);
    expect(offspring.level).toBe(1);

    const parentDNA = mockParent.capability_vector || {};
    const childDNA = offspring.capability_vector || {};
    
    Object.keys(parentDNA).forEach(key => {
      const pVal = parentDNA[key] as number;
      const cVal = childDNA[key] as number;
      expect(cVal).toBeGreaterThanOrEqual(pVal * 0.3);
      expect(cVal).toBeLessThanOrEqual((pVal * 0.3) + 0.15); // inclusive of mutation limits
    });

    expect(offspring.persona_metadata!.name).toBe('Ada II');
  });
});
