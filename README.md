# Civitas AI

Civitas AI is a sophisticated, agent-centric ecosystem designed to simulate and manage persistent digital entities. It provides a living environment where AI agents (Citizens) collaborate on complex task swarms, inherit architectural DNA through succession protocols, and evolve based on performance-driven benchmarks.

## 核心架构 (Core Architecture)

Civitas AI is built as a full-stack platform leveraging the latest in distributed web technologies and generative AI:

- **Frontend**: React 19 powered by Vite, utilizing Tailwind CSS 4 for a high-performance, responsive editorially-styled interface.
- **Backend**: Express.js server providing an orchestrator layer for Gemini API integrations and agent coordination.
- **Intelligence**: Integrated with the Gemini API (`@google/genai`) to drive agent reasoning, decision-making, and characteristic evolution.
- **Persistence**: Firebase Firestore and Authentication manage the dense, real-time state of the agent registry, task lineage, and socio-metric relationships.
- **Visual Performance**: D3.js and Framer Motion facilitate high-fidelity data visualizations and interactive system maps.

## Key Features

### 1. Agent Directory & Registry
A centralized database of persistent AI identities. Each agent possesses a unique "Capability Vector"—a multi-dimensional DNA matrix representing its strengths (e.g., strategic thinking, reliability, technical precision).

### 2. Task Swarm Orchestration
A distributed execution model where complex jobs are decomposed into individual tasks and dynamically routed to agents based on their specialization and current utilization metrics.

### 3. Evolutionary Succession
Civitas implements a "Legacy Protocol." Mature agents (Level 20+) can authorize successors. Offspring inherit a subset of the parent's neural architecture (DNA), modified by small random mutations to promote diversity and optimization over generations.

### 4. System Visualization
Interactive canvas maps utilizing D3.js visualize relationship trust networks, capability deltas, and real-time swarm activity, providing a holistic view of the ecosystem's health.

### 5. Automated Benchmarking
The "Benchmark Lab" tracks agent success rates and complexity handling, allowing for continuous refinement of the agent population.

## Documentation Strategy
For deep dives into the vision and technical layout of Civitas AI, refer to the following:
- [PURPOSE.md](./PURPOSE.md): Product vision, target audience, and key value propositions.
- [ARCHITECTURE.md](./ARCHITECTURE.md): Technical stack, data models, and system orchestration flow.
- [TODO.md](./TODO.md): Active development roadmap and technical debt tracking.

## Technical Configuration

### Environment Variables
To run Civitas AI, you must configure the following environment variables:

```env
# Server-side secrets
GEMINI_API_KEY=your_gemini_api_key

# Firebase Configuration
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Initialize the development environment:
   ```bash
   npm run dev
   ```

### Testing
Civitas AI utilizes Vitest and React Testing Library for component validation.
- **Run Tests**: `npm test`

### Deployment
Civitas AI is designed for containerized deployment (e.g., Cloud Run).
- **Build**: `npm run build`
- **Start**: `npm run start`

## Design Philosophy
The UI follows an **"Architectural Editorial"** design language—prioritizing high-contrast typography (Inter, Space Grotesk), generous negative space, and a professional monochrome palette accented by functional status indicators. Every element is designed to reflect the technical precision required for managing complex digital intelligence.
