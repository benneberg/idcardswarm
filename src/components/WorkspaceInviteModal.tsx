import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, UserPlus, Users, Shield, Check, Trash2, Mail } from 'lucide-react';
import { Workspace, WorkspaceCollaborator, WorkspaceRole } from '../types';
import { getRoleBadgeStyles, hasWorkspacePermission } from '../lib/workspaceEngine';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  workspace: Workspace | null;
  collaborators: WorkspaceCollaborator[];
  activeRole: WorkspaceRole;
  onSimulateRole: (role: WorkspaceRole) => void;
  onInviteCollaborator: (email: string, role: WorkspaceRole) => Promise<void>;
  onUpdateMemberRole: (collabId: string, newRole: WorkspaceRole) => Promise<void>;
  onRemoveCollaborator: (collabId: string) => Promise<void>;
}

export const WorkspaceInviteModal: React.FC<Props> = ({
  isOpen,
  onClose,
  workspace,
  collaborators,
  activeRole,
  onSimulateRole,
  onInviteCollaborator,
  onUpdateMemberRole,
  onRemoveCollaborator
}) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<WorkspaceRole>('contributor');
  const [submitting, setSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const canManageMembers = hasWorkspacePermission(activeRole, 'manage_members');

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setFeedbackMsg('Please provide a valid email address.');
      return;
    }
    if (!canManageMembers) {
      setFeedbackMsg('Permission Denied: Only Admin can invite collaborators.');
      return;
    }

    setSubmitting(true);
    setFeedbackMsg(null);
    try {
      await onInviteCollaborator(email.trim(), selectedRole);
      setEmail('');
      setFeedbackMsg(`Invitation sent to ${email.trim()} as ${selectedRole}.`);
    } catch (err) {
      setFeedbackMsg('Failed to dispatch invite.');
    } finally {
      setSubmitting(false);
    }
  };

  const activeStyles = getRoleBadgeStyles(activeRole);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border-4 border-black editorial-shadow"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-black p-6 bg-[#FBF9F5]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Users className="text-black" size={18} />
              <span className="font-mono text-xs uppercase tracking-[0.25em] font-bold">Workspace Access & Governance</span>
            </div>
            <h2 className="font-serif text-3xl font-bold italic tracking-tight">Collaborators & RBAC</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Active Role & Role Simulator Banner */}
          <div className="p-4 border-2 border-black bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Shield size={16} />
                <span className="font-mono text-xs uppercase tracking-wider font-bold">Active Operational Role:</span>
                <span className={`px-2 py-0.5 border font-mono text-[10px] uppercase font-bold ${activeStyles.badgeClass}`}>
                  {activeStyles.label}
                </span>
              </div>
              <p className="text-xs font-sans text-stone-600 mt-1">{activeStyles.description}</p>
            </div>

            {/* Role Simulation Switcher */}
            <div className="flex flex-col items-start sm:items-end gap-1">
              <span className="font-mono text-[9px] uppercase tracking-widest text-stone-500 font-bold">Role Simulator</span>
              <div className="flex border border-black bg-white">
                {(['admin', 'contributor', 'viewer'] as WorkspaceRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => onSimulateRole(r)}
                    className={`px-3 py-1 text-[10px] font-mono uppercase font-bold transition-colors ${
                      activeRole === r ? 'bg-black text-white' : 'text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Invite Collaborator Form */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-black/15 pb-2">
              <UserPlus size={16} />
              <h3 className="font-mono text-xs uppercase tracking-wider font-bold">Invite Collaborator</h3>
            </div>

            {!canManageMembers ? (
              <p className="font-serif italic text-xs text-stone-500 p-3 bg-stone-50 border border-black/10">
                You are currently simulating the <strong>{activeRole}</strong> role. Inviting collaborators requires <strong>Admin</strong> privileges.
              </p>
            ) : (
              <form onSubmit={handleInviteSubmit} className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="email"
                    placeholder="collaborator@civitas.ai"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-black bg-white font-mono text-xs outline-none focus:ring-1 focus:ring-black"
                    required
                  />
                </div>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as WorkspaceRole)}
                  className="px-3 py-2 border border-black bg-white font-mono text-xs font-bold uppercase"
                >
                  <option value="contributor">Contributor</option>
                  <option value="viewer">Viewer (Read-Only)</option>
                  <option value="admin">Admin</option>
                </select>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-black text-white font-mono text-xs uppercase tracking-wider font-bold hover:bg-black/80 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Dispatching...' : 'Invite'}
                </button>
              </form>
            )}

            {feedbackMsg && (
              <div className="p-2 border border-black bg-stone-50 font-mono text-[10px] text-stone-700">
                {feedbackMsg}
              </div>
            )}
          </div>

          {/* Members & Collaborators List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-black/15 pb-2">
              <div className="flex items-center gap-2">
                <Users size={16} />
                <h3 className="font-mono text-xs uppercase tracking-wider font-bold">Workspace Members ({collaborators.length + 1})</h3>
              </div>
              <span className="font-mono text-[9px] uppercase text-stone-400">
                Workspace: {workspace?.name || 'Primary Swarm Workspace'}
              </span>
            </div>

            <div className="space-y-2">
              {/* Owner Row */}
              <div className="p-3 border border-black bg-[#FAF8F5] flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif font-bold text-sm">{workspace?.ownerEmail || 'Primary Account'}</span>
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 bg-black text-white font-bold">Owner</span>
                  </div>
                  <span className="font-mono text-[10px] text-stone-500">Full Workspace Governance</span>
                </div>
                <span className="px-2 py-0.5 border font-mono text-[9px] uppercase font-bold bg-red-500/10 text-red-700 border-red-500/30">
                  Admin
                </span>
              </div>

              {/* Collaborator Rows */}
              {collaborators.map(c => {
                const cStyles = getRoleBadgeStyles(c.role);
                return (
                  <div key={c.id} className="p-3 border border-black/20 bg-white flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm">{c.email}</span>
                        <span className={`font-mono text-[9px] uppercase px-1.5 py-0.2 border ${
                          c.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="font-mono text-[9px] text-stone-400">
                        Invited {new Date(c.invitedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {canManageMembers ? (
                        <select
                          value={c.role}
                          onChange={(e) => onUpdateMemberRole(c.id, e.target.value as WorkspaceRole)}
                          className="px-2 py-1 border border-black font-mono text-[10px] uppercase font-bold bg-white"
                        >
                          <option value="viewer">Viewer</option>
                          <option value="contributor">Contributor</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : (
                        <span className={`px-2 py-0.5 border font-mono text-[9px] uppercase font-bold ${cStyles.badgeClass}`}>
                          {cStyles.label}
                        </span>
                      )}

                      {canManageMembers && (
                        <button
                          onClick={() => onRemoveCollaborator(c.id)}
                          className="p-1 border border-stone-300 text-stone-500 hover:text-red-600 hover:border-red-600 transition-colors"
                          title="Revoke access"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Granular Permission Matrix Reference */}
          <div className="p-4 border border-black/15 bg-stone-50 space-y-2">
            <h4 className="font-mono text-[10px] uppercase tracking-widest font-bold text-stone-600">
              Role Permission Boundary Specs
            </h4>
            <div className="grid grid-cols-3 gap-2 font-mono text-[9px]">
              <div className="p-2 border border-black/10 bg-white">
                <span className="font-bold text-black block mb-1">Viewer</span>
                <p className="text-stone-600">Read-only access to telemetry, visualizer, agent stats. Cannot start jobs or edit DNA.</p>
              </div>
              <div className="p-2 border border-black/10 bg-white">
                <span className="font-bold text-black block mb-1">Contributor</span>
                <p className="text-stone-600">Can orchestrate swarm simulations, decompose directives, and allocate skill points.</p>
              </div>
              <div className="p-2 border border-black/10 bg-white">
                <span className="font-bold text-black block mb-1">Admin</span>
                <p className="text-stone-600">Full system governance: authorize succession legacy, invite members, configure workspace.</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
