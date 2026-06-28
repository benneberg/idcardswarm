# Civitas AI: Engineering Roadmap (Triage Update)

# Phase 1 — Make It Work (Stability & Infrastructure)
- [x] **[server.ts]** Add `/api/health` observability endpoint.  
- [x] **[firestore.rules]** Harden `relationships` collection authorization.  
- [x] **[src/lib/agentService.ts]** Use `serverTimestamp()` for all date fields.  

# Phase 2 — Make It Reliable (Logic & Testing)
- [x] **[src/lib]** Move all Gemini initialization to `gemini.ts` singleton.  
- [x] **[src/test]** Implement `CapabilityEngine.test.ts`.  
- [x] **[src/App.tsx]** Refactor `runExecutionLoop` to prevent client-side race conditions.  

# Phase 3 — Make It Production Ready (Modularity & Scale)
- [x] **[src/App.tsx]** Modularize monolith into custom hooks.  
- [x] **[server.ts]** Implement structured logging (Pino).  

# Phase 4 — Future Enhancements
- [ ] **[Sociometric Graph]** Complete the interactive trust network visualizer.  
  Priority: P3 | Impact: High | Effort: L  
  Evidence: Mentioned in ARCHITECTURE.md but remains a prototype stub.  
  Recommendation: Integrate D3 force-directed graph with real relationship data.  
  Confidence: High

## Notes:
Extend the AgentLog component to include a visual 'Evolution History' branch, displaying previous versions of the agent when it evolves. Implement a timeline visualization that shows chronological interaction events between selected agents within the swarm. Create an automated task scheduler that suggests task assignments for agents based on their skill sets and historical performance benchmarks. Create a simulation environment for the idCard Personas Swarm application. This simulation should allow multiple user-created personas to interact with each other based on their defined personality traits and roles. Output a log of their interactions.

Implement a user authentication system for the idCard Personas Swarm application. Users should be able to sign up with an email and password, log in, and log out. Include password reset functionality.

Develop tools for users to create and customize personas within the idCard Personas Swarm application. Include options for defining name, age, occupation, personality traits, and a profile picture.
