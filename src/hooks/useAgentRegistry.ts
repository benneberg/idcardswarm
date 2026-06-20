import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import type { AgentCard } from '../types';
import { SEED_PERSONAS } from '../data/seedPersonas';

export function useAgentRegistry(user: any) {
  const [agents, setAgents] = useState<AgentCard[]>([]);
  const [loading, setLoading] = useState(true);

  const seedInitialAgents = async (userId: string) => {
    const defaultAgents: Partial<AgentCard>[] = [
      {
        id: 'arch_001',
        role: 'Systems Architect',
        mode: 'executor',
        skills: ['Architecture', 'Scaling', 'Performance'],
        behavior_rules: ['Prefer simple architecture', 'Focus on scalability'],
        strengths: ['API Design', 'Cloud Infra'],
        experience_level: 'staff',
        tools: ['diagrams', 'docs'],
        ownerId: userId
      },
      {
        id: 'sec_lens_001',
        role: 'Security Analyst',
        mode: 'critic',
        skills: ['Vulnerabilities', 'Encryption', 'Auth'],
        behavior_rules: ['Be relentless about security', 'Question every attack surface'],
        strengths: ['Pen testing', 'Audit'],
        experience_level: 'senior',
        tools: ['scanner'],
        ownerId: userId
      },
      {
        id: 'ux_lens_001',
        role: 'UX Designer',
        mode: 'critic',
        skills: ['Usability', 'Interface', 'Friction'],
        behavior_rules: ['Advocate for the user', 'Simplify everything'],
        strengths: ['User Flow', 'Accessibility'],
        experience_level: 'senior',
        tools: ['figma'],
        ownerId: userId
      }
    ];

    const allAgentsToSeed = [...defaultAgents, ...SEED_PERSONAS];

    for (const a of allAgentsToSeed) {
      const agentId = a.id || `agent_${Math.random().toString(36).substr(2, 9)}`;
      try {
        await setDoc(doc(db, 'agents', agentId), {
          ...a,
          id: agentId,
          version: '1.0',
          exp: 0,
          level: 1,
          satisfaction: 0.8,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          capability_vector: a.capability_vector || {
            coding: 0.5,
            system_design: 0.5,
            debugging: 0.5,
            ui_design: 0.5,
            curiosity: 0.5,
            adaptability: 0.5
          },
          lifecycle_stage: a.lifecycle_stage || 'initialization',
          reputation_history: a.reputation_history || [],
          priority_bias: a.priority_bias || { correctness: 0.5, speed: 0.5, elegance: 0.5 },
          context_budget: a.context_budget || 4000,
          weaknesses: a.weaknesses || ['unknown'],
          behavior_rules: a.behavior_rules || ['Follow instructions'],
          ownerId: userId
        });
      } catch (e) {
        handleFirestoreError(e, OperationType.WRITE, `agents/${agentId}`);
      }
    }
  };

  useEffect(() => {
    if (!user) {
      setAgents([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'agents')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const agentList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AgentCard[];
      
      setAgents(agentList);
      
      if (agentList.length === 0) {
        seedInitialAgents(user.uid);
      }
      
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'agents');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return { agents, loading };
}
