# Civitas AI: Development Roadmap & TODOs

## 🛠️ Active "Slop" & Engineering Review (Honest Audit)

### 1. Architectural Improvements (In-Progress)
- [ ] **Modularize `App.tsx`**: The main controller has exceeded 800 lines. Logic for Firebase listeners, Job Orchestration, and Rendering should be split into domain scripts.
- [ ] **State Management Shift**: Move away from 15+ individual `useState` hooks to a centralized store (e.g., Zustand or useReducer) to manage sub-systems like `ActiveJob` and `RegistryState`.
- [ ] **Custom Hooks**: Extract Firebase sync logic into hooks like `useAgentRegistry()` and `useSwarmNetwork()`.
- [ ] **Refine Succession Logic**: Move inheritance calculation from component level to a dedicated `evolutionEngine.ts`.

### 2. Implementation Gaps (Stubs)
- [ ] **Relationships Tab**: Currently a static placeholder. Needs to visualize `EntityRelationships` between agents using a D3 trust-network graph.
- [ ] **System Map (Analytic Canvas)**: The "visualizer" tab is currently a simplified view. Needs a real-time node-graph representing agent load and task throughput.
- [ ] **Task Decomposition**: Implement agentic logic where Gemini takes a "Job" description and procedurally generates a valid sub-task array based on the `target_complexity`.
- [ ] **Sociometric Feedback**: Actually write Trust/Reputation updates to Firestore based on task performance logs.

### 3. Polish & Interaction
- [ ] **Agent Profile Details**: The `idCard` detail view is editorial but lacks deep historical data (e.g., "Hall of Fame tasks").
- [ ] **Mutation Visuals**: Add subtle UI feedback (e.g., particle effects or color shifts) when an Agent's DNA is altered during succession.
- [ ] **Responsive Refinement**: The Swarm board becomes cluttered on tablets. Implement a "Compact Board" view.

### 4. Technical Debt
- [ ] **Type Safety Audit**: Replace `any` in tests and check for untyped Firestore return objects.
- [ ] **Leveling Balance**: The `currentLevel * 1000` XP formula is a placeholder. Needs exponential tuning for long-term "Endgame" play.
- [ ] **Error Boundaries**: Wrap complex D3/Motion visualizations in error boundaries to prevent hard crashes during data jitter.

### 5. Testing
- [ ] **Integration Tests**: Set up Vitest mocks for Firebase Firestore to test "Job Submission" flow.
- [ ] **Visual Regression**: Basic tests for radar charts to ensure they render correctly with zeroed Capability Vectors.
