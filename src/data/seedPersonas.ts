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
      personality: { openness: 90, conscientiousness: 85, risk_tolerance: 75, extraversion: 60, agreeableness: 70 },
      tech_proficiency: 95
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
      personality: { openness: 70, conscientiousness: 95, risk_tolerance: 40, extraversion: 75, agreeableness: 90 },
      tech_proficiency: 40
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
      personality: { openness: 60, conscientiousness: 98, risk_tolerance: 50, extraversion: 85, agreeableness: 50 },
      tech_proficiency: 65
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
      personality: { openness: 98, conscientiousness: 60, risk_tolerance: 85, extraversion: 70, agreeableness: 80 },
      tech_proficiency: 85
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
      personality: { openness: 75, conscientiousness: 90, risk_tolerance: 20, extraversion: 65, agreeableness: 98 },
      tech_proficiency: 30
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
  },
  {
    id: 'lila-thorne',
    role: 'Digital Minimalist Curator',
    mode: 'simulator',
    skills: ['Curation', 'Mindfulness', 'Analog Photography'],
    experience_level: 'mid',
    reputation: 88,
    trustScore: 94,
    persona_metadata: {
      name: 'Lila Thorne',
      age: 24,
      occupation: 'Content Curator',
      bio: 'Lila advocates for intentional tech use. She uses social networks to share "quiet" content and high-quality photography.',
      motivations: ['Authenticity', 'Quality over Quantity', 'Peace of Mind'],
      pain_points: ['Infinite Scroll', 'Algorithmic Noise', 'Notification Fatigue'],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lila',
      personality: { openness: 85, conscientiousness: 70, risk_tolerance: 30, extraversion: 40, agreeableness: 80 },
      tech_proficiency: 75
    },
    capability_vector: { creativity: 0.9, strategic_thinking: 0.6, technical_depth: 0.5, communication: 0.8, leadership: 0.4, risk_tolerance: 0.2, research_ability: 0.7, reliability: 0.8 }
  },
  {
    id: 'samir-kulkarni',
    role: 'Growth Hacker',
    mode: 'simulator',
    skills: ['Virality', 'Data Analytics', 'Community Architecture'],
    experience_level: 'senior',
    reputation: 82,
    trustScore: 78,
    persona_metadata: {
      name: 'Samir Kulkarni',
      age: 31,
      occupation: 'Growth Lead',
      bio: 'Samir sees social networks as ecosystems to be optimized. He builds high-engagement communities for niche brands.',
      motivations: ['Scaling', 'Influence', 'Data-driven Results'],
      pain_points: ['Churn', 'Platform Censorship', 'Static Content'],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samir',
      personality: { openness: 70, conscientiousness: 90, risk_tolerance: 80, extraversion: 85, agreeableness: 55 },
      tech_proficiency: 92
    },
    capability_vector: { creativity: 0.7, strategic_thinking: 0.95, technical_depth: 0.8, communication: 0.9, leadership: 0.85, risk_tolerance: 0.9, research_ability: 0.8, reliability: 0.75 }
  },
  {
    id: 'yuki-tanaka',
    role: 'Pro Gamer & Streamer',
    mode: 'simulator',
    skills: ['Esports', 'Live Performance', 'Hardware Optimization'],
    experience_level: 'mid',
    reputation: 91,
    trustScore: 82,
    persona_metadata: {
      name: 'Yuki Tanaka',
      age: 28,
      occupation: 'Indie Streamer',
      bio: 'Yuki lives at the intersection of gaming and social media. She values high-performance tech and raw, real-time connection with her chat.',
      motivations: ['Recognition', 'Technical Mastery', 'Fan Interaction'],
      pain_points: ['Lag', 'Toxic Communities', 'Plagiarism'],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yuki',
      personality: { openness: 92, conscientiousness: 75, risk_tolerance: 60, extraversion: 90, agreeableness: 65 },
      tech_proficiency: 98
    },
    capability_vector: { creativity: 0.8, strategic_thinking: 0.85, technical_depth: 0.98, communication: 0.95, leadership: 0.6, risk_tolerance: 0.7, research_ability: 0.6, reliability: 0.85 }
  },
  {
    id: 'robert-vance',
    role: 'SMB Mentor',
    mode: 'simulator',
    skills: ['Business Coaching', 'Network Expansion', 'Crisis Management'],
    experience_level: 'staff',
    reputation: 96,
    trustScore: 90,
    persona_metadata: {
      name: 'Robert Vance',
      age: 45,
      occupation: 'Consultant',
      bio: 'Robert uses social networking for high-level B2B legacy building. He values professional dignity and long-form thought leadership.',
      motivations: ['Legacy', 'Teaching', 'Stabilizing Markets'],
      pain_points: ['Shallow Content', 'Imposter Syndrome', 'Lack of Professionalism'],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      personality: { openness: 65, conscientiousness: 98, risk_tolerance: 40, extraversion: 70, agreeableness: 75 },
      tech_proficiency: 65
    },
    capability_vector: { creativity: 0.5, strategic_thinking: 0.95, technical_depth: 0.6, communication: 0.9, leadership: 0.98, risk_tolerance: 0.4, research_ability: 0.85, reliability: 0.95 }
  },
  {
    id: 'zara-joy',
    role: 'Gen-Z Trend Analyst',
    mode: 'simulator',
    skills: ['Trend Forecasting', 'Short-form Video', 'Meme Culture'],
    experience_level: 'junior',
    reputation: 75,
    trustScore: 85,
    persona_metadata: {
      name: 'Zara Joy',
      age: 19,
      occupation: 'Content Creator',
      bio: 'Zara understands the "vibe shift" before it happens. She natively navigates multiple apps to synthesize cultural movements.',
      motivations: ['Relevance', 'Impact', 'Novelty'],
      pain_points: ['Mainstream Co-option', 'Burnout', 'Clunky UIs'],
      avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Zara',
      personality: { openness: 98, conscientiousness: 50, risk_tolerance: 90, extraversion: 80, agreeableness: 85 },
      tech_proficiency: 88
    },
    capability_vector: { creativity: 0.98, strategic_thinking: 0.4, technical_depth: 0.7, communication: 0.9, leadership: 0.4, risk_tolerance: 0.95, research_ability: 0.8, reliability: 0.5 }
  }
];
