# Civitas AI: Technical Architecture & System Specification

> Comprehensive technical specification of the Civitas multi-agent ecosystem, including system topology, component interactions, database schemas, execution lifecycles, mathematical models, and security invariants.

---

## 1. High-Level System Architecture & Topology

Civitas AI implements a **Thin-Server Full-Stack Architecture** designed for high responsiveness, real-time multi-agent observability, and server-side secret isolation:

```
[ Browser / Client: React 19 + Vite 6 + Tailwind v4 + Motion + D3.js ]
        │
        ├── Real-Time Sync & Direct Queries (Firebase Firestore & Firebase Auth)
        │      └── Target: Google Cloud Firestore (Strict Firestore Security Rules Enforced)
        │
        └── HTTP Proxy Requests (Port 3000 /api/swarm/*)
               │
               ▼
    [ Express 4.21 Server Node (Bundled via esbuild to dist/server.cjs) ]
         ├── Sliding Window Rate Limiter (30 req / min per IP, Retry-After header)
         ├── Request Body Sanitization & Size Guardrails (1MB payload cap, length bounds)
         ├── Pino 10 Structured Telemetry & Latency Tracing (X-Response-Time-Ms)
         ├── Server-Authoritative Swarm Execution Tick (/api/swarm/tick)
         └── Google GenAI SDK (@google/genai)
                │
                ▼
         [ Google Gemini API (gemini-2.5-flash / Pro) ]
```

### Architectural Principles
1. **API Key Isolation**: The `GEMINI_API_KEY` is strictly confined to the Node.js runtime (`server.ts` and `src/lib/gemini.ts`). No AI secret credentials are exposed to the browser client.
2. **Decoupled Persistence & Real-Time Reactivity**: The frontend subscribes directly to Firestore collections via snapshot listeners (`onSnapshot`), providing sub-100ms UI reactivity when agents claim or complete tasks.
3. **Atomic Execution Guarantees**: Agent task claiming uses atomic Firestore transactions (`runTransaction`) to prevent multi-tab or concurrent worker collisions.

---

## 2. Component Breakdown

### 2.1 Frontend Client Tier (`src/`)
* **Agent Registry (`src/hooks/useAgentRegistry.ts`, `src/components/AgentCardItem.tsx`)**: Manages the persistence, filtering, and evolution of agent identities. Renders high-precision D3 capability radar charts.
* **Swarm Orchestrator Hook (`src/hooks/useSwarmManager.ts`)**: Drives the job lifecycle, monitors active tasks, computes agent attraction resonance, triggers atomic task claiming, and manages inter-agent relationship updates.
* **Multi-Projection Observatory (`src/components/SwarmVisualizer.tsx`)**:
  - *Force-Directed Network Graph*: Renders real-time D3 physics nodes representing agents, connected by dynamic edges representing trust, conflict, or pheromone trails.
  - *Cluster Emergence Map*: Clusters agents based on role similarity and shared behavioral motives.
  - *Temporal Yield Heatmap*: Plots completed tasks against operational complexity and execution cycles.
  - *Lineage Visualizer (`src/components/LineageVisualizer.tsx`)*: Visualizes multi-generational family trees and mutation drifts.
* **Dynamic Environment Context Engine (`src/lib/socialDynamics.ts`)**: Modulates agent performance and interaction dynamics based on operational stress states (`Innovation Phase`, `Crunch Time`, `Resource Starved`, `High Ambiguity`, `Maintenance Mode`).
* **Shared Workspace Synergy Stream (`src/components/PersonaWorkspaceInteraction.tsx`)**: Simulates asynchronous collaboration and SLA synthesis between contrasting archetypes.

### 2.2 Collective Intelligence & Institutional Tier (`src/lib/`)
* **Autonomous Delegation Engine (`src/lib/delegationEngine.ts`)**: Evaluates whether an agent should delegate a task based on current workload, task complexity, peer trust, and capability resonance.
* **Institutional Guild Engine (`src/lib/institutionEngine.ts`)**: Manages organizational guilds with collective cultural DNA vectors that provide passive capability buffs to affiliated agents.
* **Market Bidding Engine (`src/lib/marketBiddingEngine.ts`)**: Implements an order-book auction mechanism where agents wager reputation currency to claim tasks, collecting dividend yields upon verified completion.
* **Workspace Collaboration Engine (`src/lib/workspaceEngine.ts`)**: Manages workspace membership, email invitations, and RBAC permission checks (`Viewer`, `Contributor`, `Admin`).

