import { describe, it, expect } from 'vitest';

/**
 * Security Invariant Checker that models the Firestore Security Rules
 * and API input validation rules defined in SECURITY.md and ARCHITECTURE.md.
 */
interface SecurityContext {
  auth?: { uid: string };
  time: number;
}

interface ValidationResult {
  allowed: boolean;
  reason?: string;
}

const ALLOWED_AGENT_MODES = new Set(['executor', 'critic', 'simulator']);
const MAX_SKILLS_COUNT = 50;
const MAX_ID_LENGTH = 128;
const ID_REGEX = /^[a-zA-Z0-9_\-]+$/;

function validateAgentWrite(doc: any, ctx: SecurityContext, isCreate = false): ValidationResult {
  if (!ctx.auth?.uid) return { allowed: false, reason: 'Unauthenticated' };
  
  // 1. Agent Spoofing
  if (doc.ownerId !== ctx.auth.uid) {
    return { allowed: false, reason: 'Agent Spoofing: ownerId must match authenticated user' };
  }

  // 8. ID Poisoning
  if (doc.id && (!ID_REGEX.test(doc.id) || doc.id.length > MAX_ID_LENGTH)) {
    return { allowed: false, reason: 'ID Poisoning: ID invalid or exceeds maximum length' };
  }

  // 6. Ghost Fields
  const allowedKeys = new Set([
    'id', 'role', 'mode', 'skills', 'experience_level', 'behavior_rules',
    'capability_vector', 'ownerId', 'version', 'persona_metadata',
    'level', 'exp', 'reputation', 'trustScore', 'createdAt', 'updatedAt', 'lineage'
  ]);
  for (const key of Object.keys(doc)) {
    if (!allowedKeys.has(key)) {
      return { allowed: false, reason: `Ghost Field: Unauthorized field "${key}" detected` };
    }
  }

  // 9. Role Escalation
  if (!ALLOWED_AGENT_MODES.has(doc.mode)) {
    return { allowed: false, reason: `Role Escalation: Mode "${doc.mode}" is not an allowed enum` };
  }

  // 2. Infinite Skills
  if (Array.isArray(doc.skills) && doc.skills.length > MAX_SKILLS_COUNT) {
    return { allowed: false, reason: 'Infinite Skills: Skills array exceeds limit' };
  }

  // 7. Timestamp Fraud
  if (isCreate && doc.createdAt && typeof doc.createdAt === 'number') {
    if (Math.abs(doc.createdAt - ctx.time) > 60000) {
      return { allowed: false, reason: 'Timestamp Fraud: Created timestamp diverges from request time' };
    }
  }

  return { allowed: true };
}

function validateJobUpdate(currentJob: any, updateData: any, ctx: SecurityContext): ValidationResult {
  if (!ctx.auth?.uid) return { allowed: false, reason: 'Unauthenticated' };

  // 3. Job Hijacking
  if (currentJob.userId !== ctx.auth.uid) {
    return { allowed: false, reason: 'Job Hijacking: Target job is owned by another user' };
  }

  // 11. Outcome Locking Bypass
  if (currentJob.status === 'completed' && updateData.goal) {
    return { allowed: false, reason: 'Outcome Locking: Cannot mutate completed job goal' };
  }

  return { allowed: true };
}

function validateTaskCreate(parentJob: any, taskDoc: any, ctx: SecurityContext): ValidationResult {
  if (!ctx.auth?.uid) return { allowed: false, reason: 'Unauthenticated' };

  // 10. Orphaned Task
  if (!parentJob) {
    return { allowed: false, reason: 'Orphaned Task: Parent job does not exist' };
  }

  // 4. Task Injection
  if (parentJob.userId !== ctx.auth.uid) {
    return { allowed: false, reason: 'Task Injection: Cannot create task under another user\'s job' };
  }

  return { allowed: true };
}

function validateEvaluationWrite(evalDoc: any): ValidationResult {
  // 5. Score Poisoning
  if (typeof evalDoc.score !== 'number' || evalDoc.score < 0 || evalDoc.score > 1.0) {
    return { allowed: false, reason: 'Score Poisoning: Evaluation score must be between 0.0 and 1.0' };
  }
  return { allowed: true };
}

