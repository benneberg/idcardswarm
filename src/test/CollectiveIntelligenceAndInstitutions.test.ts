import { describe, it, expect } from 'vitest';
import { 
  canDelegate,
  calculateDelegationAffinity,
  selectDelegationPeer,
  createDelegatedSubtask
} from '../lib/delegationEngine';
import { 
  PREDEFINED_INSTITUTIONS, 
  calculateInstitutionalCulture, 
  applyInstitutionalBuffs 
} from '../lib/institutionEngine';
import { 
  calculateAgentBid, 
  conductTaskAuction, 
  calculateMarketDividend,
  DEFAULT_INITIAL_TOKENS 
} from '../lib/marketBiddingEngine';
import { 
  hasWorkspacePermission, 
  createWorkspaceInvite, 
  acceptWorkspaceInvite, 
  getRoleBadgeStyles 
} from '../lib/workspaceEngine';
import { AgentCard, EntityRelationship, SwarmTask, Institution } from '../types';

describe('Track 5: Emergent Collective Intelligence & Institutions', () => {
  const leadAgent: AgentCard = {
    id: 'agent_lead',
    role: 'Principal Architect',
    mode: 'executor',
    experience_level: 'staff',
    skills: ['System Design', 'Architecture'],
    strengths: ['Scalability', 'Distributed Consensus'],
    weaknesses: ['Low-level bit twiddling'],
    tools: ['Compiler', 'Profiler'],
    behavior_rules: ['Delegate specialized subtasks'],
    context_budget: 8000,
    priority_bias: {
      correctness: 0.5,
      speed: 0.25,
      elegance: 0.25
    },
    capability_vector: {
      creativity: 0.70,
      strategic_thinking: 0.85,
      technical_depth: 0.90,
      communication: 0.80,
      leadership: 0.85,
      reliability: 0.88,
      curiosity: 0.75,
      adaptability: 0.75
    },
    reputation: 90,
    reputation_tokens: 150,
    ownerId: 'user_1',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  };

  const peerAgent: AgentCard = {
    id: 'agent_peer',
    role: 'Cloud Security Specialist',
    mode: 'executor',
    experience_level: 'junior',
    skills: ['IAM', 'Audit', 'Security'],
    strengths: ['Threat modeling', 'VPC hardening'],
    weaknesses: ['Frontend rendering'],
    tools: ['Static Analyzer', 'Audit Log Viewer'],
    behavior_rules: ['Enforce zero trust'],
    context_budget: 6000,
    priority_bias: {
      correctness: 0.6,
      speed: 0.2,
      elegance: 0.2
    },
    capability_vector: {
      creativity: 0.40,
      strategic_thinking: 0.60,
      technical_depth: 0.88,
      communication: 0.50,
      leadership: 0.40,
      reliability: 0.92,
      curiosity: 0.70,
      adaptability: 0.60
    },
    reputation: 80,
    reputation_tokens: 100,
    ownerId: 'user_1',
    createdAt: '2026-06-01T00:00:00Z',
    updatedAt: '2026-06-01T00:00:00Z'
  };

  const relationships: EntityRelationship[] = [
    {
      sourceId: 'agent_lead',
      targetId: 'agent_peer',
      trust: 0.88,
      influence: 0.80,
      collaborationSuccess: 0.90,
      agreementRate: 0.85,
      conflictRate: 0.05,
      reliability: 0.92,
      lastInteraction: '2026-06-08T00:00:00.000Z'
    }
  ];

  describe('Autonomous Peer-to-Peer Task Delegation Engine', () => {
    it('verifies lead agent qualification criteria based on leadership vector threshold (>= 0.7)', () => {
      const complexTask: SwarmTask = {
        id: 'task_infra_sec',
        jobId: 'job_1',
        description: 'Comprehensive enterprise penetration test and cloud security audit for VPC',
        status: 'pending',
        type: 'executor',
        complexity: 4,
        routing_tags: ['security', 'audit'],
        dependencies: [],
        assigned_agents: ['agent_lead'],
        input: {},
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z'
      };

      expect(canDelegate(leadAgent, complexTask)).toBe(true);
      expect(canDelegate(peerAgent, complexTask)).toBe(false);
    });

    it('identifies best delegatee based on affinity and reliability', () => {
      const candidates = [leadAgent, peerAgent];
      const match = selectDelegationPeer(leadAgent, candidates, relationships, ['security', 'audit']);
      expect(match).not.toBeNull();
      expect(match?.peer.id).toBe('agent_peer');
      expect(match?.affinityScore).toBeGreaterThan(0.4);
      expect(match?.reason).toContain('Autonomous delegation');
    });

    it('evaluates autonomous delegation and produces partitioned subtask draft', () => {
      const parentTask: SwarmTask = {
        id: 'task_infra_sec',
        jobId: 'job_1',
        description: 'Comprehensive enterprise penetration test and cloud security audit for VPC',
        status: 'pending',
        type: 'executor',
        complexity: 4,
        routing_tags: ['security', 'audit'],
        assigned_agents: ['agent_lead'],
        dependencies: [],
        input: {},
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z'
      };

      const subtask = createDelegatedSubtask(
        parentTask,
        leadAgent,
        peerAgent,
        'Perform IAM Policy Security Audit',
        ['security', 'iam']
      );

      expect(subtask.is_delegated).toBe(true);
      expect(subtask.parent_task_id).toBe('task_infra_sec');
      expect(subtask.delegated_by).toBe('agent_lead');
      expect(subtask.delegated_to).toBe('agent_peer');
      expect(subtask.assigned_agents).toEqual(['agent_peer']);
      expect(subtask.type).toBe('delegated_subtask');
    });
  });

  describe('Institutional Culture & Guild Memory Vectors', () => {
    it('initializes default guilds with strictly clamped cultural vectors [0.05, 0.95]', () => {
      expect(PREDEFINED_INSTITUTIONS.length).toBeGreaterThanOrEqual(3);

      PREDEFINED_INSTITUTIONS.forEach(inst => {
        Object.values(inst.cultural_vector).forEach(val => {
          expect(val).toBeGreaterThanOrEqual(0.05);
          expect(val).toBeLessThanOrEqual(0.95);
        });
      });
    });

    it('calculates aggregate institutional culture bounded within [0.05, 0.95]', () => {
      const aggregate = calculateInstitutionalCulture([leadAgent, peerAgent]);
      expect(aggregate.technical_depth).toBeCloseTo((0.90 + 0.88) / 2, 2);
      expect(aggregate.leadership).toBeCloseTo((0.85 + 0.40) / 2, 2);
      Object.values(aggregate).forEach(val => {
        expect(val).toBeGreaterThanOrEqual(0.05);
        expect(val).toBeLessThanOrEqual(0.95);
      });
    });

    it('correctly applies institutional buffs to affiliated agent capability vectors', () => {
      const sreGuild: Institution = {
        ...PREDEFINED_INSTITUTIONS[0],
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z'
      };

      const buffed = applyInstitutionalBuffs(leadAgent, sreGuild);
      expect(buffed.capability_vector?.reliability).toBeGreaterThanOrEqual(leadAgent.capability_vector!.reliability!);
      expect(buffed.guild_name).toBe(sreGuild.name);
      expect(buffed.institution_id).toBe(sreGuild.id);
      expect(buffed.behavior_rules.some(r => r.includes(sreGuild.name))).toBe(true);
    });
  });

  describe('Market-Based Task Bidding & Reputation Currency Engine', () => {
    it('calculates agent bids based on capability resonance and available tokens', () => {
      const task: SwarmTask = {
        id: 'task_audit',
        jobId: 'job_1',
        description: 'Vulnerability scan and security assessment of smart nodes',
        status: 'pending',
        type: 'executor',
        routing_tags: ['security', 'audit'],
        dependencies: [],
        assigned_agents: [],
        input: {},
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z'
      };

      const bid = calculateAgentBid(peerAgent, task, 120);
      expect(bid.agentId).toBe('agent_peer');
      expect(bid.bidAmount).toBeGreaterThanOrEqual(5);
      expect(bid.bidAmount).toBeLessThanOrEqual(30);
      expect(bid.resonanceScore).toBeGreaterThan(0.5);
    });

    it('conducts task auction, selecting highest weighted resonance bidder as winner', () => {
      const task: SwarmTask = {
        id: 'task_audit',
        jobId: 'job_1',
        description: 'Vulnerability scan and security assessment of smart nodes',
        status: 'pending',
        type: 'executor',
        routing_tags: ['security', 'audit'],
        dependencies: [],
        assigned_agents: [],
        input: {},
        createdAt: '2026-06-01T00:00:00Z',
        updatedAt: '2026-06-01T00:00:00Z'
      };

      const auction = conductTaskAuction(task, [leadAgent, peerAgent]);
      expect(auction.allBids.length).toBe(2);
      expect(auction.winningBid).not.toBeNull();
      expect(auction.winningBid?.agentId).toBeDefined();
      expect(auction.winningBid?.status).toBe('accepted');
    });

    it('settles auction dividends correctly after task completion', () => {
      const winningBid = {
        id: 'bid_1',
        taskId: 'task_1',
        agentId: 'agent_peer',
        agentName: 'Cloud Security Specialist',
        bidAmount: 20,
        resonanceScore: 0.85,
        rationale: 'High resonance',
        timestamp: new Date().toISOString(),
        status: 'accepted' as const
      };

      const result = calculateMarketDividend(winningBid, 0.85, 3);
      expect(result.outcome).toBe('profit');
      expect(result.netTokenChange).toBeGreaterThan(0);
      expect(result.tokenDividend).toBe(20 + result.netTokenChange);
      expect(result.repDividend).toBeGreaterThan(0);
    });
  });

  describe('Track 3: Multi-User Collaboration & RBAC Engine', () => {
    it('enforces RBAC permissions matrix correctly across roles', () => {
      expect(hasWorkspacePermission('admin', 'orchestrate')).toBe(true);
      expect(hasWorkspacePermission('admin', 'manage_members')).toBe(true);
      expect(hasWorkspacePermission('admin', 'delete')).toBe(true);

      expect(hasWorkspacePermission('contributor', 'orchestrate')).toBe(true);
      expect(hasWorkspacePermission('contributor', 'manage_members')).toBe(false);
      expect(hasWorkspacePermission('contributor', 'delete')).toBe(false);

      expect(hasWorkspacePermission('viewer', 'view')).toBe(true);
      expect(hasWorkspacePermission('viewer', 'orchestrate')).toBe(false);
      expect(hasWorkspacePermission('viewer', 'manage_members')).toBe(false);
    });

    it('creates and accepts collaborator invitations correctly', () => {
      const invite = createWorkspaceInvite('analyst@civitas.ai', 'contributor', 'user_admin');
      expect(invite.email).toBe('analyst@civitas.ai');
      expect(invite.role).toBe('contributor');
      expect(invite.status).toBe('pending');

      const accepted = acceptWorkspaceInvite(invite);
      expect(accepted.status).toBe('active');
      expect(accepted.acceptedAt).toBeDefined();
    });

    it('provides distinct UI styling tokens for each workspace role', () => {
      const adminBadge = getRoleBadgeStyles('admin');
      const contributorBadge = getRoleBadgeStyles('contributor');
      const viewerBadge = getRoleBadgeStyles('viewer');

      expect(adminBadge.label).toBe('Admin');
      expect(contributorBadge.label).toBe('Contributor');
      expect(viewerBadge.label).toBe('Viewer');
      expect(adminBadge.badgeClass).toContain('red');
      expect(contributorBadge.badgeClass).toContain('blue');
      expect(viewerBadge.badgeClass).toContain('zinc');
    });
  });
});