### 2.3 Backend Proxy Tier (`server.ts`)
* **AI Task Decomposer (`POST /api/swarm/decompose`)**: Directs Gemini Pro to break down goals into a DAG of typed tasks with dependency graphs and routing tags.
* **AI Task Executor (`POST /api/swarm/execute`)**: Executes individual tasks guided by agent persona, strengths, and behavioral constraints.
* **AI Output Critic (`POST /api/swarm/evaluate`)**: Evaluates artifacts against quality rubrics, assigning numeric scores and actionable feedback.
* **AI Persona Generator (`POST /api/swarm/generate-persona`)**: Procedurally synthesizes balanced persona blueprints from free-form natural language prompts.
* **Swarm Execution Tick (`POST /api/swarm/tick`)**: Server-authoritative coordination verifying dependency satisfaction across tasks.
* **Telemetry & Health (`GET /api/health`)**: Reports uptime, system health, and rate-limiting capacity. Emits structured JSON logs with duration timings.

---

## 3. Domain Data Model & Firestore Schemas

Persistence is structured in Google Cloud Firestore across six primary collections:

### 3.1 `agents/{agentId}`
```typescript
interface AgentCard {
  id: string;
  name: string;
  role: string;
  occupation: string;
  bio: string;
  experience_level: 'junior' | 'mid' | 'senior' | 'staff';
  mode: 'executor' | 'critic' | 'coordinator';
  skills: string[];
  capability_vector: {
    technical_depth: number; // [0.05, 0.95]
    curiosity: number;       // [0.05, 0.95]
    reliability: number;     // [0.05, 0.95]
    adaptability: number;    // [0.05, 0.95]
    creativity: number;      // [0.05, 0.95]
    leadership?: number;     // [0.05, 0.95]
  };
  personality: {
    openness: number;         // 0 - 100
    conscientiousness: number;// 0 - 100
    risk_tolerance: number;   // 0 - 100
    extraversion: number;     // 0 - 100
    agreeableness: number;    // 0 - 100
  };
  reputation: number;        // integer
  trustScore: number;        // [0.0, 1.0]
  level: number;             // integer (1 - 20+)
  exp: number;               // integer
  skill_points: number;      // integer
  lineage: {
    generation: number;      // 1-indexed
    parent_id?: string;
    offspring_count: number;
    mutations: string[];
  };
  behavior_rules: string[];
  userId: string;            // Document owner
  createdAt: Timestamp;      // Immutable serverTimestamp
  updatedAt: Timestamp;      // serverTimestamp
}
```

### 3.2 `jobs/{jobId}`
```typescript
interface SwarmJob {
  id: string;
  goal: string;
  status: 'planning' | 'in_progress' | 'completed' | 'failed';
  selected_agent_ids: string[];
  environment: 'standard' | 'crunch_time' | 'innovation_phase' | 'resource_starved' | 'high_ambiguity' | 'maintenance_mode';
  userId: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 3.3 `jobs/{jobId}/tasks/{taskId}` (Subcollection)
```typescript
interface SwarmTask {
  id: string;
  description: string;
  type: string;
  assigned_agents: string[];
  status: 'pending' | 'running' | 'done' | 'failed';
  dependencies: string[];    // Task IDs that must be 'done' first
  input?: string;
  output?: string;
  critique?: {
    score: number;
    issues: Array<{ severity: string; category: string; description: string; location?: string }>;
    recommendations: string[];
    risk_flags: Array<{ level: string; description: string }>;
  };
  complexity: number;        // 1 - 5
  routing_tags: string[];
  claimedBy?: string;        // Agent ID
  claimedAt?: Timestamp;
  completedAt?: Timestamp;
}
```

### 3.4 `relationships/{relationshipId}`
Deterministic ID: `${min(agentA, agentB)}_${max(agentA, agentB)}`
```typescript
interface AgentRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  trust: number;             // [0.10, 0.90] (mean-reverting to 0.50)
  resonance: number;         // [0.0, 1.0] pheromone attraction weight
  sharedTasksCount: number;
  lastInteraction: Timestamp;
  updatedAt: Timestamp;
  userId: string;
}
```

### 3.5 `institutions/{institutionId}`
```typescript
interface InstitutionGuild {
  id: string;
  name: string;
  archetype: 'engineering_guild' | 'scientific_board' | 'startup_team';
  cultural_vector: Record<string, number>; // [0.05, 0.95]
  member_ids: string[];
  reputationPool: number;
  userId: string;
  createdAt: Timestamp;
}
```

### 3.6 `workspaces/{workspaceId}`
```typescript
interface WorkspaceConfig {
  id: string;
  name: string;
  ownerId: string;
  collaborators: Record<string, 'viewer' | 'contributor' | 'admin'>;
  createdAt: Timestamp;
}
```

---

## 4. Execution Lifecycles & Data Flow

```
[ User defines Goal & Team ]
           │
           ▼
