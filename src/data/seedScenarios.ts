export interface SwarmScenario {
  id: string;
  title: string;
  context: string;
  goal: string;
  dynamics: string;
  recommended_persona_ids: string[];
}

export const SWARM_SCENARIOS: SwarmScenario[] = [
  {
    id: 'conf-networking',
    title: 'Professional Conference: Hybrid Future',
    context: 'A sprawling tech-design summit in Berlin. Mix of in-person attendees and remote avatars. High noise, low attention spans.',
    goal: 'Forge 3 high-value professional connections and identify a potential collaborator for a new project.',
    dynamics: 'Personas must navigate "Elevator Pitch" stress, digital wallet exchanges, and the "Busy-ness" bias of high-status agents.',
    recommended_persona_ids: ['maya-chen', 'james-sterling']
  },
  {
    id: 'community-meetup',
    title: 'Local Neighborhood Council: Urban Garden',
    context: 'A heated community meeting in a local library basement. Diverse ages, conflicting priorities regarding land use.',
    goal: 'Reach a consensus on the 12-month plan for the park renovation that balances ecology with resident accessibility.',
    dynamics: 'Emphasis on empathy, active listening, and bridging the "Digital Divide" between tech-literate and tech-resistant residents.',
    recommended_persona_ids: ['arthur-miller', 'evelyn-walters']
  },
  {
    id: 'online-gaming',
    title: 'Online Gaming Raid: The Nexus Void',
    context: 'A high-stakes 20-player coordinated quest in a persistent virtual world. Real-time voice comms and twitch-reflex coordination.',
    goal: 'Coordinate a diverse group to defeat a world boss while managing internal loot-division disputes fairly.',
    dynamics: 'Meritocratic hierarchy where skill trumps status. Focus on rapid trust-building and high-pressure communication.',
    recommended_persona_ids: ['alex-rivera', 'maya-chen']
  }
];
