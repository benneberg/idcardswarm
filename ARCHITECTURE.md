# Civitas AI: Technical Architecture

## HIGH-LEVEL ARCHITECTURE
Civitas AI utilizes a **Thin-Server Full-Stack Architecture**. 
*   **Frontend**: Primary orchestration logic resides in the React client, which communicates directly with **Firebase Firestore** for state and **Firebase Auth** for identity.
*   **Backend**: A lightweight **Express.js** server acts as an AI Proxy to the **Gemini API** for high-compute reasoning tasks (Task Decomposition, Persona Generation) that require server-side secrets.

**Confidence: High** (Verified via `App.tsx`, `server.ts`, and `package.json`)

---

## COMPONENT BREAKDOWN

### 1. The Registry (Frontend)
*   **Logic**: `agentService.ts` manages Agent lifecycle (Create, Update, Level Up).
*   **Rendering**: `AgentCardItem` and `CapabilityRadar` (D3-powered).
*   **Source of Truth**: Firestore `/agents` collection.

### 2. The Orchestrator (Backend Proxy)
*   **Logic**: `server.ts` exposes `/api/swarm/decompose`.
*   **AI Engine**: `@google/genai` (Gemini-1.5-Flash by default). 
*   **Function**: Converts a text "Goal" into a JSON array of `SwarmTask` objects.

### 3. The Evolutionary Engine (Logic Tier)
*   **Module**: `capabilityEngine.ts`.
*   **Role**: Pure functional math calculating DNA deltas. It ensures that if an agent performs a "Coding" task, its `coding` capability increases relative to task complexity.

### 4. The Real-time Swarm (Data Tier)
*   **Infrastructure**: Firebase Firestore.
*   **Mechanism**: Real-time snapshots (`onSnapshot`) ensure that when an agent's task is updated by the system loop, all monitoring clients see the pulse immediately.

---

## DATA FLOW

1.  **Job Initialization**: User submits a "Job" to Express `/api/swarm/decompose`.
2.  **AI Decomposition**: Gemini returns 3-5 sub-tasks.
3.  **Persistence**: Sub-tasks are written to Firestore as a sub-collection of the Job.
4.  **Execution Loop**: `useSwarmManager.ts` triggers a task heartbeat. The most suitable agent (high capability match) is assigned via atomic Firestore transactions.
5.  **Completion**: Upon success, `capabilityEngine.ts` calculates XP gain and capability deltas. Firestore is updated, triggering a UI refresh via listeners.

**State Management**: Modular. Domain state is encapsulated in custom hooks (`useSwarmManager`, `useAgentRegistry`); Firestore provides the real-time global persistence tier.

---

## EXTERNAL INTEGRATIONS
*   **Google Gemini API**: Heart of the "Intelligence" tier (`@google/genai` with Gemini 2.5 Pro / Flash).
*   **Firebase**: Database (Firestore) and Auth.
*   **Dicebear**: Vector avatar generation for personas.

---

## DEPLOYMENT MODEL
*   **Platform**: Designed for Platform-as-a-Service (Cloud Run / Vercel + Firebase).
*   **Build System**: Vite (Frontend) + esbuild (Backend Server bundle in `dist/server.cjs`). 
*   **Validation**: CI/CD ready via standard `npm run build`, `npm run lint`, and `npx vitest run`.

---

## OBSERVABILITY MODEL
*   **Structured Logging**: `pino` logger with request IDs and pretty transport in `server.ts`.
*   **Health**: `/api/health` endpoint exists (Verified in Recent Audit).
*   **Telemetry Gap**: Latency tracing and response-time percentiles for Gemini API proxies are pending.

---

## ARCHITECTURAL STATUS & RESOLVED RISKS
1.  **Concurrency Hotspots**: [RESOLVED] Task claiming is now executed inside atomic Firestore transactions to prevent multi-tab execution collisions.
2.  **Monolithic Client**: [IMPROVED] Extracted domain logic into `useAgentRegistry` and `useSwarmManager` hooks; client-side execution loop still benefits from eventual migration to server-side task worker.
3.  **Auth Gaps**: [RESOLVED] `relationships` collection rules in `firestore.rules` now strictly enforce that callers own the `sourceId` or `targetId` agents.

---

## REMAINING ARCHITECTURAL TASKS
*   **P0 (Security & Resilience)**: Implement token-bucket / sliding-window rate limiting on `/api/swarm/*` endpoints to guard against API quota exhaustion.
*   **P1 (Autonomous Execution)**: Move global execution tick (`setInterval`) from client `useSwarmManager` to a server-side background task worker / cron endpoint.
*   **P2 (Observability)**: Add duration timing and structured latency metrics to Gemini proxy endpoints in `server.ts`.
*   **P3 (State Architecture)**: Migrate global client state to Zustand if multi-screen cross-component dependencies expand.
