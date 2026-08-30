/**
 * idCard Personas Swarm Types
 */

export type AgentMode = 'executor' | 'critic' | 'simulator';

export interface PersonaMetadata {
  name: string;
  age: number;
  occupation: string;
  bio: string;
  motivations: string[];
  pain_points: string[];
  avatar_url?: string;
  contact?: string;
  tech_proficiency: number; // 0-100
  personality: {
    openness: number;
    conscientiousness: number;
    risk_tolerance: number;
    extraversion?: number;
    agreeableness?: number;
  };
}

export interface AgentCard {
  id: string;
  role: string;
  mode: AgentMode;
  skills: string[];
  experience_level: 'junior' | 'mid' | 'senior' | 'staff';
  strengths: string[];
  weaknesses: string[];
  tools: string[];
  behavior_rules: string[];
  context_budget: number;
  priority_bias: {
    correctness: number;
    speed: number;
    elegance: number;
  };
  capability_vector?: {
    creativity?: number;
    strategic_thinking?: number;
    technical_depth?: number;
    communication?: number;
    leadership?: number;
    risk_tolerance?: number;
    research_ability?: number;
    reliability?: number;
    curiosity?: number;
    adaptability?: number;
    [key: string]: number | undefined;
  };
  ownerId?: string;
  reputation?: number;
  reputation_tokens?: number;
  trustScore?: number;
  level?: number;
  exp?: number;
  skill_points?: number;
  satisfaction?: number;
  lifecycle_stage?: 'initialization' | 'learning' | 'collaboration' | 'leadership' | 'mentorship' | 'legacy';
  reputation_history?: { score: number; timestamp: string; reason: string }[];
  achievements?: Achievement[];
  evolution_history?: EvolutionEvent[];
  lineage?: {
    parent_id?: string;
    generation: number;
    mutations?: string[];
  };
  institution_id?: string;
  guild_name?: string;
  createdAt: string;
  updatedAt: string;
  persona_metadata?: PersonaMetadata;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt: string;
  icon: string;
}

export interface EvolutionEvent {
  id: string;
  type: 'level_up' | 'skill_upgrade' | 'milestone';
  description: string;
  timestamp: string;
  metadata?: any;
}

export interface EntityRelationship {
  sourceId: string;
  targetId: string;
  trust: number;
  influence: number;
  collaborationSuccess: number;
  agreementRate: number;
  conflictRate: number;
  reliability: number;
  lastInteraction: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'failed' | 'iterating';

export type SwarmEnvironmentCondition = 'crunch_time' | 'innovation_phase' | 'maintenance_mode' | 'resource_starved' | 'high_ambiguity';

export interface SwarmEnvironment {
  condition: SwarmEnvironmentCondition;
  intensity: number; // 0 to 1
  resources: number; // 0 to 1 (Compute/Time/Budget)
  activeObstacles: string[];
}

export interface SwarmState {
  environment: SwarmEnvironment;
  activeTasks: number;
  completedTasks: number;
  failedTasks: number;
}


export interface TaskBid {
  id: string;
  taskId: string;
  agentId: string;
  agentName: string;
  resonanceScore: number;
  bidAmount: number; // reputation tokens wagered
  rationale: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'outbid';
}

export interface SwarmTask {
  id: string;
  jobId: string;
  description: string;
  type: string;
  dependencies: string[];
  assigned_agents: string[]; // Agent IDs
  input: Record<string, any>;
  output?: {
    artifact_path: string;
    content?: string;
  };
  status: TaskStatus;
  routing_tags: string[];
  confidence?: number;
  complexity?: number;
  duration?: number;
  // Peer-to-Peer Delegation fields
  parent_task_id?: string;
  is_delegated?: boolean;
  delegated_by?: string; // Lead agent ID
  delegated_to?: string; // Peer executor agent ID
  delegation_reason?: string;
  subtask_ids?: string[];
  // Market-based bidding fields
  bids?: TaskBid[];
  winning_bid?: TaskBid;
  createdAt: string;
  updatedAt: string;
}

export interface EvaluationIssue {
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  description: string;
  location?: string;
}

export interface EvaluationReview {
  id: string;
  taskId: string;
  agentId: string;
  score: number;
  issues: EvaluationIssue[];
  recommendations: string[];
  risk_flags: {
    level: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }[];
  createdAt: string;
}

export interface SwarmJob {
  id: string;
  goal: string;
  teamId: string;
  status: 'planning' | 'executing' | 'synthesizing' | 'completed' | 'failed';
  userId: string;
  max_iterations: number;
  current_iteration: number;
  createdAt: string;
  updatedAt: string;
}

export interface SwarmTeam {
  id: string;
  name: string;
  description: string;
  agentIds: string[];
  criticIds: string[];
  max_iterations: number;
  archetype?: string;
}

export interface SwarmArchetype {
  id: string;
  name: string;
  description: string;
  composition: {
    role: string;
    description: string;
    count: number;
  }[];
}

export interface SwarmReport {
  id: string;
  jobId: string;
  metrics: {
    quality: number;
    accuracy: number;
    consensus: number;
    efficiency: number;
    productivity: number;
    innovation: number;
    hallucinationRate: number;
    timeToCompletion: number;
  };
  insights: string[];
  createdAt: string;
}

export interface GuildMemory {
  id: string;
  title: string;
  lesson: string;
  recordedAt: string;
  contributorAgentId: string;
  tag?: string;
}

export interface InstitutionBuff {
  name: string;
  description: string;
  statBuffs: Record<string, number>;
  priorityBiasShift?: {
    correctness?: number;
    speed?: number;
    elegance?: number;
  };
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  motto: string;
  archetypeKey: string;
  memberAgentIds: string[];
  cultural_vector: {
    creativity: number;
    strategic_thinking: number;
    technical_depth: number;
    communication: number;
    leadership: number;
    reliability: number;
    curiosity: number;
    adaptability: number;
  };
  passive_buffs: InstitutionBuff[];
  guild_memory: GuildMemory[];
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export type WorkspaceRole = 'viewer' | 'contributor' | 'admin';

export interface WorkspaceCollaborator {
  id: string;
  email: string;
  role: WorkspaceRole;
  status: 'pending' | 'active';
  invitedAt: string;
  acceptedAt?: string;
  invitedBy: string;
}

export interface Workspace {
  id: string;
  name: string;
  ownerId: string;
  ownerEmail: string;
  collaborators: WorkspaceCollaborator[];
  createdAt: string;
  updatedAt: string;
}