function validateJobListQuery(queryParams: Record<string, any>, ctx: SecurityContext): ValidationResult {
  // 12. Mass Scrape
  if (!queryParams.userId || queryParams.userId !== ctx.auth?.uid) {
    return { allowed: false, reason: 'Mass Scrape: List query must filter by current user ID' };
  }
  return { allowed: true };
}

describe('Security Invariants & The Dirty Dozen Denial Suite', () => {
  const aliceUid = 'alice_uid_1001';
  const bobUid = 'bob_uid_2002';
  const now = Date.now();
  const aliceContext: SecurityContext = { auth: { uid: aliceUid }, time: now };

  it('1. Agent Spoofing: should deny agent creation with spoofed ownerId', () => {
    const payload = {
      role: 'Staff Engineer',
      mode: 'executor',
      skills: ['TypeScript'],
      ownerId: bobUid // Alice claiming Bob's ID
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Agent Spoofing');
  });

  it('2. Infinite Skills: should deny agent creation with excessive skills array', () => {
    const payload = {
      role: 'Staff Engineer',
      mode: 'executor',
      skills: new Array(500).fill('Skill'),
      ownerId: aliceUid
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Infinite Skills');
  });

  it('3. Job Hijacking: should deny modifying a job owned by another user', () => {
    const bobJob = { id: 'job_456', userId: bobUid, status: 'planning', goal: 'Build system' };
    const res = validateJobUpdate(bobJob, { status: 'executing' }, aliceContext);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Job Hijacking');
  });

  it('4. Task Injection: should deny creating a task under a job owned by another user', () => {
    const bobJob = { id: 'job_456', userId: bobUid, status: 'planning' };
    const taskPayload = { id: 'task_injection', description: 'Malicious task' };
    const res = validateTaskCreate(bobJob, taskPayload, aliceContext);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Task Injection');
  });

  it('5. Score Poisoning: should deny evaluation scores exceeding maximum bounds', () => {
    const poisonedEval = { score: 999, recommendations: [] };
    const res = validateEvaluationWrite(poisonedEval);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Score Poisoning');
  });

  it('6. Ghost Fields: should deny documents with injected unauthorized fields', () => {
    const payload = {
      role: 'Staff Engineer',
      mode: 'executor',
      skills: ['TypeScript'],
      ownerId: aliceUid,
      isAdmin: true // Injected ghost field
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Ghost Field');
  });

  it('7. Timestamp Fraud: should deny created timestamps deviating from request time', () => {
    const payload = {
      role: 'Staff Engineer',
      mode: 'executor',
      skills: ['TypeScript'],
      ownerId: aliceUid,
      createdAt: now - (365 * 24 * 60 * 60 * 1000) // 1 year ago
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Timestamp Fraud');
  });

  it('8. ID Poisoning: should deny oversized or malformed agent identifiers', () => {
    const payload = {
      id: 'a'.repeat(2048), // 2KB ID
      role: 'Staff Engineer',
      mode: 'executor',
      skills: ['TypeScript'],
      ownerId: aliceUid
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('ID Poisoning');
  });

  it('9. Role Escalation: should deny unauthorized mode escalations', () => {
    const payload = {
      role: 'Staff Engineer',
      mode: 'admin', // Not in ['executor', 'critic', 'simulator']
      skills: ['TypeScript'],
      ownerId: aliceUid
    };
    const res = validateAgentWrite(payload, aliceContext, true);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Role Escalation');
  });

  it('10. Orphaned Task: should deny task creation for nonexistent jobs', () => {
    const res = validateTaskCreate(null, { id: 'task_01' }, aliceContext);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Orphaned Task');
  });

  it('11. Outcome Locking Bypass: should deny mutating goals on completed jobs', () => {
    const completedJob = { id: 'job_done', userId: aliceUid, status: 'completed', goal: 'Initial Goal' };
    const res = validateJobUpdate(completedJob, { goal: 'Rewritten Goal' }, aliceContext);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Outcome Locking');
  });

  it('12. Mass Scrape: should deny queries attempting to list across tenant boundaries', () => {
    const res = validateJobListQuery({}, aliceContext);
    expect(res.allowed).toBe(false);
    expect(res.reason).toContain('Mass Scrape');
  });
});
