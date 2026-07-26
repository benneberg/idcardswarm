import { useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  query, 
  orderBy, 
  where,
  doc,
  getDoc,
  collectionGroup,
  runTransaction,
  updateDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { computeCapabilityDeltas } from '../lib/capabilityEngine';
import { simulateBond, exchangeKnowledge, applyInfluence, applyEnvironmentalModifiers } from '../lib/socialDynamics';
import type { SwarmJob, SwarmTask, EntityRelationship, AgentCard, SwarmEnvironment } from '../types';

export function useSwarmManager(user: any, agents: AgentCard[], getLifecycleStage: (level: number, stage: string) => string, setLegacyAgent: (agent: AgentCard) => void) {
  const [jobs, setJobs] = useState<SwarmJob[]>([]);
  const [activeJob, setActiveJob] = useState<SwarmJob | null>(null);
  const [tasks, setTasks] = useState<SwarmTask[]>([]);
  const [allTasks, setAllTasks] = useState<SwarmTask[]>([]);
  const [allRelationships, setAllRelationships] = useState<EntityRelationship[]>([]);
  const [currentEnvironment, setCurrentEnvironment] = useState<SwarmEnvironment>({
    condition: 'innovation_phase',
    intensity: 0.5,
    resources: 0.8,
    activeObstacles: []
  });

  // Listen to Jobs
  useEffect(() => {
    if (!user) return;
    const qJobs = query(
      collection(db, 'jobs'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );
    const unsubJobs = onSnapshot(qJobs, (snapshot) => {
      setJobs(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as SwarmJob)));
    });
    return () => unsubJobs();
  }, [user]);

  // Social Interaction Loop
  const runSocialLoop = useCallback(async () => {
    if (!user || agents.length < 2) return;
    
    // Pick two random agents to interact
    const idx1 = Math.floor(Math.random() * agents.length);
    let idx2 = Math.floor(Math.random() * agents.length);
    while (idx1 === idx2) idx2 = Math.floor(Math.random() * agents.length);
    
    // Apply environmental modifiers to agents before interaction logic
    const a1 = applyEnvironmentalModifiers(agents[idx1], currentEnvironment);
    const a2 = applyEnvironmentalModifiers(agents[idx2], currentEnvironment);
    
    const bond = simulateBond(a1, a2, currentEnvironment);
    if (bond) {
       const relId = [a1.id, a2.id].sort().join('_');
       const relRef = doc(db, 'relationships', relId);
       
       await setDoc(relRef, {
         sourceId: a1.id,
         targetId: a2.id,
         trust: bond.strength,
         type: bond.type,
         userId: user.uid,
         lastInteraction: serverTimestamp(),
         createdAt: serverTimestamp()
       }, { merge: true });
    }

    // Knowledge Exchange
    const knowledge = exchangeKnowledge(a1, a2, currentEnvironment);
    if (knowledge?.targetUpdate) {
       await updateDoc(doc(db, 'agents', a2.id), {
         skills: [...(agents[idx2].skills || []), knowledge.targetUpdate].slice(-10),
         updatedAt: serverTimestamp()
       });
    }

    // Influence
    const influence = applyInfluence(a1, a2, currentEnvironment);
    if (influence && agents[idx2].persona_metadata) {
       await updateDoc(doc(db, 'agents', a2.id), {
         'persona_metadata.tech_proficiency': Math.max(0, Math.min(100, agents[idx2].persona_metadata!.tech_proficiency + influence.tech_nudge)),
         updatedAt: serverTimestamp()
       });
    }
  }, [user, agents, currentEnvironment]);

  useEffect(() => {
    const interval = setInterval(runSocialLoop, 30000); // Pulse every 30s
    return () => clearInterval(interval);
  }, [runSocialLoop]);

  // Listen to Relationships
  useEffect(() => {
    if (!user) return;
    const unsubRels = onSnapshot(collection(db, 'relationships'), (snap) => {
      setAllRelationships(snap.docs.map(d => d.data() as EntityRelationship));
    });
    return () => unsubRels();
  }, [user]);

  // Listen to all Tasks (Global Stats)
  useEffect(() => {
    if (!user) return;
    const qAllTasks = query(collectionGroup(db, 'tasks'), where('userId', '==', user.uid));
    const unsubAllTasks = onSnapshot(qAllTasks, (snap) => {
      setAllTasks(snap.docs.map(d => ({ ...d.data(), id: d.id } as SwarmTask)));
    });
    return () => unsubAllTasks();
  }, [user]);

  // Listen to active job tasks
  useEffect(() => {
    if (!activeJob?.id) {
      setTasks([]);
      return;
    }
    const qTasks = query(collection(db, 'jobs', activeJob.id, 'tasks'), orderBy('createdAt', 'asc'));
    const unsubTasks = onSnapshot(qTasks, (snapshot) => {
      setTasks(snapshot.docs.map(d => ({ ...d.data(), id: d.id } as SwarmTask)));
    });
    return () => unsubTasks();
  }, [activeJob?.id]);

  const handleStartJob = async (goal: string, selectedAgentIds: string[]) => {
    if (!user) return;

    const jobData: Partial<SwarmJob> = {
      goal,
      teamId: 'custom',
      status: 'planning',
      max_iterations: 3,
      current_iteration: 1,
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
      userId: user.uid
    };

    let jobDoc;
    try {
      jobDoc = await addDoc(collection(db, 'jobs'), jobData);
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, 'jobs');
      return;
    }

    const jobId = jobDoc.id;
    setActiveJob({ ...jobData, id: jobId } as SwarmJob);

    // Decompose via Server
    try {
      const selectedAgents = agents.filter(a => selectedAgentIds.includes(a.id));
      const res = await fetch('/api/swarm/decompose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, team: selectedAgents })
      });
      const taskList = await res.json();

      for (const t of taskList) {
        await addDoc(collection(db, 'jobs', jobId, 'tasks'), {
          ...t,
          jobId,
          userId: user.uid,
          status: 'pending',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
    } catch (e) {
      console.error('Failed to decompose:', e);
    }
  };

  const runExecutionLoop = useCallback(async () => {
    if (!activeJob?.id || activeJob.status !== 'executing') return;

    const nextTask = tasks.find(t => 
      t.status === 'pending' && 
      t.dependencies.every(depId => tasks.find(tt => tt.id === depId)?.status === 'done')
    );

    if (!nextTask) {
      if (tasks.length > 0 && tasks.every(t => t.status === 'done')) {
        try {
          const jobRef = doc(db, 'jobs', activeJob.id);
          const jobSnap = await getDoc(jobRef);
          if (jobSnap.exists() && jobSnap.data().status === 'executing') {
            await updateDoc(jobRef, { 
              status: 'completed', 
              updatedAt: serverTimestamp() 
            });
          }
        } catch (e) {
          handleFirestoreError(e, OperationType.UPDATE, `jobs/${activeJob.id}`);
        }
      }
      return;
    }

    const taskRef = doc(db, 'jobs', activeJob.id, 'tasks', nextTask.id);
    
    try {
      await runTransaction(db, async (transaction) => {
        const taskDoc = await transaction.get(taskRef);
        if (!taskDoc.exists() || taskDoc.data()?.status !== 'pending') {
          throw new Error('Task already claimed');
        }
        transaction.update(taskRef, { 
          status: 'in_progress', 
          startTime: serverTimestamp(),
          updatedAt: serverTimestamp() 
        });
      });
    } catch (e) {
      return;
    }

    try {
      const agentId = nextTask.assigned_agents[0];
      const agent = agents.find(a => a.id === agentId);
      
      if (!agent) {
         await updateDoc(taskRef, { status: 'failed', updatedAt: serverTimestamp() });
         return;
      }

      const res = await fetch('/api/swarm/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task: nextTask, 
          agent, 
          context: tasks.filter(t => t.status === 'done').map(t => t.output?.content).join('\n\n') 
        })
      });
      const result = await res.json();

      const critics = agents.filter(a => a.mode === 'critic');
      const critic = critics[Math.floor(Math.random() * critics.length)] || agents[0];
      
      let evalResult = { score: 0.75, issues: [], recommendations: [], risk_flags: [] };
      try {
        const evalRes = await fetch('/api/swarm/evaluate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: nextTask, artifact: result.content, critic })
        });
        evalResult = await evalRes.json();
      } catch (e) {
        console.error('Critic evaluation failed:', e);
      }

      const performanceScore = evalResult.score;

      // EVOLUTION
      const routingTags = nextTask.routing_tags || [];
      const currentVector = agent.capability_vector || {};
      const capDeltas = computeCapabilityDeltas(currentVector, routingTags, performanceScore, true);

      const updatedVector = { ...currentVector };
      for (const delta of capDeltas) {
        updatedVector[delta.dimension] = delta.after;
      }

      const reputationEntry = {
        score: Math.round(performanceScore * 100),
        timestamp: new Date().toISOString(),
        reason: `Completed task: ${nextTask.description.slice(0, 60)}`,
      };

      const complexity = nextTask.complexity || Math.floor(Math.random() * 5) + 3;
      const xpEarned = Math.round(complexity * 100 * performanceScore);
      const currentExp = (agent.exp || 0) + xpEarned;
      const currentLevel = agent.level || 1;
      const expToNext = currentLevel * 1000;
      
      const newLevel = currentExp >= expToNext ? currentLevel + 1 : currentLevel;
      const finalExp = currentExp >= expToNext ? currentExp - expToNext : currentExp;
      const skillPointsEarned = currentExp >= expToNext ? 1 : 0;

      if (newLevel === 20 && agent.level !== 20) {
        setLegacyAgent(agent);
      }

      const nextLifecycle = getLifecycleStage(newLevel, agent.lifecycle_stage || 'initialization');
      
      await updateDoc(doc(db, 'agents', agent.id), {
        exp: finalExp,
        level: newLevel,
        lifecycle_stage: nextLifecycle,
        skill_points: (agent.skill_points || 0) + skillPointsEarned,
        satisfaction: Math.min(1, (agent.satisfaction || 0.8) + 0.05),
        capability_vector: updatedVector,
        reputation_history: [
          ...(agent.reputation_history || []).slice(-49),
          reputationEntry
        ],
        updatedAt: serverTimestamp()
      });

      // RELATIONSHIPS
      const relId = [agent.id, critic.id].sort().join('_');
      const relRef = doc(db, 'relationships', relId);
      try {
        await runTransaction(db, async (transaction) => {
          const relSnap = await transaction.get(relRef);
          if (relSnap.exists()) {
            const relData = relSnap.data();
            transaction.update(relRef, {
              collaborationSuccess: (relData.collaborationSuccess || 0) + 1,
              trust: Math.min(1, (relData.trust || 0.5) + 0.01 * performanceScore),
              lastInteraction: serverTimestamp()
            });
          } else {
            transaction.set(relRef, {
              sourceId: agent.id,
              targetId: critic.id,
              trust: 0.5 + 0.01 * performanceScore,
              influence: 0.5,
              collaborationSuccess: 1,
              agreementRate: 1,
              conflictRate: 0,
              reliability: 0.5,
              lastInteraction: serverTimestamp()
            });
          }
        });
      } catch (e) {
         console.error('Relationship update error:', e);
      }

      await updateDoc(taskRef, { 
        status: 'done', 
        output: { content: result.content },
        confidence: performanceScore,
        complexity,
        duration: Math.floor((Date.now() - (nextTask.updatedAt ? new Date(nextTask.updatedAt).getTime() : Date.now())) / 1000),
        updatedAt: serverTimestamp() 
      });

    } catch (e) {
      console.error('Execution failure:', e);
    }
  }, [activeJob?.id, activeJob?.status, tasks, agents, getLifecycleStage, setLegacyAgent]);

  useEffect(() => {
    const interval = setInterval(runExecutionLoop, 5000);
    return () => clearInterval(interval);
  }, [runExecutionLoop]);

  return {
    jobs,
    activeJob,
    setActiveJob,
    tasks,
    allTasks,
    allRelationships,
    handleStartJob,
    currentEnvironment,
    setCurrentEnvironment
  };
}
