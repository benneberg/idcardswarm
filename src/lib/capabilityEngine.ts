
export const TAG_TO_CAPABILITY_MAP: Record<string, Partial<Record<string, number>>> = {
  backend:        { technical_depth: 1.0, reliability: 0.6 },
  frontend:       { creativity: 0.7, technical_depth: 0.5, communication: 0.3 },
  architecture:   { strategic_thinking: 1.0, technical_depth: 0.6, leadership: 0.4 },
  security:       { technical_depth: 0.8, reliability: 1.0, risk_tolerance: -0.3 },
  research:       { research_ability: 1.0, curiosity: 0.8, strategic_thinking: 0.4 },
  communication:  { communication: 1.0, leadership: 0.5 },
  leadership:     { leadership: 1.0, strategic_thinking: 0.6, communication: 0.4 },
  creative:       { creativity: 1.0, curiosity: 0.6, adaptability: 0.4 },
  coordination:   { leadership: 0.7, reliability: 0.6, communication: 0.8 },
  review:         { reliability: 0.8, strategic_thinking: 0.5, communication: 0.4 },
};

// How much a perfect score (1.0) moves a capability
const MAX_DELTA_PER_TASK = 0.04;
// Floor/ceiling for capability values
const CAP_MIN = 0.05;
const CAP_MAX = 1.0;

export interface CapabilityDelta {
  dimension: string;
  before: number;
  after: number;
  delta: number;
}

export function computeCapabilityDeltas(
  currentVector: Record<string, number>,
  routingTags: string[],
  performanceScore: number, // 0 to 1, from critic or confidence
  succeeded: boolean
): CapabilityDelta[] {
  const deltas: CapabilityDelta[] = [];
  const direction = succeeded ? 1 : -0.5; // failure hurts less than success helps

  // Aggregate weights across all tags
  const aggregated: Record<string, number> = {};
  for (const tag of routingTags) {
    const mapping = TAG_TO_CAPABILITY_MAP[tag];
    if (!mapping) continue;
    for (const [dim, weight] of Object.entries(mapping)) {
      aggregated[dim] = (aggregated[dim] || 0) + (weight as number);
    }
  }

  // Normalize and compute deltas
  const values = Object.values(aggregated);
  const totalWeight = values.length > 0 ? values.reduce((a, b) => a + b, 0) : 0;
  if (totalWeight === 0) return deltas;

  for (const [dim, weight] of Object.entries(aggregated)) {
    const normalizedWeight = weight / totalWeight;
    const rawDelta = MAX_DELTA_PER_TASK * normalizedWeight * performanceScore * direction;
    
    const before = currentVector[dim] ?? 0.5;
    const after = Math.max(CAP_MIN, Math.min(CAP_MAX, before + rawDelta));
    const actualDelta = after - before;

    if (Math.abs(actualDelta) > 0.001) {
      deltas.push({ dimension: dim, before, after, delta: actualDelta });
    }
  }

  return deltas;
}
