# Civitas AI: Engineering Roadmap & Active Backlog

> **Review Date**: June 8, 2026  
> **System Status**: v3.0 Transformation (~98% Core Maturity)  
> **Source Documents Synthesized**: `ARCHITECTURE.md`, `DESIGN.md`, `PURPOSE.md`, `INTENT.md`, `AUDIT.md`, `current-state.md`, `security_spec.md`, `TESTING_DELTA.md`, `CORE_FEATURES.md`.

---

## 📋 Active Uncompleted Task List

### Track 1: Production Security & API Quota Hardening
- [ ] **[P0] Gemini Proxy Rate Limiting & Abuse Guard**  
  - **Source**: `AUDIT.md` (Top Risk: API Quota Exhaustion) & `ARCHITECTURE.md` (P0)  
  - **Impact**: Critical | **Effort**: Small  
  - **Specification**: Implement rate-limiting middleware (sliding window / token bucket, 30 req/min per IP) and payload size sanitization on `/api/swarm/decompose`, `/api/swarm/execute`, and `/api/swarm/evaluate` in `server.ts` to prevent quota exhaustion.  
  - **Acceptance Criteria**: Exceeded limits return HTTP 429 with `Retry-After`; malformed or oversized payloads return HTTP 400.

- [ ] **[P1] Gemini Latency Telemetry & Response Tracing**  
  - **Source**: `ARCHITECTURE.md` (Observability Model) & `AUDIT.md`  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Add duration timing (`performance.now()`) to all AI endpoints in `server.ts`. Log execution latency, token counts, model tier, and status in Pino structured logs.  
  - **Acceptance Criteria**: Every `/api/swarm/*` response logs a structured JSON entry with `durationMs`, `requestId`, `status`, and model metadata.

- [ ] **[P2] Security Specification Invariant Test Runner**  
  - **Source**: `security_spec.md` ("Dirty Dozen" Denial Payloads)  
  - **Impact**: High | **Effort**: Medium  
  - **Specification**: Create unit test suite validating the 12 security payloads from `security_spec.md` (agent spoofing, 10k skills wallet denial, job hijacking, task injection, score poisoning, timestamp fraud, ghost fields, role escalation).  
  - **Acceptance Criteria**: Automated test runner confirms all 12 dirty payloads are rejected by authorization invariants.

---

### Track 2: Autonomous Swarm Execution & Persistence
- [ ] **[P1] Server-Authoritative Swarm Execution Worker**  
  - **Source**: `ARCHITECTURE.md` (P1) & `AUDIT.md` (Client-Side Orchestration Loop)  
  - **Impact**: High | **Effort**: Medium  
  - **Specification**: Complement the client-side `setInterval` in `useSwarmManager.ts` with a dedicated server-side tick endpoint or background worker (`/api/swarm/tick`) in `server.ts` so swarm jobs advance autonomously when no browser tab is active.  
  - **Acceptance Criteria**: Jobs progress through pending tasks via server worker; Firestore transactions guarantee zero duplicate task claiming.

- [ ] **[P2] Pheromone-Driven Autonomous Attraction Engine**  
  - **Source**: `current-state.md` (🟡 Pheromone Dynamics)  
  - **Impact**: Medium | **Effort**: Medium  
  - **Specification**: Transition pheromone signals from visual rendering into an active task assignment heuristic. Agents with high shared pheromone density from prior collaborative tasks receive a resonance multiplier when bidding for related tasks.  
  - **Acceptance Criteria**: Task assignment algorithm in `useSwarmManager.ts` incorporates pheromone link weights into agent resonance scores.

- [ ] **[P2] Mathematical Trust Erosion & Temporal Decay Model**  
  - **Source**: `current-state.md` (🟡 Trust Decay)  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Implement an exponential or linear decay function where inactive relationship bonds decay toward baseline (0.5) over idle job cycles or elapsed days without joint execution.  
  - **Acceptance Criteria**: Relationship trust scores gradually regress toward 0.5 per inactive cycle, bounded within [0.1, 0.9].

