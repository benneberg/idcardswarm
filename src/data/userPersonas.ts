
import { PersonaMetadata } from '../types';

export interface UserPersona extends PersonaMetadata {
  id: string;
  demographics: string;
  frustrations: string[];
  goals: string[];
}

export const USER_PERSONAS: UserPersona[] = [
  {
    id: 'user_001',
    name: 'Alex Chen',
    age: 34,
    demographics: 'Software Architect based in San Francisco. Lead Engineer at an AI Lab.',
    occupation: 'Swarm Architect',
    bio: 'Alex views agents as modular components in a larger machine. He is obsessed with high-fidelity metrics and neural weights, constantly seeking the perfect "Capability Vector" for every task.',
    goals: [
      'Optimize swarm efficiency and throughput',
      'Reduce task latency across the agent network',
      'Ensure architectural DNA integrity during succession protocols'
    ],
    motivations: [
      'System stability',
      'Technical precision',
      'Operational excellence'
    ],
    frustrations: [
      'Black box agent behavior that is difficult to debug',
      'Lack of granular control over capability mutations',
      'Manual overhead in scaling agent networks'
    ],
    pain_points: [
      'Opaque reasoning',
      'High latency'
    ],
    personality: {
      openness: 0.8,
      conscientiousness: 0.95,
      risk_tolerance: 0.4,
    },
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex'
  },
  {
    id: 'user_002',
    name: 'Sarah Jenkins',
    age: 28,
    demographics: 'UX Writer and Narrative Strategist. Works for a series B chatbot startup.',
    occupation: 'Narrative Designer',
    bio: 'Sarah is the "soul" of the development team. She doesn\'t care about latency as much as she cares about "voice". She uses Civitas to build personality-rich assistants that feel human.',
    goals: [
      'Create distinct, relatable agent personas',
      'Maintain consistent voice and tone across swarm outputs',
      'Build various agent archetypes for different user needs'
    ],
    motivations: [
      'Authenticity',
      'User engagement',
      'Variety in persona expression'
    ],
    frustrations: [
      'Repetitive agent responses that lack character',
      'Difficulty "anchoring" specific persona traits',
      'Sterile system interfaces that don\'t reflect agent personality'
    ],
    pain_points: [
      'Bland outputs',
      'Inconsistent voice'
    ],
    personality: {
      openness: 0.9,
      conscientiousness: 0.7,
      risk_tolerance: 0.8,
    },
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah'
  },
  {
    id: 'user_003',
    name: 'David Okoro',
    age: 45,
    demographics: 'Director of Operations at a global fintech firm. MBA graduate.',
    occupation: 'Operations Director',
    bio: 'David treats agents as a digital workforce. He manages his swarm with a focus on ROI and throughput. If a job stays "Green" on the Benchmark Lab, he is happy.',
    goals: [
      'Maximize ROI on agent utilization',
      'Ensure all Job Benchmarks meet enterprise SLAs',
      'Scale digital workforce without linearly increasing costs'
    ],
    motivations: [
      'Cost reduction',
      'Throughput',
      'Transparency and reporting'
    ],
    frustrations: [
      'High idle times for specialized agents',
      'Lack of a high-level "Executive Summary" for swarm health',
      'Integration friction with legacy internal systems'
    ],
    pain_points: [
      'Idle resources',
      'Reporting gaps'
    ],
    personality: {
      openness: 0.4,
      conscientiousness: 0.9,
      risk_tolerance: 0.3,
    },
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  {
    id: 'user_004',
    name: 'Elena Rossi',
    age: 31,
    demographics: 'PhD in Philosophy and Computer Science. Ethics consultant for NGO networks.',
    occupation: 'AI Ethicist',
    bio: 'Elena investigates the emergent behaviors of agent networks. She looks for biases in trust networks and tries to understand how power dynamics shift in hierarchical swarms.',
    goals: [
      'Map relationship trust networks for potential biases',
      'Observe and report mutation rates across generations',
      'Push the boundaries of safe, ethical AGI behavior'
    ],
    motivations: [
      'Scientific discovery',
      'System safety',
      'Transparency'
    ],
    frustrations: [
      'Limited visualization of agent-to-agent interactions',
      'Opaque decision-making in hierarchical job decomposition',
      'Rigid data export options for academic review'
    ],
    pain_points: [
      'Hidden bias',
      'Lack of traceability'
    ],
    personality: {
      openness: 0.6,
      conscientiousness: 0.85,
      risk_tolerance: 0.2,
    },
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena'
  },
  {
    id: 'user_005',
    name: 'Marcus Thorne',
    age: 22,
    demographics: 'Full-stack Developer and indie game enthusiast. Recent college graduate.',
    occupation: 'Power User / Hobbyist',
    bio: 'Marcus spends his weekends "breeding" high-level agents. He treats Civitas like a high-stakes digital garden, aiming to unlock rare succession lineages through intense leveling.',
    goals: [
      'Level up agents to Mastery (LVL 20)',
      'Unlock rare succession lineages and DNA mutations',
      'Build a "Legendary" swarm that outperforms standard benchmarks'
    ],
    motivations: [
      'Achievement',
      'Community prestige',
      'Curiosity about inheritance'
    ],
    frustrations: [
      'Slow progression tracks for early-stage agents',
      'Lack of "showcase" features to share its best agents with friends',
      'Limited "Rarity" indicators for genetic traits'
    ],
    pain_points: [
      'Grindiness',
      'Lack of social proof'
    ],
    personality: {
      openness: 0.85,
      conscientiousness: 0.6,
      risk_tolerance: 0.9,
    },
    avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus'
  }
];