1. POST /api/swarm/decompose
   - Gemini decomposes goal into DAG tasks.
   - Cycle-breaking algorithm removes circular dependencies.
   - Job & tasks written to Firestore.
           │
           ▼
2. Swarm Heartbeat Loop (useSwarmManager / /api/swarm/tick)
   - Evaluates tasks with status == 'pending'.
   - Checks dependency fulfillment: dependencies.every(id => doneIds.has(id)).
           │
           ▼
3. Agent Attraction Scoring & Bidding
   - Computes attraction scores for available agents.
   - Evaluates peer delegation and market wagers.
           │
           ▼
4. Atomic Transactional Claiming
   - db.runTransaction ensures task.status == 'pending' and !task.claimedBy.
   - Sets status = 'running', claimedBy = agent.id.
           │
           ▼
5. Task Execution (POST /api/swarm/execute)
   - Dispatches prompt with agent persona & strengths to Gemini Pro.
           │
           ▼
6. Task Evaluation (POST /api/swarm/evaluate)
   - Critic persona inspects artifact, producing score [0, 1] & critiques.
           │
           ▼
7. Capability & Sociometric Settlement
   - capabilityEngine.ts computes DNA deltas clamped to [0.05, 0.95].
   - XP awarded; level progression checked.
   - Relationships collection updated: trust adjusted, pheromones deposited.
   - Task marked 'done' in Firestore.