---

### Track 3: Direct Sharing, Export & Persona Workspaces
- [ ] **[P1] 1-Click DNA Blueprint Export & Import**  
  - **Source**: `DESIGN.md` (Section 2: Direct Agent Sharing)  
  - **Impact**: High | **Effort**: Small  
  - **Specification**: Add an "Export Blueprint" button on `AgentCardItem` that downloads a JSON schema of the agent's capability vector, personality matrix, and rules. Add an "Import Blueprint" modal in the registry to hydrate an agent card into the workspace.  
  - **Acceptance Criteria**: Exported JSON can be re-imported into another workspace or session with intact capability vectors and lineage metadata.

- [ ] **[P2] Public Showcase Profile (idCard Deep-Link Modal)**  
  - **Source**: `DESIGN.md` (Section 2: Direct Agent Sharing)  
  - **Impact**: Medium | **Effort**: Medium  
  - **Specification**: Implement a dedicated showcase view/modal for individual agent idCards showcasing their D3 capability radar, career stats, and lineage history with a copyable share link.  
  - **Acceptance Criteria**: Clicking "Share idCard" generates a formatted showcase view with a copyable URL / modal presentation.

- [ ] **[P3] Workspace Collaborator Invites & RBAC**  
  - **Source**: `DESIGN.md` (Section 2: Workspace Invites & Permissions)  
  - **Impact**: Medium | **Effort**: Large  
  - **Specification**: Support multi-user workspace management where owners invite collaborators via email with granular roles (Viewer, Contributor, Admin).  
  - **Acceptance Criteria**: Firestore rules and UI enforce that Viewers have read-only access while Contributors can orchestrate jobs.

- [ ] **[P3] Shared Archetype Community Library**  
  - **Source**: `DESIGN.md` (Section 2: Shared Repositories)  
  - **Impact**: Low | **Effort**: Medium  
  - **Specification**: Allow users to publish custom agent archetypes to a shared global repository, allowing other users to browse and clone them into their local workspace.  
  - **Acceptance Criteria**: "Publish to Library" option on agent card; public library browser tab in `ArchetypeSelector`.

---

### Track 4: Agent Lineage, Feedback & Advanced Discovery
- [ ] **[P1] Interactive Lineage Tree & Genealogy Visualizer**  
  - **Source**: `DESIGN.md` (Section 3: Lineage Mapping) & `current-state.md` (Lineage Tracking)  
  - **Impact**: High | **Effort**: Medium  
  - **Specification**: Build a dedicated interactive tree visualizer displaying multi-generational genealogies, tracing parent-to-offspring relationships (`parentId`, `generation`) and mutation deltas.  
  - **Acceptance Criteria**: Users can expand and pan an ancestry tree showing inherited traits and generational mutations across the ecosystem.

- [ ] **[P1] Human-in-the-Loop Task Feedback & Rating Loop**  
  - **Source**: `DESIGN.md` (Section 3: Interaction & Feedback) & `PURPOSE.md` (Autonomous Feedback Loop)  
  - **Impact**: High | **Effort**: Small  
  - **Specification**: Provide Upvote / Downvote and rating controls on completed swarm task outputs. User feedback writes directly to the executing agent's `reputation`, `trustScore`, and `exp` via Firestore transaction.  
  - **Acceptance Criteria**: Rating a task output immediately mutates the agent's reputation history and updates their trust score in real-time.

- [ ] **[P2] Swarm Collections & Capability Threshold Filtering**  
  - **Source**: `DESIGN.md` (Section 3: Swarm Collections)  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Enable users to create named swarm collections ("Dev Swarm", "Security Guild") and assign agents. Add dynamic multi-axis range slider filters to filter agents by minimum capability thresholds (e.g., `Coding > 75`).  
  - **Acceptance Criteria**: Filter toolbar allows filtering by collection tag and dynamic capability score thresholds.

