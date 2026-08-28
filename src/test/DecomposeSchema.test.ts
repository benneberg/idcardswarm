import { describe, it, expect } from 'vitest';

interface DecomposedTaskContract {
  id: string;
  description: string;
  type: string;
  dependencies: string[];
  routing_tags: string[];
  assigned_agents: string[];
}

/**
 * Validates whether a task dependency graph is a Directed Acyclic Graph (DAG)
 */
function isTaskGraphAcyclic(tasks: DecomposedTaskContract[]): boolean {
  const adjList = new Map<string, string[]>();
  tasks.forEach(t => adjList.set(t.id, [...t.dependencies]));

  const visited = new Set<string>();
  const recStack = new Set<string>();

  function hasCycle(node: string): boolean {
    visited.add(node);
    recStack.add(node);

    const neighbors = adjList.get(node) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor)) return true;
      } else if (recStack.has(neighbor)) {
        return true;
      }
    }

    recStack.delete(node);
    return false;
  }

  for (const task of tasks) {
    if (!visited.has(task.id)) {
      if (hasCycle(task.id)) return false;
    }
  }

  return true;
}

describe('Task Decomposition Schema & Graph Invariants', () => {
  const sampleDecomposedTasks: DecomposedTaskContract[] = [
    {
      id: 'task_arch_spec',
      description: 'Define technical architecture, component schemas, and interface contracts.',
      type: 'planning',
      dependencies: [],
      routing_tags: ['architecture', 'systems'],
      assigned_agents: ['agent_cto_01']
    },
    {
      id: 'task_backend_api',
      description: 'Implement Express REST API with rate-limiting and telemetry.',
      type: 'backend',
      dependencies: ['task_arch_spec'],
      routing_tags: ['nodejs', 'express', 'security'],
      assigned_agents: ['agent_backend_01']
    },
    {
      id: 'task_frontend_ui',
      description: 'Build React components and sociometric graph visualization.',
      type: 'frontend',
      dependencies: ['task_arch_spec'],
      routing_tags: ['react', 'tailwind', 'ui'],
      assigned_agents: ['agent_frontend_01']
    },
    {
      id: 'task_e2e_critique',
      description: 'Perform rigorous architectural and functional critique of integrated output.',
      type: 'evaluation',
      dependencies: ['task_backend_api', 'task_frontend_ui'],
      routing_tags: ['qa', 'security', 'review'],
      assigned_agents: ['agent_critic_01']
    }
  ];

  it('should conform to the mandatory DecomposedTaskContract schema', () => {
    sampleDecomposedTasks.forEach(task => {
      expect(task.id).toBeTypeOf('string');
      expect(task.id.length).toBeGreaterThan(0);
      expect(task.description).toBeTypeOf('string');
      expect(task.description.length).toBeGreaterThan(5);
      expect(task.type).toBeTypeOf('string');
      expect(Array.isArray(task.dependencies)).toBe(true);
      expect(Array.isArray(task.routing_tags)).toBe(true);
      expect(Array.isArray(task.assigned_agents)).toBe(true);
    });
  });

  it('should ensure all dependencies reference valid declared task ids', () => {
    const declaredIds = new Set(sampleDecomposedTasks.map(t => t.id));
    sampleDecomposedTasks.forEach(task => {
      task.dependencies.forEach(dep => {
        expect(declaredIds.has(dep)).toBe(true);
      });
    });
  });

  it('should guarantee acyclicity (DAG) for valid swarm execution plans', () => {
    expect(isTaskGraphAcyclic(sampleDecomposedTasks)).toBe(true);
  });

  it('should detect and reject circular dependencies in task graphs', () => {
    const circularTasks: DecomposedTaskContract[] = [
      {
        id: 'task_alpha',
        description: 'Task Alpha',
        type: 'execution',
        dependencies: ['task_beta'],
        routing_tags: [],
        assigned_agents: ['agent_1']
      },
      {
        id: 'task_beta',
        description: 'Task Beta',
        type: 'execution',
        dependencies: ['task_alpha'], // cycle!
        routing_tags: [],
        assigned_agents: ['agent_2']
      }
    ];

    expect(isTaskGraphAcyclic(circularTasks)).toBe(false);
  });
});
