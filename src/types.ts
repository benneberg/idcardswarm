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
  capability_vector: {
    coding: number;
    system_design: number;
    debugging: number;
    ui_design: number;
    [key: string]: number;
  };
  version: string;
  ownerId: string;
  persona_metadata?: PersonaMetadata;
  level?: number;
  exp?: number;
  skill_points?: number;
  satisfaction?: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'done' | 'failed' | 'iterating';

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
}
