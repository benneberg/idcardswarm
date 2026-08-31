# Security Policy: Civitas AI

Civitas AI takes system security and multi-tenant isolation seriously. This document defines our security model, access control invariants, and vulnerability reporting procedures.

---

## 🛡️ Security Architecture & Defense-in-Depth

Civitas AI employs a multi-tiered security model designed to defend against unauthorized data access, API quota exhaustion, and state poisoning:

### 1. API Secret Isolation
* **Server-Only Secrets**: The Google Gemini API key (`GEMINI_API_KEY`) is strictly confined to the backend server environment (`server.ts`).
* **Zero Client Exposure**: No sensitive credentials are prefixed with `VITE_` or bundled into client JavaScript.
* **Proxy Architecture**: All AI reasoning, goal decomposition, and artifact evaluations route through authenticated server proxy endpoints (`/api/swarm/*`).

### 2. Abuse Prevention & Rate Limiting
* **Sliding-Window Limiter**: All `/api/swarm/*` endpoints enforce an IP-based sliding window rate limit of 30 requests per minute.
* **HTTP 429 Handling**: Exceeded requests are rejected immediately with a standard `Retry-After` header.
* **Payload Size Sanitization**:
  - Goals capped at 4,000 characters.
  - Context payloads capped at 50,000 characters.
  - Team size capped at 50 agents.
  - JSON body parser restricted to a 1MB maximum envelope.

### 3. Database Security & Access Control (Firestore Rules)
All read and write access to Google Cloud Firestore is governed by hardened security rules (`firestore.rules`):
* **Authentication Requirement**: All write operations strictly require authenticated Firebase credentials (`request.auth != null`).
* **Multi-Tenant Isolation**: Agents, jobs, relationships, institutions, and workspaces enforce `userId == request.auth.uid`. Cross-tenant mutations are categorically denied.
* **Immutable System Fields**: Client writes cannot tamper with audit fields: `userId`, `createdAt`, `lineage.generation`, or `parent_id`.
* **Mathematical Bound Enforcement**: Capability vector traits must be numeric values in $[0.0, 1.0]$. Evaluation scores are strictly bounded within $[0.0, 1.0]$.
* **Role Restrictions**: Agent operational mode is constrained to the enum `['executor', 'critic', 'coordinator']`. Unauthorized escalation to arbitrary roles is denied.
* **Hierarchical Task Authorization**: Tasks inherit permissions from their parent Job document; orphan tasks or tasks detached from owned jobs are rejected.

---

## 🧪 Security Invariant Verification

The system continuously verifies resilience against the **"Dirty Dozen"** attack payloads in `src/test/SecurityInvariants.test.ts`:

1. **Agent Spoofing**: Attempting to create an agent with a forged `userId`.
2. **Infinite Skills**: Denial of Wallet attack via 10,000 skills array.
3. **Job Hijacking**: Mutating a job owned by another authenticated user.
4. **Task Injection**: Injecting unauthorized tasks into another user's job.
5. **Score Poisoning**: Submitting evaluation scores $> 1.0$ (e.g. 999).
6. **Ghost Fields**: Attempting to inject unauthorized administrative keys (e.g. `isAdmin: true`).
7. **Timestamp Fraud**: Tampering with or backdating creation timestamps.
8. **ID Poisoning**: Submitting oversize 2KB entity identifiers.
9. **Role Escalation**: Setting agent mode to arbitrary strings outside the allowed enum.
10. **Orphaned Task**: Creating tasks detached from valid jobs.
11. **Outcome Locking Bypass**: Mutating tasks after their terminal `completed` state.
12. **Mass Scraping**: Querying jobs across tenants without a `userId` filter.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Civitas AI, please report it responsibly:

1. **Do not create a public issue** on GitHub.
2. Email your findings directly to the repository maintainers or security contacts.
3. Include detailed steps to reproduce the issue, including request payloads and observed behavior.
4. We aim to acknowledge receipt within 48 hours and provide a remediation timeline within 5 business days.
