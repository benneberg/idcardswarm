
import { db, auth } from './firebase';
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc,
  setDoc
} from 'firebase/firestore';
import { AgentCard } from '../types';

export const spawnOffspring = async (parent: AgentCard) => {
  if (!parent.persona_metadata || !auth.currentUser) {
    throw new Error('Parent must have metadata and user must be signed in.');
  }
  
  const parentDNA = parent.capability_vector || {};
  const offspringDNA: Record<string, number> = {};
  
  // Inherit 30% of parent specialization as base stats
  Object.keys(parentDNA).forEach(key => {
    const parentVal = Number(parentDNA[key]) || 0.5;
    // 30% inheritance + small random mutation
    offspringDNA[key] = Math.max(0.1, Math.min(1, (parentVal * 0.3) + (Math.random() * 0.1)));
  });

  const newId = `citizen-${Math.random().toString(36).substring(2, 9)}`;
  const generation = (parent.lineage?.generation || 1) + 1;

  const offspringData = {
    role: `Successor of ${parent.role}`,
    mode: parent.mode || 'executor',
    level: 1,
    exp: 0,
    skill_points: 3,
    reputation: 10,
    trustScore: 50,
    capability_vector: offspringDNA,
    lifecycle_stage: 'initialization',
    ownerId: auth.currentUser.uid,
    lineage: {
      parent_id: parent.id,
      generation
    },
    skills: parent.skills.slice(0, 2), // Inherit some core skills
    strengths: [parent.strengths[0] || 'Inherited Logic'],
    weaknesses: ['Inexperience'],
    behavior_rules: ['Respect the lineage.', 'Iterate to perfection.'],
    tools: parent.tools.slice(0, 1),
    context_budget: 4000,
    priority_bias: parent.priority_bias || { correctness: 0.5, speed: 0.3, elegance: 0.2 },
    persona_metadata: {
      name: `${parent.persona_metadata.name.split(' ')[0]} ${'I'.repeat(generation)}`,
      occupation: `Legacy ${parent.persona_metadata.occupation}`,
      age: 18,
      bio: `A ${generation}${getOrdinal(generation)} generation digital entity. Built upon the specialized architectural DNA of ${parent.persona_metadata.name}.`,
      personality: {
          ...parent.persona_metadata.personality,
          openness: Math.max(0, Math.min(100, parent.persona_metadata.personality.openness + (Math.random() * 10 - 5)))
      },
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${newId}`
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };

  const docRef = doc(db, 'agents', newId);
  await setDoc(docRef, offspringData);
  return { id: newId, ...offspringData };
};

function getOrdinal(n: number) {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}
