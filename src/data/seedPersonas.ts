import { AgentCard } from '../types';

export const SEED_PERSONAS: Partial<AgentCard>[] = [
  {
    id: 'maya-chen',
    role: 'Digital Nomad Developer',
    mode: 'simulator',
    skills: ['Rust', 'Distributed Systems', 'UI/UX'],
    experience_level: 'senior',
    persona_metadata: {
      name: 'Maya Chen',
      age: 28,
      occupation: 'Full-stack Engineer',
      bio: 'Always on the move, Maya leverages decentralized tools to maintain a high-impact engineering career from cafes in Lisbon to surf shacks in Bali.',
      motivations: ['Autonomy', 'Deep Work', 'Cutting-edge Tech'],
      pain_points: ['Unreliable Internet', 'Timezone Fragmentation', 'Lack of Physical Community'],
      avatar_url: '/src/assets/images/persona_dev_nomad_1780886791273.png'
    },
    capability_vector: { coding: 0.9, system_design: 0.8, debugging: 0.85, ui_design: 0.7 }
  },
  {
    id: 'arthur-miller',
    role: 'Artisanal Bakery Owner',
    mode: 'simulator',
    skills: ['Supply Chain', 'Customer Relations', 'Brand Storytelling'],
    experience_level: 'mid',
    persona_metadata: {
      name: 'Arthur Miller',
      age: 52,
      occupation: 'Owner of "The Daily Crumb"',
      bio: 'Arthur left a corporate job to reconnect with his community through sourdough. He values slow growth and local impact.',
      motivations: ['Authenticity', 'Community Building', 'Tangible Results'],
      pain_points: ['Rising Ingredient Costs', 'Digital Complexity', 'Late Night exhaustion'],
      avatar_url: '/src/assets/images/persona_bakery_owner_1780886807203.png'
    },
    capability_vector: { coding: 0.1, system_design: 0.4, debugging: 0.3, ui_design: 0.6 }
  },
  {
    id: 'james-sterling',
    role: 'Fortune 500 Executive',
    mode: 'simulator',
    skills: ['Strategic Planning', 'Risk Mitigation', 'Executive Presence'],
    experience_level: 'staff',
    persona_metadata: {
      name: 'James Sterling',
      age: 45,
      occupation: 'VP of Strategy',
      bio: 'James manages massive budgets and thousands of employees. He requires concise, high-signal data to make rapid-fire decisions.',
      motivations: ['Efficiency', 'Market Dominance', 'Clear ROI'],
      pain_points: ['Information Overload', 'Slow Implementation', 'Bureaucracy'],
      avatar_url: '/src/assets/images/persona_corporate_exec_1780886822894.png'
    },
    capability_vector: { coding: 0.2, system_design: 0.9, debugging: 0.4, ui_design: 0.3 }
  },
  {
    id: 'alex-rivera',
    role: 'Undergrad Fine Arts Student',
    mode: 'simulator',
    skills: ['Visual Arts', 'Queer Theory', 'Social Media Activism'],
    experience_level: 'junior',
    persona_metadata: {
      name: 'Alex Rivera',
      age: 21,
      occupation: 'BFA Student',
      bio: 'Alex explores the intersection of identity and digital space. They use tools to amplify marginalized voices and challenge the status quo.',
      motivations: ['Self-expression', 'Social Justice', 'Creative Autonomy'],
      pain_points: ['Student Debt', 'Algorithm Bias', 'Burnout'],
      avatar_url: '/src/assets/images/persona_student_artist_1780886835620.png'
    },
    capability_vector: { coding: 0.3, system_design: 0.2, debugging: 0.1, ui_design: 0.95 }
  },
  {
    id: 'evelyn-walters',
    role: 'Retired History Teacher',
    mode: 'simulator',
    skills: ['Civic Engagement', 'Archival Research', 'Mentorship'],
    experience_level: 'senior',
    persona_metadata: {
      name: 'Evelyn Walters',
      age: 68,
      occupation: 'Retired Educator',
      bio: 'Evelyn stays active by volunteering at the local archives. She prefers technology that feels human-centric and accessible.',
      motivations: ['Preserving History', 'Lifelong Learning', 'Helping Others'],
      pain_points: ['Tech Obsolescence', 'Privacy Concerns', 'Complex Interfaces'],
      avatar_url: '/src/assets/images/persona_retired_teacher_1780886850458.png'
    },
    capability_vector: { coding: 0.05, system_design: 0.5, debugging: 0.2, ui_design: 0.4 }
  }
];
