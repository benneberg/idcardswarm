import { AgentCard, SwarmTask, TaskBid } from '../types';

/**
 * Market-Based Task Bidding & Reputation Currency Engine
 * Enables internal market coordination where agents wager reputation tokens
 * to claim swarm directives based on capability-role resonance.
 */

export const DEFAULT_INITIAL_TOKENS = 100;

/**
 * Computes an agent's resonance score and token wager for an unassigned task.
 */
export function calculateAgentBid(
  agent: AgentCard,
  task: SwarmTask,
  tokenBalance: number = DEFAULT_INITIAL_TOKENS
): TaskBid {
  const taskTags = (task.routing_tags || []).map(t => t.toLowerCase());
  const taskDesc = (task.description || '').toLowerCase();

  // 1. Skill overlap score
  const agentSkills = (agent.skills || []).map(s => s.toLowerCase());
  const skillMatches = agentSkills.filter(skill =>
    taskTags.some(tag => skill.includes(tag) || tag.includes(skill)) ||
    taskDesc.includes(skill)
  ).length;
  const skillFit = Math.min(1.0, 0.25 + skillMatches * 0.25);

  // 2. Capability alignment
  const cap = agent.capability_vector || {};
  let capScore = 0.50;
  if (taskTags.some(t => ['architecture', 'strategy', 'planning'].includes(t))) {
    capScore = cap.strategic_thinking ?? 0.50;
  } else if (taskTags.some(t => ['audit', 'security', 'validation', 'infrastructure'].includes(t))) {
    capScore = ((cap.technical_depth ?? 0.50) + (cap.reliability ?? 0.50)) / 2;
  } else if (taskTags.some(t => ['creative', 'design', 'copywriting'].includes(t))) {
    capScore = ((cap.creativity ?? 0.50) + (cap.communication ?? 0.50)) / 2;
  } else {
    capScore = ((cap.technical_depth ?? 0.50) + (cap.adaptability ?? 0.50)) / 2;
  }

  // 3. Priority bias alignment
  const priorityBias = agent.priority_bias?.correctness ?? 0.33;
  const compositeResonance = (skillFit * 0.40) + (capScore * 0.45) + (priorityBias * 0.15);
  const normalizedResonance = Math.max(0.10, Math.min(0.99, Math.round(compositeResonance * 100) / 100));

  // Determine wager amount based on token balance and resonance
  const availableTokens = Math.max(5, tokenBalance);
  const wagerRatio = normalizedResonance >= 0.75 ? 0.20 : (normalizedResonance >= 0.50 ? 0.10 : 0.05);
  const rawWager = Math.round(availableTokens * wagerRatio);
  const bidAmount = Math.max(5, Math.min(30, rawWager));

  const rationale = `${agent.role || 'Agent'} placed bid w/ resonance ${Math.round(normalizedResonance * 100)}% (${skillMatches} skill matches, cap fit: ${Math.round(capScore * 100)}%)`;

  return {
    id: `bid_${agent.id}_${task.id}_${Date.now()}`,
    taskId: task.id,
    agentId: agent.id,
    agentName: agent.role || agent.id,
    resonanceScore: normalizedResonance,
    bidAmount,
    rationale,
    timestamp: new Date().toISOString(),
    status: 'pending'
  };
}

/**
 * Conducts a market auction for a task across all available bidding agents.
 * Identifies the winning bidder based on highest capability resonance.
 */
export function conductTaskAuction(
  task: SwarmTask,
  candidateAgents: AgentCard[]
): { winningBid: TaskBid | null; allBids: TaskBid[] } {
  // Only operational executors participate in task auctions
  const eligibleAgents = candidateAgents.filter(a => a.mode !== 'critic');

  if (eligibleAgents.length === 0) {
    return { winningBid: null, allBids: [] };
  }

  const bids: TaskBid[] = eligibleAgents.map(agent => {
    const balance = agent.reputation_tokens ?? DEFAULT_INITIAL_TOKENS;
    return calculateAgentBid(agent, task, balance);
  });

  // Sort bids primarily by resonanceScore desc, secondarily by bidAmount desc
  bids.sort((a, b) => {
    if (b.resonanceScore !== a.resonanceScore) {
      return b.resonanceScore - a.resonanceScore;
    }
    return b.bidAmount - a.bidAmount;
  });

  if (bids.length > 0) {
    bids[0].status = 'accepted';
    for (let i = 1; i < bids.length; i++) {
      bids[i].status = 'outbid';
    }
    return { winningBid: bids[0], allBids: bids };
  }

  return { winningBid: null, allBids: [] };
}

/**
 * Calculates reputation token dividend payout or penalty upon task evaluation.
 */
export function calculateMarketDividend(
  winningBid: TaskBid,
  performanceScore: number,
  taskComplexity: number = 3
): {
  tokenDividend: number;
  repDividend: number;
  netTokenChange: number;
  outcome: 'profit' | 'breakeven' | 'forfeit';
  rationale: string;
} {
  const wager = winningBid.bidAmount;

  if (performanceScore >= 0.70) {
    // High performance: return wager + profit dividend
    const profitBonus = Math.round(taskComplexity * 3 * performanceScore);
    const tokenDividend = wager + profitBonus;
    const repDividend = Math.round(5 * performanceScore);
    return {
      tokenDividend,
      repDividend,
      netTokenChange: profitBonus,
      outcome: 'profit',
      rationale: `Contract fulfilled with excellence (${Math.round(performanceScore * 100)}%). Returned ${wager} wagered tokens + ${profitBonus} dividend bonus.`
    };
  } else if (performanceScore >= 0.50) {
    // Satisfactory performance: break even, return wager
    return {
      tokenDividend: wager,
      repDividend: 1,
      netTokenChange: 0,
      outcome: 'breakeven',
      rationale: `Contract completed adequately (${Math.round(performanceScore * 100)}%). Wager of ${wager} tokens returned.`
    };
  } else {
    // Deficient performance: forfeit wagered tokens
    return {
      tokenDividend: 0,
      repDividend: -2,
      netTokenChange: -wager,
      outcome: 'forfeit',
      rationale: `Contract failed quality threshold (${Math.round(performanceScore * 100)}%). Wager of ${wager} tokens forfeited to commons.`
    };
  }
}
