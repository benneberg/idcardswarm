import { AgentCard, SwarmTask, EntityRelationship } from '../types';

/**
 * Autonomous Peer-to-Peer Task Delegation Engine
 * Enables senior/lead agents (leadership >= 0.70 or senior/staff tier)
 * to decompose complex tasks and delegate sub-tasks to high-affinity peers.
 */

export interface DelegationResult {
  canDelegate: boolean;
  leadAgent?: AgentCard;
  delegatePeer?: AgentCard;
  affinityScore?: number;
  reason?: string;
  subtaskDraft?: Partial<SwarmTask>;
}

/**
 * Evaluates whether an agent possesses the seniority/leadership
 * and the task has sufficient complexity to warrant peer delegation.
 */
export function canDelegate(agent: AgentCard, task: SwarmTask): boolean {
  if (!agent || !task) return false;

  // Only operational executors/general agents delegate
  if (agent.mode === 'critic') return false;

  // Seniority criteria: Leadership >= 0.70 OR Senior/Staff tier OR Level >= 5
  const leadershipScore = agent.capability_vector?.leadership ?? 0;
  const isSenior = agent.experience_level === 'senior' || agent.experience_level === 'staff';
  const isHighLevel = (agent.level ?? 1) >= 5;
  const hasLeadershipMaturity = leadershipScore >= 0.70 || (isSenior && leadershipScore >= 0.50) || isHighLevel;

  if (!hasLeadershipMaturity) return false;

  // Task criteria: High complexity (>= 4) OR complex routing tags
  const complexTags = ['architecture', 'infrastructure', 'audit', 'strategy', 'complex', 'synthesis', 'security'];
  const hasComplexTag = (task.routing_tags || []).some(tag => 
    complexTags.includes(tag.toLowerCase())
  );
  const isComplex = (task.complexity ?? 3) >= 4 || hasComplexTag;

  if (!isComplex) return false;

  // Invariance check: Prevent infinite recursive delegation (cannot delegate a delegated sub-task)
  if (task.parent_task_id || task.is_delegated) return false;

  // Invariance check: Cannot delegate if already spawned subtasks
  if (task.subtask_ids && task.subtask_ids.length > 0) return false;

  return true;
}

/**
 * Calculates mutual sociometric affinity between a Lead delegator and a candidate Peer.
 * Balances historical trust, technical capability resonance, and execution reliability.
 */
export function calculateDelegationAffinity(
  leadAgent: AgentCard,
  peerAgent: AgentCard,
  relationships: EntityRelationship[],
  taskTags: string[] = []
): number {
  if (leadAgent.id === peerAgent.id) return 0;

  // 1. Trust network score
  const relId1 = `${leadAgent.id}_${peerAgent.id}`;
  const relId2 = `${peerAgent.id}_${leadAgent.id}`;
  const rel = relationships.find(r => 
    (r.sourceId === leadAgent.id && r.targetId === peerAgent.id) ||
    (r.sourceId === peerAgent.id && r.targetId === leadAgent.id) ||
    r.sourceId + '_' + r.targetId === relId1 ||
    r.sourceId + '_' + r.targetId === relId2
  );

  const trustScore = rel ? (rel.trust ?? 0.5) : 0.50;
  const collabSuccess = rel ? Math.min(1, (rel.collaborationSuccess || 0) * 0.1) : 0.1;

  // 2. Skill resonance
  const taskKeywords = taskTags.map(t => t.toLowerCase());
  const peerSkills = (peerAgent.skills || []).map(s => s.toLowerCase());
  const matches = peerSkills.filter(skill => 
    taskKeywords.some(tag => skill.includes(tag) || tag.includes(skill))
  ).length;
  const skillResonance = Math.min(1, 0.3 + matches * 0.25);

  // 3. Capability alignment (technical depth & reliability)
  const peerTechDepth = peerAgent.capability_vector?.technical_depth ?? 0.5;
  const peerReliability = peerAgent.capability_vector?.reliability ?? 0.5;
  const capabilityFit = (peerTechDepth * 0.5) + (peerReliability * 0.5);

  // Composite weighted affinity
  const composite = (trustScore * 0.35) + (skillResonance * 0.35) + (collabSuccess * 0.10) + (capabilityFit * 0.20);
  return Math.round(composite * 1000) / 1000;
}

/**
 * Selects the optimal peer from available candidate agents based on trust & skill affinity.
 */
export function selectDelegationPeer(
  leadAgent: AgentCard,
  candidatePeers: AgentCard[],
  relationships: EntityRelationship[],
  taskTags: string[] = []
): { peer: AgentCard; affinityScore: number; reason: string } | null {
  const eligiblePeers = candidatePeers.filter(p => 
    p.id !== leadAgent.id && 
    p.mode !== 'critic'
  );

  if (eligiblePeers.length === 0) return null;

  const scoredPeers = eligiblePeers.map(peer => {
    const score = calculateDelegationAffinity(leadAgent, peer, relationships, taskTags);
    return { peer, score };
  });

  scoredPeers.sort((a, b) => b.score - a.score);
  const best = scoredPeers[0];

  if (!best || best.score < 0.25) return null;

  const reason = `Autonomous delegation by ${leadAgent.role || leadAgent.id} to ${best.peer.role || best.peer.id} (Affinity Resonance: ${Math.round(best.score * 100)}%)`;

  return {
    peer: best.peer,
    affinityScore: best.score,
    reason
  };
}

/**
 * Generates an autonomous sub-task draft partitioned from the parent task.
 */
export function createDelegatedSubtask(
  parentTask: SwarmTask,
  leadAgent: AgentCard,
  peerAgent: AgentCard,
  subtaskTitle?: string,
  specializedTags?: string[]
): Partial<SwarmTask> {
  const tags = specializedTags && specializedTags.length > 0
    ? specializedTags
    : (parentTask.routing_tags || ['execution', 'subtask']);

  const description = subtaskTitle || 
    `[Sub-Task Delegated by ${leadAgent.role || 'Lead'}]: Implement foundational components for: ${parentTask.description.slice(0, 120)}...`;

  return {
    jobId: parentTask.jobId,
    parent_task_id: parentTask.id,
    is_delegated: true,
    delegated_by: leadAgent.id,
    delegated_to: peerAgent.id,
    delegation_reason: `Lead ${leadAgent.role || leadAgent.id} authorized peer delegation to ${peerAgent.role || peerAgent.id}`,
    description,
    type: 'delegated_subtask',
    dependencies: [], // Can begin in parallel or as foundation
    assigned_agents: [peerAgent.id],
    input: {
      parentTaskId: parentTask.id,
      delegatedBy: leadAgent.id,
      directive: parentTask.description,
      parentContext: parentTask.input || {}
    },
    status: 'pending',
    routing_tags: tags,
    complexity: Math.max(1, (parentTask.complexity ?? 4) - 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}
