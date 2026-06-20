import { describe, it, expect } from 'vitest';
import { computeCapabilityDeltas } from '../lib/capabilityEngine';

describe('CapabilityEngine Logic', () => {
  it('should correctly shift DNA when task succeeds', () => {
    const current = { technical_depth: 0.5 };
    const tags = ['backend'];
    const result = computeCapabilityDeltas(current, tags, 1.0, true);
    
    const technicalDepth = result.find(r => r.dimension === 'technical_depth');
    expect(technicalDepth).toBeDefined();
    expect(technicalDepth!.after).toBeGreaterThan(0.5);
    expect(technicalDepth!.after).toBeLessThanOrEqual(1.0);
  });

  it('should respect CAP_MAX (1.0)', () => {
    const current = { technical_depth: 1.0 };
    const tags = ['backend'];
    const result = computeCapabilityDeltas(current, tags, 1.0, true);
    
    const technicalDepth = result.find(r => r.dimension === 'technical_depth');
    // If it's already 1.0, and we try to increase it, it should stay 1.0. 
    // The current implementation returns deltas only if abs(actualDelta) > 0.001.
    // If after is 1.0 and before was 1.0, actualDelta is 0.
    if (technicalDepth) {
      expect(technicalDepth.after).toBe(1.0);
    } else {
      // If no delta was returned, it means it didn't change (which is correct if at cap)
      expect(true).toBe(true);
    }
  });

  it('should handle negative impact on failure', () => {
    const current = { technical_depth: 0.5 };
    const tags = ['backend'];
    const result = computeCapabilityDeltas(current, tags, 1.0, false);
    
    const technicalDepth = result.find(r => r.dimension === 'technical_depth');
    expect(technicalDepth).toBeDefined();
    expect(technicalDepth!.after).toBeLessThan(0.5);
  });
});