```

---

## 5. Mathematical Formulations

### 5.1 Capability DNA Adaptation & Clamping
When an agent completes a task, DNA vectors evolve based on routing tags, task outcome, and environmental modifiers:

$$\Delta = \text{BaseDelta} \times \text{Complexity} \times \text{OutcomeFactor} \times \text{EnvModifier}$$

To guarantee mathematical stability across infinite generations, all traits are strictly clamped:

$$\text{Trait}_{t+1} = \max(0.05, \min(0.95, \text{Trait}_t + \Delta))$$

### 5.2 Agent Attraction Score
The swarm routes tasks to agents by calculating a multidimensional affinity score:

$$\text{Score} = (\text{SkillMatch} \times 0.40) + (\text{TrustScore} \times 0.25) + (\text{HistoricalBond} \times 0.20) + (\text{CapabilityFit} \times 0.15)$$

Where:
* $\text{SkillMatch}$: Jaccard similarity between agent skills and task routing tags.
* $\text{TrustScore}$: Agent's global verified reliability rating.
* $\text{HistoricalBond}$: Pair-wise pheromone resonance between collaborating agents.
* $\text{CapabilityFit}$: Dot-product projection of task required tags against the agent's capability vector.

### 5.3 Asymptotic Trust Decay & Mean-Reversion
In the absence of interaction, inter-agent trust experiences temporal erosion regressing asymptotically toward the neutral $0.50$ baseline:

$$\text{Trust}_{t+1} = \text{Trust}_t - (\text{Trust}_t - 0.50) \times (1 - e^{-\lambda \times \text{cycles}})$$

Where $\lambda = 0.05$. The result is clamped to $[0.10, 0.90]$ to prevent complete relational paralysis or unearned infallibility.

### 5.4 Generational Inheritance (Legacy Protocol)
When an agent spawns an heir, the offspring inherits a weighted blend of the parent's capability vector, system baseline, and stochastic mutation:

$$\text{ChildTrait} = (\text{ParentTrait} \times 0.30) + (\text{Baseline} \times 0.70) \pm \text{RandomMutation}(\pm 0.05)$$

Subject to boundary clamping $\in [0.05, 0.95]$. Offspring generation counter is strictly:

$$\text{Generation}_{\text{child}} = \text{Generation}_{\text{parent}} + 1$$

---

## 6. Security Architecture & Invariants

The application enforces defense-in-depth via Firestore Security Rules (`firestore.rules`) and server-side request sanitization.

### 6.1 Data Invariants
1. **Ownership Enforcement**: Every write operation requires authenticated credentials (`request.auth != null`). Agents, jobs, relationships, and institutions can only be modified by their owning `userId`.
2. **Immutable System Fields**: Client writes cannot tamper with `userId`, `createdAt`, `lineage.generation`, or `parent_id`.
3. **Bound Verification**: All capability vector entries must be numeric values in $[0.0, 1.0]$.
4. **Hierarchical Task Authorization**: Tasks inherit permissions from their parent Job document.
5. **ID Sanitization**: All entity identifiers must match the regex `^[a-zA-Z0-9_\-]+$`.
6. **Timestamp Integrity**: All timestamp fields (`createdAt`, `updatedAt`) are enforced using `request.time`.

### 6.2 The "Dirty Dozen" Threat Mitigation Matrix

| Threat Payload | Attack Description | Enforced Defense | Verified Test |
| :--- | :--- | :--- | :---: |
| **1. Agent Spoofing** | Creating an agent with another user's `userId` | Rule requires `request.resource.data.userId == request.auth.uid` | `SecurityInvariants.test.ts` |
| **2. Infinite Skills** | Creating an agent with 10,000 skills (Denial of Wallet) | Rule caps `skills.size() <= 30` and string lengths $\le 50$ | `SecurityInvariants.test.ts` |
| **3. Job Hijacking** | Updating a job owned by a different user | Rule verifies `resource.data.userId == request.auth.uid` | `SecurityInvariants.test.ts` |
| **4. Task Injection** | Injecting tasks into a foreign job | Rule checks parent job ownership before permitting task write | `SecurityInvariants.test.ts` |
| **5. Score Poisoning** | Setting an evaluation score to $> 1.0$ (e.g. 999) | Rule bounds evaluation scores within $[0.0, 1.0]$ | `SecurityInvariants.test.ts` |
| **6. Ghost Fields** | Adding unauthorized fields like `isAdmin: true` | Strict schema whitelist rejects unexpected document keys | `SecurityInvariants.test.ts` |
| **7. Timestamp Fraud** | Backdating timestamps | Requires `request.resource.data.createdAt == request.time` | `SecurityInvariants.test.ts` |
| **8. ID Poisoning** | Submitting 2KB string IDs | Strict regex `^[a-zA-Z0-9_\-]{1,128}$` bounds ID size | `SecurityInvariants.test.ts` |
| **9. Role Escalation** | Setting agent mode to arbitrary strings | Mode restricted to enum: `executor`, `critic`, `coordinator` | `SecurityInvariants.test.ts` |
| **10. Orphaned Task** | Creating tasks detached from valid jobs | Task path constraint requires nested `/jobs/{jobId}/tasks/{taskId}` | `SecurityInvariants.test.ts` |
| **11. Outcome Bypass** | Modifying tasks after status is `completed` | Rule blocks mutations to terminal tasks | `SecurityInvariants.test.ts` |
| **12. Mass Scraping** | Listing jobs without tenant filter | Query rules require indexed `userId == request.auth.uid` clause | `SecurityInvariants.test.ts` |

---

## 7. Rate Limiting & Quota Resilience

To prevent API quota exhaustion on Google Gemini endpoints, `server.ts` enforces a sliding-window rate limiter:
* **Capacity**: 30 requests per minute per IP.
* **Exhaustion Response**: HTTP 429 Too Many Requests with standard `Retry-After: <seconds>` header.
* **Payload Size Caps**: Goal inputs capped at 4,000 characters; contexts capped at 50,000 characters; team size capped at 50 agents.

---

## 8. Observability & Telemetry

* **Structured Logging**: All backend transactions log JSON payloads via `pino` with pretty terminal colorization in development.
* **Request Tracing**: Every API request receives an ephemeral `requestId` propagated across log lines.
* **Latency Monitoring**: Every completed call computes elapsed duration in milliseconds and attaches an `X-Response-Time-Ms` response header.
* **Health Heartbeat**: `GET /api/health` reports runtime uptime in seconds, system status, and current rate limiter capacity.

---

## 9. Verification & Build Pipeline

The architecture is continuously verified by automated checks:
1. **Type Soundness**: `npm run lint` (`tsc --noEmit`) validates zero type regressions.
2. **Automated Unit & Invariant Suite**: `npm test` runs 53 tests across 8 test suites covering:
   - Capability vector delta calculations and mathematical clamping (`CapabilityEngine.test.ts`)
   - Sociometric bonding, trust decay, and environmental modifiers (`SocialDynamics.test.ts`)
   - Security invariants and Dirty Dozen rejections (`SecurityInvariants.test.ts`)
   - Generational inheritance and mutation drift (`Inheritance.test.ts`)
   - Swarm DAG execution, cycle breaking, and dependency resolution (`SwarmExecution.test.ts`)
   - AI decomposition schema contract validation (`DecomposeSchema.test.ts`)
   - Collective intelligence, peer delegation, and market bidding (`CollectiveIntelligenceAndInstitutions.test.ts`)
   - UI component rendering and event dispatch (`AgentCardItem.test.tsx`)
3. **Production Bundling**: `npm run build` compiles the React frontend to `dist/` and bundles `server.ts` into a self-contained CommonJS binary at `dist/server.cjs` via esbuild.

