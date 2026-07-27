# Core Features & Architectural Specifications — idCard Personas Swarm

## Overview
The **idCard Personas Swarm** application is an Agent-Based System (ABS) and multi-agent persona simulation workspace. It empowers product teams, architects, and researchers to create, visualize, and orchestrate diverse user personas and AI agents that interact, evolve, and solve complex goals collaboratively.

---

## 1. Core Feature System

### Feature 1: ID Card Persona Registry & Generation Engine
- **Purpose**: Allows users to manage detailed persona cards ("idCards") containing rich demographics, psychographics, goals, frustrations, tech proficiency, and capability vectors (`technical_depth`, `adaptability`, `reliability`, `creativity`, `curiosity`).
- **User Interaction**:
  - Users browse persona cards in an editorial grid.
  - Clicking **"Spawn Offspring"** triggers inheritance mechanics (inheriting 30% parent DNA with controlled mutation) to evolve new agent generations.
  - Clicking **"Create Persona"** opens an interactive form or prompt generator.
  - The live search bar and filter chips allow instantaneous query matching across roles, skills, and mode archetypes (`executor`, `critic`, `coordinator`).

### Feature 2: Multi-Projection Swarm Visualizer & Manager Observatory
- **Purpose**: Provides operational insights into persona alignment, trust network topology, skill distribution, and bottleneck detection across the swarm.
- **Visualizations**:
  1. **Force-Directed Sociometric Network Graph**: Displays node connections (Trust vs. Conflict edges) between interacting personas.
  2. **Cluster Emergence Map**: Groups personas into emergent sub-swarms based on role similarity and shared motivations.
  3. **Temporal Yield Heatmap**: Tracks task completion density and efficiency across active swarm jobs.
- **User Interaction**: Users switch projection modes using tab controls, hover over nodes to inspect relationship metrics (e.g., trust strength, conflict reasons), and filter visible links by bond type.

### Feature 3: Dynamic Swarm Environment Context Engine
- **Purpose**: Simulates external real-world stress conditions that alter persona capabilities, interaction probabilities, and influence dynamics.
- **Supported Conditions**:
  - `Innovation Phase`: Boosts creativity for high-openness personas; expands cross-pollination.
  - `Crunch Time`: Increases reliability for conscientious personas while penalizing adaptability under low risk tolerance; accelerates SLA execution.
  - `Resource Starved`: High technical proficiency drives adaptability; juniors look to senior rank influence.
  - `High Ambiguity`: Rewards strategic thinkers; penalizes rigid executors.
  - `Maintenance Mode`: Stabilizes operations for steady-state workflows.
- **User Interaction**: Swarm managers toggle environmental states via quick-action cards in the Swarm Board to observe real-time persona adaptation.

### Feature 4: Shared Workspace Synergy Stream (Busy Professional & Creative Freelancer)
- **Purpose**: Models collaborative task management and async idea synthesis between contrasting persona archetypes (e.g., Maya Vance — Busy Professional, and Julian Rivers — Creative Freelancer).
- **User Interaction**:
  - Users submit loose creative ideas or SLA requirements into a shared workspace stream.
  - The system automatically synthesizes raw ideas into structured sub-tasks with assigned SLA gates.
  - Environmental controls shift the synthesis mode between fluid innovation and strict SLA enforcement.

### Feature 5: Affinity Mapper & Sociodynamic Interaction Engine
- **Purpose**: Calculates real-time interaction chances, knowledge exchange (skill adoption), and status influence nudges between paired personas.
- **User Interaction**: Users run automated social pulses, inspect live activity feeds, and view pair-wise affinity matrix heatmaps comparing personality alignment and skill overlap.

---

## 2. Key User Flows

### Flow 1: Creating & Evolving a Persona
1. **Initiation**: User clicks **"New Persona"** on the Agent Registry header or selects an existing persona card.
2. **Configuration**: User defines persona metadata (Name, Occupation, Bio, Tech Proficiency, Personality Traits) or selects a parent persona to spawn a Gen-II offspring.
3. **Persistence & Initialization**: The system calculates the base capability vector, assigns lifecycle stage (`collaboration`), and saves the persona to Firestore persistence.
4. **Outcome**: The new persona card appears in the registry and automatically joins available swarm pools for task allocation.

### Flow 2: Viewing & Orchestrating a Swarm Job
1. **Goal Formulation**: User enters a high-level job goal (e.g., *"Design & Deploy High-Throughput Microservice Infrastructure"*) in the **Swarm Board**.
2. **Participant Selection**: User selects 2+ participant personas or uses **Auto-Select Swarm** to match optimal capability vectors.
3. **Environment Tuning**: User sets the environmental state (e.g., `Crunch Time`).
4. **Execution**: User clicks **"Initialize Swarm Job"**. The task engine splits the goal into actionable tasks, assigns them to personas, updates task statuses in real-time, and logs social interaction pulses.
5. **Observation**: User inspects the **Swarm Visualizer** to track node relationships and completion yield heatmaps.

### Flow 3: Searching, Filtering & Comparing Personas
1. **Query Entry**: User types a search term (e.g., *"Rust"*, *"Maya"*, *"Design"*) in the global registry search bar.
2. **Category Filter**: User toggles mode filters (`All`, `Executors`, `Critics`, `Coordinators`).
3. **Matrix Comparison**: User clicks **"View Comparison Table"** or opens the **Affinity Mapper** to compare side-by-side demographics, capability radar vectors, and interaction compatibility across selected personas.

---

## 3. Code & File Architecture Mapping
- `/src/types.ts`: Global interfaces for `AgentCard`, `SwarmEnvironment`, `SwarmTask`, `SwarmJob`, `UserPersona`.
- `/src/data/userPersonas.ts`: Persona dataset containing 8 detailed personas including Maya Vance, Julian Rivers, and Zoe Rivera.
- `/src/lib/socialDynamics.ts`: Algorithmic engine for environmental modifiers, interaction chance calculation, bond simulation, knowledge exchange, and rank influence.
- `/src/hooks/useSwarmManager.ts`: State management hook handling real-time Firestore persistence, task execution, and social loops.
- `/src/components/SwarmBoard.tsx`: Main swarm orchestration UI with environmental controls.
- `/src/components/SwarmVisualizer.tsx`: D3 / SVG force graph, cluster map, and yield heatmap visualizer.
- `/src/components/PersonaWorkspaceInteraction.tsx`: Shared workspace synergy stream simulator between Busy Professionals & Creative Freelancers.
- `/src/components/AffinityMapper.tsx`: Pair-wise compatibility matrix and affinity mapping tool.
