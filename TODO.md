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
