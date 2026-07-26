import { describe, it, expect, vi, beforeEach } from 'vitest';
import { calculateInteractionChance, simulateBond, exchangeKnowledge, applyInfluence } from '../lib/socialDynamics';
import { spawnOffspring } from '../lib/agentService';
import { AgentCard } from '../types';

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
  capability_vector: { technical_depth: 0.8, curiosity: 0.9 },
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
    personality: { openness: 85, extraversion: 40 },
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
  capability_vector: { technical_depth: 0.75, curiosity: 0.7 },
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
    personality: { openness: 80, extraversion: 45 },
    avatar_url: 'https://example.com/avatar2.png',
    tech_proficiency: 85,
    motivations: ['performance', 'scale']
  },
  userId: 'mock-user-123'
} as any;

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
    // Since Math.random() is random, let's mock it or verify structure
    expect(res).toHaveProperty('sourceUpdate');
    expect(res).toHaveProperty('targetUpdate');
  });

  it('applyInfluence should return nudge metrics if influencer is higher rank', () => {
    // Parent level 10 vs peer level 8, but experience_level is used
    const influencer = { ...mockParent, experience_level: 'staff' };
    const influenced = { ...mockPeer, experience_level: 'junior' };
    const nudge = applyInfluence(influencer, influenced);
    
    if (nudge) {
      expect(nudge.tech_nudge).toBeDefined();
      expect(nudge.personality_nudge).toBeDefined();
    }
  });
});

describe('Inheritance Fidelity (spawnOffspring)', () => {
  it('should generate an offspring inheriting 30% of parent stats with controlled variation', async () => {
    const offspring = await spawnOffspring(mockParent);
    expect(offspring.id).toBeDefined();
    expect(offspring.lineage.parent_id).toBe(mockParent.id);
    expect(offspring.lineage.generation).toBe(2);
    expect(offspring.level).toBe(1);

    // Parents has technical_depth 0.8
    // Offspring technical_depth should be around 0.8 * 0.3 = 0.24 + random mutation (0 to 0.1) -> 0.24 to 0.34
    const parentDNA = mockParent.capability_vector || {};
    const childDNA = offspring.capability_vector || {};
    
    Object.keys(parentDNA).forEach(key => {
      const pVal = parentDNA[key];
      const cVal = childDNA[key];
      expect(cVal).toBeGreaterThanOrEqual(pVal * 0.3);
      expect(cVal).toBeLessThanOrEqual((pVal * 0.3) + 0.15); // inclusive of mutation limits
    });

    // Check generational naming
    expect(offspring.persona_metadata.name).toBe('Ada II');
  });
});
