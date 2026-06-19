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
4.  **Execution Loop**: `App.tsx` triggers a task heartbeat. The most suitable agent (high capability match) is assigned.
5.  **Completion**: Upon success, `capabilityEngine.ts` calculates XP gain. Firestore is updated, triggering a UI refresh via listeners.

**State Management**: Mixed. Local React state handles UI toggles; Firestore handles the global system state.

---

## EXTERNAL INTEGRATIONS
*   **Google Gemini API**: Heart of the "Intelligence" tier.
*   **Firebase**: Database (Firestore) and Auth.
*   **Dicebear**: Avatar generation for personas.

---

## DEPLOYMENT MODEL
*   **Platform**: Designed for Platform-as-a-Service (Cloud Run / Vercel + Firebase).
*   **Build System**: Vite (Frontend) + esbuild (Backend Server bundle). 
*   **Validation**: CI/CD ready via standard `npm build` and `npx vitest`.

---

## OBSERVABILITY MODEL
*   **Basic**: `console.log` based structured logs in `server.ts`.
*   **Health**: `/api/health` endpoint exists (Verified in Recent Audit).
*   **Missing**: No centralized error reporting (e.g., Sentry) or performance tracing for Gemini response times.

---

## ARCHITECTURAL RISKS
1.  **Concurrency Hotspots**: Multiple agents updating the same Job object in Firestore. Currently lacks broad usage of `FieldValue.increment()` (uses local math then writes).
2.  **Monolithic Client**: `App.tsx` handles business logic that should be in a separate state worker or server-side cron.
3.  **Auth Gaps**: Relationships collection is currently insufficiently guarded (Identified in Audit).

## RECOMMENDED IMPROVEMENTS
*   **P0**: Secure `relationships` match rules in `firestore.rules`. (In Progress)
*   **P1**: Move global execution tick (`setInterval`) from client to a single server-side task worker to prevent multi-tab collisions.
*   **P2**: Migrate `App.tsx` state to **Zustand** or **Redux** for better observability.
