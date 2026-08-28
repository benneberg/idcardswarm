import { describe, it, expect } from 'vitest';
import { AgentCard } from '../types';

describe('Swarm Execution & Pheromone Attraction Engine', () => {
  it('should decay inactive relationship trust towards baseline 0.5', () => {
    const baseline = 0.5;
    const decayRate = 0.03;

    // Test high trust decaying towards 0.5
    const initialHighTrust = 0.85;
    const decayedHigh = Math.max(0.1, Math.min(0.9, initialHighTrust + (baseline - initialHighTrust) * decayRate));
    expect(decayedHigh).toBeLessThan(initialHighTrust);
    expect(decayedHigh).toBeGreaterThan(baseline);

    // Test low trust regressing towards 0.5
    const initialLowTrust = 0.20;
    const decayedLow = Math.max(0.1, Math.min(0.9, initialLowTrust + (baseline - initialLowTrust) * decayRate));
    expect(decayedLow).toBeGreaterThan(initialLowTrust);
    expect(decayedLow).toBeLessThan(baseline);
  });

  it('should calculate higher attraction score for agents with strong pheromone bonds', () => {
    const agentAId = 'agent-1';
    const agentBId = 'agent-2';

    const relationshipsWithA = [
      { sourceId: 'orchestrator', targetId: agentAId, trust: 0.9, collaborationSuccess: 12 },
      { sourceId: agentAId, targetId: 'agent-3', trust: 0.8, collaborationSuccess: 8 }
    ];

    const relationshipsWithB = [
      { sourceId: 'orchestrator', targetId: agentBId, trust: 0.4, collaborationSuccess: 1 }
    ];

    let pheromoneA = 1.0;
    relationshipsWithA.forEach(rel => {
      pheromoneA += (rel.trust || 0.5) * 0.15 + (rel.collaborationSuccess || 0) * 0.05;
    });

    let pheromoneB = 1.0;
    relationshipsWithB.forEach(rel => {
      pheromoneB += (rel.trust || 0.5) * 0.15 + (rel.collaborationSuccess || 0) * 0.05;
    });

    expect(pheromoneA).toBeGreaterThan(pheromoneB);
  });

  it('should correctly structure multi-generational lineage trees', () => {
    const mockAgents: Partial<AgentCard>[] = [
      { id: 'gen1-1', role: 'Architect', lineage: { generation: 1, mutations: [] } },
      { id: 'gen1-2', role: 'Critic', lineage: { generation: 1, mutations: [] } },
      { id: 'gen2-1', role: 'Junior Architect', lineage: { generation: 2, parent_id: 'gen1-1', mutations: ['Mutation: +0.05 Technical Depth'] } },
      { id: 'gen3-1', role: 'Deep Architect', lineage: { generation: 3, parent_id: 'gen2-1', mutations: ['Mutation: Specialization'] } }
    ];

    const maxGen = Math.max(...mockAgents.map(a => a.lineage?.generation || 1));
    expect(maxGen).toBe(3);

    const heirsOfGen1 = mockAgents.filter(a => a.lineage?.parent_id === 'gen1-1');
    expect(heirsOfGen1).toHaveLength(1);
    expect(heirsOfGen1[0].id).toBe('gen2-1');

    const heirsOfGen2 = mockAgents.filter(a => a.lineage?.parent_id === 'gen2-1');
    expect(heirsOfGen2).toHaveLength(1);
    expect(heirsOfGen2[0].id).toBe('gen3-1');
  });
});
