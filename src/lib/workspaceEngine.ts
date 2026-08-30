import { WorkspaceRole, WorkspaceCollaborator, Workspace } from '../types';

/**
 * Workspace Collaborator & Role-Based Access Control (RBAC) Engine
 * Manages multi-user workspace membership, granular permission gates,
 * and collaborator lifecycle (Viewer, Contributor, Admin).
 */

export type WorkspaceAction = 
  | 'view'
  | 'orchestrate'
  | 'manage_dna'
  | 'manage_members'
  | 'delete';

const ROLE_PERMISSIONS: Record<WorkspaceRole, Set<WorkspaceAction>> = {
  viewer: new Set(['view']),
  contributor: new Set(['view', 'orchestrate', 'manage_dna']),
  admin: new Set(['view', 'orchestrate', 'manage_dna', 'manage_members', 'delete'])
};

/**
 * Verifies whether a role is authorized to perform a specific action.
 */
export function hasWorkspacePermission(role: WorkspaceRole, action: WorkspaceAction): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.has(action);
}

/**
 * Generates an invitation record for a new workspace collaborator.
 */
export function createWorkspaceInvite(
  email: string,
  role: WorkspaceRole,
  inviterId: string
): WorkspaceCollaborator {
  const sanitizedEmail = email.trim().toLowerCase();
  return {
    id: `collab_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    email: sanitizedEmail,
    role,
    status: 'pending',
    invitedAt: new Date().toISOString(),
    invitedBy: inviterId
  };
}

/**
 * Activates a pending invitation when accepted by the invited user.
 */
export function acceptWorkspaceInvite(
  collaborator: WorkspaceCollaborator
): WorkspaceCollaborator {
  return {
    ...collaborator,
    status: 'active',
    acceptedAt: new Date().toISOString()
  };
}

/**
 * Visual styling token helper for role badges.
 */
export function getRoleBadgeStyles(role: WorkspaceRole): {
  label: string;
  badgeClass: string;
  description: string;
} {
  switch (role) {
    case 'admin':
      return {
        label: 'Admin',
        badgeClass: 'bg-red-500/10 text-red-400 border-red-500/30',
        description: 'Full administrative control over swarm, DNA evolution, and membership.'
      };
    case 'contributor':
      return {
        label: 'Contributor',
        badgeClass: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        description: 'Can orchestrate swarm jobs, execute tasks, and upgrade agent DNA.'
      };
    case 'viewer':
    default:
      return {
        label: 'Viewer',
        badgeClass: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
        description: 'Read-only access to ecosystem telemetry, visualizer, and logs.'
      };
  }
}
