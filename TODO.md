# Civitas AI: Engineering Roadmap & Active Backlog

> **Review Date**: June 8, 2026  
> **System Status**: v3.5 Enterprise Swarm Ready (~99.5% Feature & Stability Complete)  
> **Source Documents Synthesized**: `ARCHITECTURE.md`, `DESIGN.md`, `PURPOSE.md`, `INTENT.md`, `AUDIT.md`, `current-state.md`, `security_spec.md`, `TESTING_DELTA.md`, `CORE_FEATURES.md`.

---

## 📋 Active Backlog

### Track 5: Emergent Collective Intelligence & Institutions
- [ ] **[P3] Autonomous Peer-to-Peer Task Delegation**  
  - **Source**: `current-state.md` (🔴 Autonomous Delegation)  
  - **Impact**: High | **Effort**: Medium  
  - **Specification**: Allow senior/lead agents (`leadership > 0.7`) to decompose sub-tasks and delegate them to peer executor agents based on trust network scores without human orchestrator intervention.  
  - **Acceptance Criteria**: Complex tasks assigned to Lead agents can dynamically spawn sub-tasks assigned to high-affinity peers.

- [ ] **[P3] Institutional Culture & Guild Memory Vectors**  
  - **Source**: `current-state.md` (🔴 Institutional Culture) & `INTENT.md`  
  - **Impact**: Medium | **Effort**: Medium  
  - **Specification**: When agents belong to an institution (e.g., Scientific Review Board), compute an aggregate institutional cultural DNA vector that provides passive buffs or behavioral rules to affiliated members.  
  - **Acceptance Criteria**: Institution members reflect collective cultural priorities in their priority bias and task evaluations.

- [ ] **[P3] Market-Based Task Bidding & Reputation Currency**  
  - **Source**: `current-state.md` (🔴 Market-Based Coordination)  
  - **Impact**: Medium | **Effort**: Large  
  - **Specification**: Implement an internal bidding mechanism where available agents place bids on unassigned swarm tasks based on their capability-role resonance, spending or earning reputation tokens.  
  - **Acceptance Criteria**: Tasks are assigned to the highest-resonance bidder; successful completion yields reputation dividends.

### Track 3 (Future Phase): Multi-User Collaboration
- [ ] **[P3] Workspace Collaborator Invites & RBAC**  
  - **Source**: `DESIGN.md` (Section 2: Workspace Invites & Permissions)  
  - **Impact**: Medium | **Effort**: Large  
  - **Specification**: Support multi-user workspace management where owners invite collaborators via email with granular roles (Viewer, Contributor, Admin).  
  - **Acceptance Criteria**: Firestore rules and UI enforce that Viewers have read-only access while Contributors can orchestrate jobs.

---

## 📦 Completed Milestones Archive

<details open>
<summary>Click to view completed milestones (Tracks 1, 2, 3, 4, 6 & Phases 1–4)</summary>

### Track 1: Production Security & API Quota Hardening (Completed)
- [x] **[P0] Gemini Proxy Rate Limiting & Abuse Guard** (`server.ts` sliding window rate limiter: 30 req/min, 429 Retry-After, payload size sanitization).
- [x] **[P1] Gemini Latency Telemetry & Response Tracing** (`server.ts` Pino structured JSON logging with durationMs, requestId, and model metadata).
- [x] **[P2] Security Specification Invariant Test Runner** (`src/test/SecurityInvariants.test.ts` rejecting all 12 "Dirty Dozen" denial payloads).

### Track 2: Autonomous Swarm Execution & Persistence (Completed)
- [x] **[P1] Server-Authoritative Swarm Execution Worker** (`/api/swarm/tick` endpoint in `server.ts` and authoritative coordination in `useSwarmManager.ts`).
- [x] **[P2] Pheromone-Driven Autonomous Attraction Engine** (Resonance scores in `useSwarmManager.ts` incorporating prior collaboration pheromones).
- [x] **[P2] Mathematical Trust Erosion & Temporal Decay Model** (Asymptotic regression toward 0.5 baseline for idle bonds in `useSwarmManager.ts`).

### Track 3: Direct Sharing, Export & Persona Workspaces (Completed)
- [x] **[P1] 1-Click DNA Blueprint Export & Import** (Export JSON in `AgentCardItem.tsx` and import in `BlueprintImportModal.tsx`).
- [x] **[P2] Public Showcase Profile (idCard Deep-Link Modal)** (`AgentShowcaseModal.tsx` with radar chart, career stats, and deep linking in `App.tsx`).
- [x] **[P3] Shared Archetype Community Library** (`ArchetypeSelector.tsx` featuring System Blueprints, Community Guilds, and 1-click workspace deployment).

### Track 4: Agent Lineage, Feedback & Advanced Discovery (Completed)
- [x] **[P1] Interactive Lineage Tree & Genealogy Visualizer** (`LineageVisualizer.tsx` and 4th view mode in `SwarmVisualizer.tsx`).
- [x] **[P1] Human-in-the-Loop Task Feedback & Rating Loop** (`handleRateTask` in `useSwarmManager.ts` and rating controls in `SwarmBoard.tsx`).
- [x] **[P2] Swarm Collections & Capability Threshold Filtering** (Dynamic capability sliders and tag filters in `App.tsx`).
- [x] **[P2] AI-Assisted Procedural Persona Generation** (`/api/swarm/generate-persona` and prompt synthesis in `PersonaCreator.tsx`).

### Track 6: Testing & Continuous Quality Assurance (Completed)
- [x] **[P1] Inheritance Math Unit Test Suite** (`src/test/Inheritance.test.ts` validating 30% DNA inheritance and mutation clamping).
- [x] **[P1] Job Decomposition API Schema Test** (`src/test/DecomposeSchema.test.ts` contract tests).
- [x] **[P2] Automated CI/CD Pipeline Configuration** (`.github/workflows/ci.yml` running lint, build, and vitest).
- [x] **[P2] Swarm Execution & Pheromone Test Suite** (`src/test/SwarmExecution.test.ts` validating trust decay, pheromone attraction, and lineage DAGs).

### Phases 1–4 Foundation (Completed)
- [x] **[server.ts]** Add `/api/health` observability endpoint.  
- [x] **[firestore.rules]** Harden `relationships` collection authorization.  
- [x] **[src/lib/agentService.ts]** Use `serverTimestamp()` for all date fields.  
- [x] **[src/lib]** Move all Gemini initialization to `gemini.ts` singleton.  
- [x] **[src/test]** Implement `CapabilityEngine.test.ts`.  
- [x] **[src/App.tsx]** Refactor `runExecutionLoop` to prevent client-side race conditions using Firestore transactions.  
- [x] **[src/App.tsx]** Modularize monolith into custom hooks (`useAgentRegistry`, `useSwarmManager`).  
- [x] **[server.ts]** Implement structured logging (Pino).  
- [x] **[Sociometric Graph]** Complete the interactive trust network visualizer.  
- [x] **[Environmental Factors System]** Implement dynamic environmental context engine.  
- [x] **[Swarm Visualization Concept & Manager Insights]** Integrated 4-projection visualizer (force-directed network, cluster map, yield heatmap, genealogy tree).  
- [x] **[Shared Workspace Interaction Model]** Built collaborative interaction simulator.  
- [x] **[Young Adult Mobile Productivity Persona]** Created detailed persona spotlight for Zoe Rivera.

</details>
