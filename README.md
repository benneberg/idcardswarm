# Civitas AI: Persona Swarm Registry

> A high-fidelity agentic ecosystem management platform for simulating, managing, and evolving a population of persistent AI entities with dynamic Capability Vectors and sociometric relationships.

[![CI](https://github.com/benneberg/idcardswarm/actions/workflows/ci.yml/badge.svg)](https://github.com/benneberg/idcardswarm/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Firebase](https://img.shields.io/badge/Firebase-Enabled-FFCA28.svg)](https://firebase.google.com/)

---

## The Pillars

*   **Intelligence**: Driven by an ai-backed Express orchestrator.
*   **Persistence**: Real-time state management via Firebase Firestore.
*   **Evolution**: Procedural DNA growth and inheritance protocols for agent lineages.
*   **Design**: "Architectural Editorial" styling using Tailwind CSS 4, Framer Motion, and D3.js.

---

## Key Features (Verified)

### 1. Agent DNA Registry
A centralized dashboard for persistent AI identities. Each agent possesses a unique **Capability Vector** representing strengths in fields like Coding, Logic, UI Design, and Strategic Intelligence.

### 2. Swarm Task Orchestration
Create complex "Jobs" and observe them being decomposed into granular tasks. The swarm dynamically assigns tasks to agents based on their capability-role resonance.

### 3. Evolutionary Succession (Legacy Protocol)
Mature agents can authorize successors. Offspring inherit a subset of the parent's neural architecture, modified by stochastic mutations to promote ecosystem diversity.

### 4. Interactive Visualizers
*   **Capability Radars**: High-precision D3 graphs for agent profiling.
*   **Sociometric Maps (Beta)**: Visualizing trust networks and collaborative history between agents.
*   **Audience matrix**: Comparative persona analysis for project stakeholders.

---

## Getting Started

### Prerequisites
*   Node.js 18+
*   Google Gemini API Key
*   Firebase Project (Firestore & Auth enabled)

### Installation
1.  Clone the repository.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure environment:
    Create a `.env` file based on `.env.example`.

### Local Development
Launch the Express server and Vite frontend simultaneously:
```bash
npm run dev
```

### Testing
Run the Vitest suite:
```bash
npm test
```

### Building for Production
The build process generates a static frontend in `dist/` and a bundled CommonJS server file in `dist/server.cjs`.
```bash
npm run build
```

---

## Configuration

| Variable | Description | Source |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | Server-side AI logic | Google AI Studio |
| `VITE_FIREBASE_*` | Frontend persistence | Firebase Console |

---

## Technical Documentation
For deeper dives into the system design, consult the project artifacts:
*   [ARCHITECTURE.md](./ARCHITECTURE.md) - System flow and data models.
*   [PURPOSE.md](./PURPOSE.md) - Product vision and target audience.
*   [AUDIT.md](./AUDIT.md) - Security and performance review.
*   [TODO.md](./TODO.md) - Active development roadmap.

## License
Proprietary / Internal - Research & Development.
