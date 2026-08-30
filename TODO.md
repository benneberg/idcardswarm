# Civitas AI: Engineering Roadmap & Active Backlog

> **Review Date**: June 8, 2026  
> **System Status**: v3.6 Enterprise Autonomous Swarm Complete (100% Roadmap Implemented & Tested)  
> **Source Documents Synthesized**: `ARCHITECTURE.md`, `DESIGN.md`, `PURPOSE.md`, `INTENT.md`, `AUDIT.md`, `current-state.md`, `security_spec.md`, `TESTING_DELTA.md`, `CORE_FEATURES.md`.

---

## 📋 Active Backlog

*All roadmap tracks and P0–P3 engineering milestones have been fully implemented, verified with 53 automated unit and invariant tests, and deployed to production.*

---

## 📦 Completed Milestones Archive

<details open>
<summary>Click to view completed milestones (Tracks 1, 2, 3, 4, 5, 6 & Phases 1–4)</summary>

### Track 5: Emergent Collective Intelligence & Institutions (Completed)
- [x] **[P3] Autonomous Peer-to-Peer Task Delegation** (`delegationEngine.ts`, `useSwarmManager.ts`, and `SwarmBoard.tsx` with dynamic sub-task decomposition, trust network scoring, and delegation reason badges).
- [x] **[P3] Institutional Culture & Guild Memory Vectors** (`institutionEngine.ts`, `InstitutionGuildsModal.tsx`, aggregate cultural DNA vectors clamped to [0.05, 0.95], and passive capability buffs).
- [x] **[P3] Market-Based Task Bidding & Reputation Currency** (`marketBiddingEngine.ts`, dynamic order book auctions, capability resonance-weighted wagers, and dividend profit settlement).

### Track 3: Multi-User Collaboration & RBAC (Completed)
- [x] **[P3] Workspace Collaborator Invites & RBAC** (`workspaceEngine.ts`, `WorkspaceInviteModal.tsx`, Firestore rules hardening, granular Viewer/Contributor/Admin permission matrix, and simulated role switcher).

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
