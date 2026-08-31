# Civitas AI: Agentic Architecture & Coding Context

> High-density architectural and operational reference for AI coding agents modifying this repository.

---

## 1. Project Overview & Tech Stack
* **Repository**: Civitas AI — Persona Swarm Registry & Autonomous Ecosystem.
* **Frontend**: React 19, TypeScript 5.8, Vite 6, Tailwind CSS 4, Motion (`motion/react`), D3.js v7.
* **Backend**: Express 4.21, `@google/genai` (Gemini-2.5-flash / Pro), Pino 10, tsx (dev), esbuild (production bundle).
* **Data & Auth**: Firebase Firestore & Firebase Auth.

---

## 2. Hard Infrastructure & Architectural Constraints
1. **Port & Host**: The server binds exclusively to `0.0.0.0:3000`. Port 3000 is hardcoded by container infrastructure and must never be altered.
2. **Full-Stack Vite Integration**: `server.ts` is the single entry point. In development, it mounts Vite middleware (`middlewareMode: true`). In production, it serves `dist/` and runs API routes.
3. **Secret Isolation**:
   - `GEMINI_API_KEY` is server-only. Never expose it with a `VITE_` prefix or import `@google/genai` in `src/`.
   - Client access to AI models must proxy through `/api/swarm/*` endpoints.
4. **Data Concurrency**:
   - Task claiming must execute inside atomic Firestore transactions (`runTransaction`) to prevent multi-client race conditions.
5. **Mathematical Invariants**:
   - Capability vector dimensions must strictly clamp within $[0.05, 0.95]$.
   - Trust ratings clamp within $[0.10, 0.90]$ with asymptotic decay toward $0.50$.
   - Generational inheritance follows: `(parent * 0.30) + (baseline * 0.70) +/- mutation(0.05)`.

---

## 3. Directory Layout & Key Modules
```
├── server.ts                       # Backend entry point, rate limiting, telemetry, AI proxy
├── src/
│   ├── App.tsx                     # Main dashboard container & view switcher
│   ├── types.ts                    # Canonical TypeScript interfaces (AgentCard, SwarmJob, SwarmTask, etc.)
│   ├── components/
│   │   ├── SwarmBoard.tsx          # Job orchestration, task heartbeat, peer delegation
│   │   ├── SwarmVisualizer.tsx     # D3 force graph, cluster map, yield heatmap, lineage tree
│   │   ├── AgentCardItem.tsx       # Agent card UI, radar chart, blueprint export
│   │   ├── CapabilityRadar.tsx     # D3 SVG radar chart for capability vectors
│   │   ├── LineageVisualizer.tsx   # Generational tree and ancestral drift visualizer
│   │   ├── InstitutionGuildsModal.tsx # Guild creation, cultural vectors, member buffs
│   │   └── WorkspaceInviteModal.tsx   # Workspace invites and RBAC role switcher
│   ├── hooks/
│   │   ├── useAgentRegistry.ts     # CRUD and Firestore listener for agents collection
│   │   └── useSwarmManager.ts      # Active job state, task DAG execution, attraction math
│   └── lib/
│       ├── gemini.ts               # Gemini client singleton
│       ├── capabilityEngine.ts     # Pure functional math for DNA adaptation and bounds
│       ├── socialDynamics.ts       # Bonding chance, trust decay, environmental stress
│       ├── delegationEngine.ts     # Autonomous peer delegation logic
│       ├── institutionEngine.ts    # Guild memory and cultural vector calculations
│       ├── marketBiddingEngine.ts  # Reputation currency bidding and auction settlement
│       └── workspaceEngine.ts      # Workspace membership and permission checks
└── src/test/                       # Vitest test suites (53 tests)
```

---

## 4. Verification Workflow
Always run verification checks after making code changes:
1. **Type Soundness**: `npm run lint` (`tsc --noEmit`)
2. **Test Suite**: `npm test` (`vitest run`)
3. **Production Build**: `npm run build` (`vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs`)
