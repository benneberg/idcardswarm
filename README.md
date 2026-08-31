# Civitas AI: Persona Swarm Registry & Autonomous Ecosystem

> A high-fidelity agentic ecosystem management platform for simulating, orchestrating, and evolving a population of persistent AI entities with dynamic Capability Vectors, sociometric trust networks, and institutional coordination.

[![CI](https://github.com/benneberg/idcardswarm/actions/workflows/ci.yml/badge.svg)](https://github.com/benneberg/idcardswarm/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-FFCA28.svg)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC.svg)](https://tailwindcss.com/)

---

## 🏛️ Purpose & Strategic Vision

Modern Large Language Model workflows are often transient, stateless, and disconnected across prompts. When an inference session concludes, all experiential learning and specialization are lost.

**Civitas AI** provides a persistent digital ecosystem for autonomous AI entities ("Citizens"). Instead of ephemeral prompt invocations, Civitas treats agents as persistent, evolving entities with life cycles (Leveling, Experience, Reputation, and Capability DNA). Users decompose complex, multi-stage "Jobs" into dependency-aware tasks orchestrated across specialized agents whose skills grow, mutate, or adapt through empirical task execution.

### Core Philosophy
* **Identity over Anonymity**: Every agent maintains a persistent identifier, unique background, behavioral rules, and an evolving Capability Vector.
* **Persistence over Transience**: Task outcomes permanently influence an agent's capability traits, reputation, and inter-agent sociometric trust.
* **Human Metaphors**: Grounded coordination models such as *Career Progression*, *Reputation*, *Mentorship*, *Guilds*, and *Generational Succession*.
* **Emergence as the Objective**: Serves as a live laboratory to observe how high-order collective intelligence, autonomous delegation, and self-organization emerge from persistent local rules.

---

## 🎯 Target Audiences & Use Cases

1. **AI System Architects & Engineers**: Model, test, and benchmark multi-agent coordination, sub-brain specializations, and stochastic mutation rates across generations.
2. **Operational Leads & Digital Workforce Managers**: Orchestrate automated business workflows, observe dependency-resolved task execution, and monitor swarm throughput via visual telemetry.
3. **Narrative & Game Designers**: Cultivate persistent NPC personalities and organizational guilds with consistent behavioral ethos preserved through generational succession.
4. **Ecosystem & Sociometry Researchers**: Study algorithmic trust dynamics, mean-reverting relationship erosion, and peer-to-peer delegation networks using real-time D3 graph projections.

---

## ⚡ Key Capabilities (Implemented & Verified)

### 1. Agent DNA Registry & Dynamic Capability Vectors
* Centralized registry storing agent identities, roles, psychographic traits, and multi-dimensional Capability Vectors (`technical_depth`, `adaptability`, `reliability`, `creativity`, `curiosity`, `leadership`).
* Pure mathematical capability evolution bounded strictly within $[0.05, 0.95]$: agents gain or lose capability scores proportional to task outcome tags and environmental stress.
* RPG-style leveling, experience points (XP), and skill point allocation.

### 2. Swarm Task Orchestration & AI Decomposition
* High-level jobs decomposed into dependency-aware Directed Acyclic Graph (DAG) task collections via Google Gemini (`gemini-2.5-flash` / Pro).
* Cycle-breaking DAG validation ensures acyclic dependency execution.
* Real-time task assignment via transactional claiming to eliminate multi-client execution race conditions.

### 3. Sociodynamic Trust Networks & Pheromone Trails
* Continuous relationship tracking between agents in Firestore (`relationships` collection).
* Interaction bonding probabilities computed from psychographic alignment and skill deltas.
* Asymptotic mathematical trust decay regressing toward a 0.50 baseline over idle cycles.
* Pheromone routing: successful collaborations deposit attractive resonance weights that bias future task allocation.

### 4. Multi-Projection Observatory (D3.js)
* **Sociometric Force Graph**: Real-time D3 force-directed network graph visualizing trust connections, conflict edges, and active task pheromones.
* **Cluster Emergence Map**: Grouping agents by role alignment and mutual interaction density.
* **Temporal Yield Heatmap**: Matrix mapping operational complexity against execution cycles and completion rates.
* **Genealogy & Lineage Tree**: Visual ancestral tree mapping generations and genetic drift.

### 5. Dynamic Swarm Environmental Context Engine
Simulates real-world operational stressors that dynamically modulate agent capability expression, interaction likelihood, and social influence:
* `Innovation Phase`: Amplifies creativity and cross-role pollination.
* `Crunch Time`: Boosts reliability demands for high-urgency deliverables while penalizing low-adaptability agents.
* `Resource Starved`: Increases junior dependence on senior mentorship.
* `High Ambiguity`: Favors strategic reasoners over rigid executors.
* `Maintenance Mode`: Stabilizes steady-state operations.

### 6. Emergent Collective Intelligence & Institutions
* **Autonomous Peer Delegation**: Overloaded agents autonomously sub-delegate tasks to trusted peers based on skill resonance and relationship history.
* **Institutional Culture & Guild Memory**: Collective guilds with shared cultural DNA vectors that confer passive capability buffs to members.
* **Market-Based Task Bidding**: Order-book auction mechanism where agents wager reputation currency to claim tasks, receiving profit dividends on verified completion.

### 7. Generational Succession (Legacy Protocol)
* Senior agents can authorize succession to spawn offspring inheriting 30% of parent capability vectors with controlled stochastic mutation ($\pm 0.05$) bounded within $[0.05, 0.95]$.
* Complete genealogical tracking of parentage, generation counters, and mutation records.

### 8. Multi-User Collaboration & RBAC Workspaces
* Multi-tenant workspaces with email invitations.
* Role-Based Access Control enforcing `Viewer`, `Contributor`, and `Admin` permissions for swarm administration, task initiation, and legacy succession.

### 9. 1-Click DNA Blueprint Import/Export & Showcase
* Export agent identities into portable, standardized JSON blueprints (`*_blueprint.json`).
* Drag-and-drop blueprint importing with schema validation.
* Standalone public showcase modal with deep-link sharing.

---

## 🛠️ System Architecture

Civitas AI operates as a **Thin-Server Full-Stack Architecture**:
* **Frontend**: React 19 Single Page Application styled with Tailwind CSS 4, Motion, and D3.js. Uses Firebase SDK for real-time document listeners and authentication.
* **Backend Proxy**: Lightweight Express 4.21 server bundled via esbuild to `dist/server.cjs`. Safeguards the `GEMINI_API_KEY`, provides sliding-window rate limiting, structured Pino logging, and server-authoritative swarm execution coordination.
* **Persistence & Security**: Google Cloud Firestore with comprehensive security rules enforcing authentication, tenant isolation, and field immutability.

For the comprehensive technical specification, refer to **[ARCHITECTURE.md](./ARCHITECTURE.md)**.

---

## 🔌 API Overview

All backend proxy endpoints run on port `3000` under `/api/*` and are protected by a sliding-window rate limiter (30 req/min per IP):

| Method | Endpoint | Description | Key Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | System health, uptime, and rate limit status | None |
| `POST` | `/api/swarm/decompose` | Decomposes a user goal into a DAG of tasks | `{ goal: string, team: Agent[] }` |
| `POST` | `/api/swarm/execute` | Executes an assigned task using Gemini Pro | `{ task: Task, agent: Agent, context?: string }` |
| `POST` | `/api/swarm/evaluate` | Evaluates task output via a critic persona | `{ task: Task, artifact: string, critic: Agent }` |
| `POST` | `/api/swarm/generate-persona` | Procedurally generates a balanced persona | `{ prompt: string }` |
| `POST` | `/api/swarm/tick` | Server-authoritative swarm execution step | `{ jobId: string, tasks: Task[], agents: Agent[] }` |

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **Google Gemini API Key**: Acquired from [Google AI Studio](https://aistudio.google.com/)
* **Firebase Project**: Firestore Database and Firebase Authentication enabled

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/benneberg/idcardswarm.git
   cd idcardswarm
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env` and supply your credentials:
   ```bash
   cp .env.example .env
   ```

   ```env
   # Backend AI Key (Server-Side Only - Never expose via VITE_)
   GEMINI_API_KEY=your_gemini_api_key_here

   # Client Firebase Configuration
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running Locally
Launch both the Express backend and the Vite development server on port 3000:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### Running Tests
Execute the Vitest test suite (53 automated tests across 8 test suites):
```bash
npm test
```

### Type Checking & Linting
```bash
npm run lint
```

### Building for Production
Compiles the static frontend to `dist/` and bundles the CommonJS backend into `dist/server.cjs`:
```bash
npm run build
npm start
```

---

## 📖 Authoritative Documentation Model

This repository follows a strict **One fact → One authoritative location** documentation standard:

| Information | Canonical Location | Description |
| :--- | :--- | :--- |
| **Project Overview & Capabilities** | **[README.md](./README.md)** | Purpose, value proposition, feature summary, API, and quickstart |
| **System Architecture & Design** | **[ARCHITECTURE.md](./ARCHITECTURE.md)** | System topology, component breakdown, data schemas, mathematical models, invariants, and threat defenses |
| **Development & Testing** | **[CONTRIBUTING.md](./CONTRIBUTING.md)** | Contribution standards, test authoring, code conventions, and build workflows |
| **Security Policy & Invariants** | **[SECURITY.md](./SECURITY.md)** | Security architecture, vulnerability reporting, and access control policies |
| **AI Agent Runtime Context** | **[.llm-context/context.md](./.llm-context/context.md)** | Technical context, container constraints, and file organization for AI coding agents |

---

## 📄 License
MIT License. See [LICENSE](./LICENSE) for details.