- [ ] **[P2] AI-Assisted Procedural Persona Generation**  
  - **Source**: `DESIGN.md` (Section 3: Procedural Generation)  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Add a "Generate with AI" prompt field in `PersonaCreator.tsx`. Given a brief description (e.g., "Senior DevOps SRE with high incident resilience"), call the Gemini proxy to auto-populate all capability vectors, OCEAN traits, bio, and rules.  
  - **Acceptance Criteria**: Clicking "Generate with AI" auto-populates the 4-step form with balanced, coherent persona attributes.

---

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

---

### Track 6: Testing & Continuous Quality Assurance
- [ ] **[P1] Inheritance Math Unit Test Suite**  
  - **Source**: `TESTING_DELTA.md` (Recommended Test Case 1)  
  - **Impact**: High | **Effort**: Small  
  - **Specification**: Implement unit tests in `src/test/Inheritance.test.ts` validating `spawnOffspring` in `agentService.ts` to ensure heirs inherit 30% parent capability DNA with controlled mutations bounded in [0.05, 0.95].  
  - **Acceptance Criteria**: `npx vitest run` passes with 100% assertions on inheritance math and bounds.

- [ ] **[P1] Job Decomposition API Schema Test**  
  - **Source**: `TESTING_DELTA.md` (Recommended Test Case 2)  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Implement automated schema validation tests validating the `/api/swarm/decompose` mock output contract against the `SwarmTask` interface.  
  - **Acceptance Criteria**: Contract test validates required fields (`id`, `description`, `type`, `dependencies`, `routing_tags`, `assigned_agents`).

- [ ] **[P2] Automated CI/CD Pipeline Configuration**  
  - **Source**: `AUDIT.md` (CI/CD Review)  
  - **Impact**: Medium | **Effort**: Small  
  - **Specification**: Add `.github/workflows/ci.yml` executing `npm run lint`, `npm run build`, and `npx vitest run` on push and pull requests.  
  - **Acceptance Criteria**: Workflow file is syntactically valid and executes all validation steps cleanly.

---

## 📦 Completed Milestones Archive

<details>
<summary>Click to view completed milestones from Phases 1–4</summary>

### Phase 1 — Stability & Infrastructure (Completed)
- [x] **[server.ts]** Add `/api/health` observability endpoint.  
- [x] **[firestore.rules]** Harden `relationships` collection authorization.  
- [x] **[src/lib/agentService.ts]** Use `serverTimestamp()` for all date fields.  

### Phase 2 — Logic & Testing (Completed)
- [x] **[src/lib]** Move all Gemini initialization to `gemini.ts` singleton.  
- [x] **[src/test]** Implement `CapabilityEngine.test.ts`.  
- [x] **[src/App.tsx]** Refactor `runExecutionLoop` to prevent client-side race conditions using Firestore transactions.  

### Phase 3 — Modularity & Scale (Completed)
- [x] **[src/App.tsx]** Modularize monolith into custom hooks (`useAgentRegistry`, `useSwarmManager`).  
- [x] **[server.ts]** Implement structured logging (Pino).  

### Phase 4 — Swarm Dynamics & Ecosystem (Completed)
- [x] **[Sociometric Graph]** Complete the interactive trust network visualizer.  
- [x] **[Environmental Factors System]** Implement dynamic environmental context engine (`SwarmEnvironment`: Crunch Time, Innovation Phase, Resource Starved, High Ambiguity, Maintenance Mode).  
- [x] **[Swarm Visualization Concept & Manager Insights]** Integrated 3-projection visualizer (force-directed network, cluster map, yield heatmap).  
- [x] **[Shared Workspace Interaction Model]** Built collaborative interaction simulator between 'Busy Professional' (Maya Vance) & 'Creative Freelancer' (Julian Rivers).  
- [x] **[Young Adult Mobile Productivity Persona]** Created detailed persona spotlight for Zoe Rivera (Growth PM & Mobile Productivity Enthusiast).  

</details>
