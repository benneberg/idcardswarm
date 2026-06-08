import { SwarmArchetype } from '../types';

export const SWARM_ARCHETYPES: SwarmArchetype[] = [
  {
    id: 'startup-core',
    name: 'Stealth Startup Team',
    description: 'High-risk, high-velocity collaboration optimized for radical innovation and MVP delivery.',
    composition: [
      { role: 'Visionary Lead', description: 'High openness and risk tolerance.', count: 1 },
      { role: 'Technical Architect', description: 'Maximum technical depth and reliability.', count: 1 },
      { role: 'Product Strategist', description: 'Strategic thinking and communication.', count: 1 }
    ]
  },
  {
    id: 'research-consortium',
    name: 'Scientific Review Board',
    description: 'Low-bias, high-scrutiny collective focused on consensus, accuracy, and empirical verification.',
    composition: [
      { role: 'Lead Researcher', description: 'Research ability and conscientiousness.', count: 1 },
      { role: 'Ethics Critic', description: 'High conscientiousness and risk aversion.', count: 1 },
      { role: 'Subject Matter Expert', description: 'Specific domain technical depth.', count: 2 }
    ]
  },
  {
    id: 'creative-studio',
    name: 'Digital Design Studio',
    description: 'Aesthetically driven unit focused on creative exploration and user-centric elegance.',
    composition: [
      { role: 'Creative Director', description: 'Maximum creativity and openness.', count: 1 },
      { role: 'UI Engineer', description: 'Creativity and technical depth.', count: 2 },
      { role: 'User Research Entity', description: 'Strategic thinking and research.', count: 1 }
    ]
  }
];
