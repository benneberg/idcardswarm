# Civitas AI: Engineering Roadmap (Triage Update)

# Phase 1 — Make It Work (Stability & Infrastructure)
- [ ] **[server.ts]** Add `/api/health` observability endpoint.  
  Priority: P0 | Impact: Medium | Effort: S  
  Evidence: Missing in source.  
  Recommendation: Implement standard Express health check.  
  Confidence: High
- [ ] **[firestore.rules]** Harden `relationships` collection authorization.  
  Priority: P0 | Impact: High | Effort: S  
  Evidence: Broad `isSignedIn()` check at L114.  
  Recommendation: Restrict read/write to users involved in the relationship.  
  Confidence: High
- [ ] **[src/lib/agentService.ts]** Use `serverTimestamp()` for all date fields.  
  Priority: P1 | Impact: Medium | Effort: S  
  Evidence: Uses `toISOString()` (L64) which may drift or conflict with rules.  
  Recommendation: Switch to Firestore FieldValue.  
  Confidence: High

# Phase 2 — Make It Reliable (Logic & Testing)
- [ ] **[src/lib]** Move all Gemini initialization to `gemini.ts` singleton.  
  Priority: P1 | Impact: Medium | Effort: S  
  Evidence: Duplicate initialization in `server.ts` and `gemini.ts`.  
  Recommendation: Export shared client instance.  
  Confidence: High
- [ ] **[src/test]** Implement `CapabilityEngine.test.ts`.  
  Priority: P1 | Impact: Medium | Effort: M  
  Evidence: Logic-heavy module lacking verification.  
  Recommendation: Use Vitest for boundary checking.  
  Confidence: High
- [ ] **[src/App.tsx]** Refactor `runExecutionLoop` to prevent client-side race conditions.  
  Priority: P1 | Impact: High | Effort: M  
  Evidence: `setInterval(5000)` without concurrency locks.  
  Recommendation: Use Firestore transaction OR server-side tick.  
  Confidence: Medium

# Phase 3 — Make It Production Ready (Modularity & Scale)
- [ ] **[src/App.tsx]** Modularize monolith into custom hooks.  
  Priority: P2 | Impact: High | Effort: L  
  Evidence: 924 line layout file.  
  Recommendation: Extract `useAgentRegistry` and `useSwarmManager`.  
  Confidence: High
- [ ] **[server.ts]** Implement structured logging (Pino).  
  Priority: P2 | Impact: Medium | Effort: S  
  Evidence: Reliance on `console.log`.  
  Recommendation: Better observability for container logs.  
  Confidence: High

# Phase 4 — Future Enhancements
- [ ] **[Sociometric Graph]** Complete the interactive trust network visualizer.  
  Priority: P3 | Impact: High | Effort: L  
  Evidence: Mentioned in ARCHITECTURE.md but remains a prototype stub.  
  Recommendation: Integrate D3 force-directed graph with real relationship data.  
  Confidence: High
