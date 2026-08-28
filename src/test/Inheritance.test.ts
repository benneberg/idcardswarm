import { describe, it, expect, vi } from 'vitest';
import { spawnOffspring } from '../lib/agentService';
import { AgentCard } from '../types';

// Mock firebase
vi.mock('../lib/firebase', () => ({
  db: {},
  auth: {
    currentUser: { uid: 'test-architect-uid' }
  },
  serverTimestamp: () => 'mock-timestamp'
}));

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: () => 'mock-timestamp',
  doc: vi.fn(),
  getDoc: vi.fn(),
  setDoc: vi.fn()
}));

describe('Inheritance Math & Lineage Suite', () => {
  const baseParent: AgentCard = {
    id: 'parent-agent-genesis',
    role: 'Principal Systems Engineer',
    mode: 'executor',
    skills: ['Distributed Systems', 'Kernel Tuning', 'RAFT Consensus'],
    behavior_rules: ['Guarantee zero data loss', 'Prioritize deterministic consensus'],
    capability_vector: {
      technical_depth: 0.90,
      curiosity: 0.70,
      reliability: 0.85,
      adaptability: 0.40,
      creativity: 0.60
    },
    lifecycle_stage: 'legacy',
    level: 20,
    exp: 2500,
    reputation: 95,
    trustScore: 92,
    strengths: ['Low latency fault tolerance'],
    weaknesses: ['Rigid protocol constraints'],
    tools: ['profiler', 'debugger'],
    priority_bias: { correctness: 0.8, speed: 0.1, elegance: 0.1 },
    persona_metadata: {
      name: 'Margaret Hamilton',
      bio: 'Pioneer of asynchronous software engineering and spaceflight avionics.',
      age: 42,
      occupation: 'Avionics Architect',
      personality: { openness: 80, extraversion: 50, conscientiousness: 98, risk_tolerance: 15 },
      avatar_url: 'https://example.com/avatar_margaret.png',
      tech_proficiency: 96,
      motivations: ['System infallibility', 'Zero crash tolerances'],
      pain_points: ['Premature optimization', 'Inadequate specifications']
    },
    experience_level: 'senior',
    context_budget: 8000,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-01T00:00:00Z',
    lineage: {
      generation: 1,
      mutations: ['Initial Genesis Seed']
    }
  };

  it('should reject spawning if user is not signed in or parent lacks persona metadata', async () => {
    const invalidParent = { ...baseParent, persona_metadata: undefined };
    await expect(spawnOffspring(invalidParent)).rejects.toThrow('Parent must have metadata and user must be signed in.');
  });

  it('should inherit 30% of parent capability DNA and clamp within [0.05, 0.95]', async () => {
    const offspring = await spawnOffspring(baseParent);
    const parentDNA = baseParent.capability_vector || {};
    const childDNA = offspring.capability_vector || {};

    Object.keys(parentDNA).forEach(metric => {
      const pVal = parentDNA[metric];
      const cVal = childDNA[metric];

      // Base 30% contribution: pVal * 0.3
      const expectedBase = pVal * 0.3;
      expect(cVal).toBeGreaterThanOrEqual(expectedBase);
      expect(cVal).toBeLessThanOrEqual(expectedBase + 0.15);

      // Must be strictly within [0.05, 0.95]
      expect(cVal).toBeGreaterThanOrEqual(0.05);
      expect(cVal).toBeLessThanOrEqual(0.95);
    });
  });

  it('should correctly increment generational counter and record lineage', async () => {
    const heir = await spawnOffspring(baseParent);
    expect(heir.lineage).toBeDefined();
    expect(heir.lineage!.parent_id).toBe(baseParent.id);
    expect(heir.lineage!.generation).toBe(2);
    expect(heir.level).toBe(1);
    expect(heir.exp).toBe(0);
    expect(heir.persona_metadata!.name).toBe('Margaret II');
  });

  it('should bound extreme parent values gracefully', async () => {
    const extremeParent: AgentCard = {
      ...baseParent,
      capability_vector: {
        technical_depth: 1.0,
        curiosity: 0.0,
        reliability: 1.0,
        adaptability: 0.0,
        creativity: 0.0
      }
    };

    const offspring = await spawnOffspring(extremeParent);
    const childDNA = offspring.capability_vector || {};

    Object.values(childDNA).forEach(val => {
      expect(val).toBeGreaterThanOrEqual(0.05);
      expect(val).toBeLessThanOrEqual(0.95);
    });
  });
});
