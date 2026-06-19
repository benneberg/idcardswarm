# AUDIT: Civitas AI Technical Review

## Security Review (Severity: Medium)
- **Issue: Loose Authorization in Relationships Collection**  
  **Severity: High**  
  **Evidence**: `firestore.rules` L114-116: `match /relationships/{relId} { allow get, list, create, update: if isSignedIn(); }`.  
  **Root Cause**: Broad `isSignedIn()` check without `ownerId` or composite ID verification.  
  **Impact**: A malicious user can read or overwrite the trust/influence scores between any two agents in the system.  
  **Recommendation**: Implement a check ensuring `request.auth.uid` matches either the `sourceId` or `targetId` in the relation, or verify the ownership of the agents being referenced.  
  **Confidence**: High.

- **Issue: Public Gemini Proxy Endpoints**  
  **Severity: Medium**  
  **Evidence**: `server.ts` routes `/api/swarm/*` lack rate limiting or internal-only authentication.  
  **Impact**: Risk of API quota exhaustion if endpoints are discovered and hammered.  
  **Recommendation**: Add a secret header check for internal service-to-service calls or basic rate limiting via `express-rate-limit`.  
  **Confidence**: High.

## Dependency Review
- **Status**: **Healthy**.
- **Evidence**: `package.json` uses current versions of `@google/genai` (2.4.0), React (19.0.1), and Tailwind (4.1.14). No unmaintained/known-vulnerable packages identified in the top-level tree.
- **Risk**: Low.

## Performance Review
- **Issue: Client-Side Orchestration Loop**  
  **Severity: Low**  
  **Evidence**: `App.tsx` Line 500: `setInterval(runExecutionLoop, 5000)`.  
  **Impact**: Multiple open tabs will result in redundant and conflicting execution attempts in Firestore.  
  **Recommendation**: Move the execution "tick" to a server-side cron or a single leader-election pattern in the frontend using `localForage` or similar.  
  **Confidence**: Medium.

## Observability Review
- **Issue: Absence of Structured Logging & Health Monitoring**  
  **Severity: Medium**  
  **Evidence**: No health check route in `server.ts`; reliance on `console.log`.  
  **Impact**: Hard to monitor in a containerized environment (Cloud Run). Load balancers cannot verify service health.  
  **Recommendation**: Implement `/api/health` and use a light structured logger (e.g., `pino`).  
  **Confidence**: High.

## CI/CD Review
- **Status**: **Ready for Automaton**.
- **Evidence**: `package.json` contains `build`, `lint`, and `test` scripts. The project builds successfully with standard tools.
- **Recommendation**: Integrate `npx vitest run` and `npm run lint` into a GitHub Action / Deployment trigger.
- **Confidence**: High.

## Risk Assessment
- **Top Risk**: **Data Desync**. Concurrent modification of Agent objects (e.g. XP gain) from multiple sources without Firestore transactions.
- **Mitigation**: Update XP logic to use `increment()` or Firestore transactions in `App.tsx`.
