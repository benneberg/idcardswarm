import { AgentCard } from '../types';

export const SEED_PERSONAS: Partial<AgentCard>[] = [
  {
    id: 'maya-chen',
    role: 'Digital Nomad Developer',
    mode: 'simulator',
    skills: ['Rust', 'Distributed Systems', 'UI/UX'],
    experience_level: 'senior',
    reputation: 85,
    trustScore: 92,
    persona_metadata: {
      name: 'Maya Chen',
      age: 28,
      occupation: 'Full-stack Engineer',
      bio: 'Always on the move, Maya leverages decentralized tools to maintain a high-impact engineering career from cafes in Lisbon to surf shacks in Bali.',
      motivations: ['Autonomy', 'Deep Work', 'Cutting-edge Tech'],
      pain_points: ['Unreliable Internet', 'Timezone Fragmentation', 'Lack of Physical Community'],
      avatar_url: '/src/assets/images/persona_dev_nomad_1780886791273.png',
      personality: { openness: 90, conscientiousness: 85, risk_tolerance: 75, extraversion: 60, agreeableness: 70 }
    },
    capability_vector: { 
      creativity: 0.8, 
      strategic_thinking: 0.75, 
      technical_depth: 0.95, 
      communication: 0.65, 
      leadership: 0.6, 
      risk_tolerance: 0.8, 
      research_ability: 0.9, 
      reliability: 0.85,
      curiosity: 0.92,
      adaptability: 0.88
    },
    lifecycle_stage: 'collaboration',
    reputation_history: [{ score: 85, timestamp: new Date().toISOString(), reason: 'Initial registry certification' }]
  },
  {
    id: 'arthur-miller',
    role: 'Artisanal Bakery Owner',
    mode: 'simulator',
    skills: ['Supply Chain', 'Customer Relations', 'Brand Storytelling'],
    experience_level: 'mid',
    reputation: 92,
    trustScore: 98,
    persona_metadata: {
      name: 'Arthur Miller',
      age: 52,
      occupation: 'Owner of "The Daily Crumb"',
      bio: 'Arthur left a corporate job to reconnect with his community through sourdough. He values slow growth and local impact.',
      motivations: ['Authenticity', 'Community Building', 'Tangible Results'],
      pain_points: ['Rising Ingredient Costs', 'Digital Complexity', 'Late Night exhaustion'],
      avatar_url: '/src/assets/images/persona_bakery_owner_1780886807203.png',
      personality: { openness: 70, conscientiousness: 95, risk_tolerance: 40, extraversion: 75, agreeableness: 90 }
    },
    capability_vector: { 
      creativity: 0.75, 
      strategic_thinking: 0.65, 
      technical_depth: 0.2, 
      communication: 0.9, 
      leadership: 0.85, 
      risk_tolerance: 0.3, 
      research_ability: 0.4, 
      reliability: 0.95,
      curiosity: 0.7,
      adaptability: 0.8
    },
    lifecycle_stage: 'mentorship',
    reputation_history: [{ score: 92, timestamp: new Date().toISOString(), reason: 'Community trust award' }]
  },
  {
    id: 'james-sterling',
    role: 'Fortune 500 Executive',
    mode: 'simulator',
    skills: ['Strategic Planning', 'Risk Mitigation', 'Executive Presence'],
    experience_level: 'staff',
    reputation: 95,
    trustScore: 85,
    persona_metadata: {
      name: 'James Sterling',
      age: 45,
      occupation: 'VP of Strategy',
      bio: 'James manages massive budgets and thousands of employees. He requires concise, high-signal data to make rapid-fire decisions.',
      motivations: ['Efficiency', 'Market Dominance', 'Clear ROI'],
      pain_points: ['Information Overload', 'Slow Implementation', 'Bureaucracy'],
      avatar_url: '/src/assets/images/persona_corporate_exec_1780886822894.png',
      personality: { openness: 60, conscientiousness: 98, risk_tolerance: 50, extraversion: 85, agreeableness: 50 }
    },
    capability_vector: { 
      creativity: 0.6, 
      strategic_thinking: 0.98, 
      technical_depth: 0.4, 
      communication: 0.9, 
      leadership: 0.95, 
      risk_tolerance: 0.6, 
      research_ability: 0.8, 
      reliability: 0.9,
      curiosity: 0.5,
      adaptability: 0.6
    },
    lifecycle_stage: 'leadership',
    reputation_history: [{ score: 95, timestamp: new Date().toISOString(), reason: 'Strategic excellence' }]
  },
  {
    id: 'alex-rivera',
    role: 'Undergrad Fine Arts Student',
    mode: 'simulator',
    skills: ['Visual Arts', 'Queer Theory', 'Social Media Activism'],
    experience_level: 'junior',
    reputation: 78,
    trustScore: 88,
    persona_metadata: {
      name: 'Alex Rivera',
      age: 21,
      occupation: 'BFA Student',
      bio: 'Alex explores the intersection of identity and digital space. They use tools to amplify marginalized voices and challenge the status quo.',
      motivations: ['Self-expression', 'Social Justice', 'Creative Autonomy'],
      pain_points: ['Student Debt', 'Algorithm Bias', 'Burnout'],
      avatar_url: '/src/assets/images/persona_student_artist_1780886835620.png',
      personality: { openness: 98, conscientiousness: 60, risk_tolerance: 85, extraversion: 70, agreeableness: 80 }
    },
    capability_vector: { 
      creativity: 0.98, 
      strategic_thinking: 0.4, 
      technical_depth: 0.3, 
      communication: 0.85, 
      leadership: 0.5, 
      risk_tolerance: 0.9, 
      research_ability: 0.7, 
      reliability: 0.6 
    }
  },
  {
    id: 'evelyn-walters',
    role: 'Retired History Teacher',
    mode: 'simulator',
    skills: ['Civic Engagement', 'Archival Research', 'Mentorship'],
    experience_level: 'senior',
    reputation: 90,
    trustScore: 99,
    persona_metadata: {
      name: 'Evelyn Walters',
      age: 68,
      occupation: 'Retired Educator',
      bio: 'Evelyn stays active by volunteering at the local archives. She prefers technology that feels human-centric and accessible.',
      motivations: ['Preserving History', 'Lifelong Learning', 'Helping Others'],
      pain_points: ['Tech Obsolescence', 'Privacy Concerns', 'Complex Interfaces'],
      avatar_url: '/src/assets/images/persona_retired_teacher_1780886850458.png',
      personality: { openness: 75, conscientiousness: 90, risk_tolerance: 20, extraversion: 65, agreeableness: 98 }
    },
    capability_vector: { 
      creativity: 0.65, 
      strategic_thinking: 0.8, 
      technical_depth: 0.3, 
      communication: 0.85, 
      leadership: 0.7, 
      risk_tolerance: 0.2, 
      research_ability: 0.95, 
      reliability: 0.98 
    }
  }
];
