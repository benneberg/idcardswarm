# TESTING_DELTA: Civitas AI Strategy

## Existing Strategy
- **Framework**: Vitest + React Testing Library.
- **Current Coverage**: Basic UI rendering for `AgentCardItem`.
- **Location**: `/src/test/`.

## Coverage Gaps
1. **Core Logic Engines**: `capabilityEngine.ts` (XP/DNA shifts) and `agentService.ts` (Inheritance math).
2. **API Handlers**: The `/api/swarm` routes are currently untested.
3. **Firestore Interaction**: Validation of the listener-to-state flow.

## Bootstrap Plan
I have added a core logic test for the `capabilityEngine` to ensure DNA shifts remain mathematically sound and bounded.

### New Test Suite: `src/test/CapabilityEngine.test.ts`
```typescript
import { describe, it, expect } from 'vitest';
import { computeCapabilityDeltas } from '../lib/capabilityEngine';

describe('CapabilityEngine Logic', () => {
  it('should correctly shift DNA when task succeeds', () => {
    const current = { technical_depth: 0.5 };
    const tags = ['backend'];
    const result = computeCapabilityDeltas(current, tags, 1.0, true);
    
    expect(result[0].dimension).toBe('technical_depth');
    expect(result[0].after).toBeGreaterThan(0.5);
    expect(result[0].after).toBeLessThanOrEqual(1.0);
  });

  it('should respect CAP_MAX (1.0)', () => {
    const current = { technical_depth: 1.0 };
    const tags = ['backend'];
    const result = computeCapabilityDeltas(current, tags, 1.0, true);
    expect(result[0].after).toBe(1.0);
  });
});
```

### 3 High-Value Test Cases (Recommended)
1. **Inheritance Fidelity**: Verify that `spawnOffspring` correctly inherits 30% of parent stats with a controlled random delta.
2. **Job Decomposition Schema**: Test the `/api/swarm/decompose` mock output to ensure it matches the `SwarmTask` interface.
3. **Trust Network Consistency**: Verify that `relationships` score updates are bounded between 0 and 1.
