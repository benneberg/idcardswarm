import { ai, MODELS } from './gemini.ts';
import { AgentCard, SwarmTask, EvaluationReview, SwarmJob } from '../types.ts';
import { Type } from '@google/genai';

/**
 * Orchestrator logic for idCard Personas Swarm
 */

export async function decomposeGoal(goal: string, team: { agents: AgentCard[] }): Promise<Partial<SwarmTask>[]> {
  const prompt = `
    You are a CTO Agent (Orchestrator). 
    Your goal is to decompose the following user goal into a set of discrete, technical tasks for a swarm of AI agents.
    
    GOAL: ${goal}
    
    TEAM CAPABILITIES:
    ${team.agents.map(a => `- ${a.role} (${a.skills.join(', ')})`).join('\n')}
    
    Return a JSON array of tasks. Each task should have:
    - id (string, snake_case)
    - description (string)
    - type (string)
    - dependencies (array of task ids)
    - routing_tags (array of strings, e.g. "backend", "frontend", "security")
    - assigned_agent_ids (array of strings from the team provided)
  `;

  const response = await ai.models.generateContent({
    model: MODELS.PRO,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING },
            dependencies: { type: Type.ARRAY, items: { type: Type.STRING } },
            routing_tags: { type: Type.ARRAY, items: { type: Type.STRING } },
            assigned_agent_ids: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["id", "description", "type", "dependencies", "routing_tags", "assigned_agent_ids"]
        }
      }
    }
  });

  return JSON.parse(response.text);
}

export async function executeTask(task: SwarmTask, agent: AgentCard, context: string): Promise<{ content: string }> {
  const prompt = `
    ROLE: ${agent.role}
    STRENGTHS: ${agent.strengths.join(', ')}
    BEHAVIOR RULES: ${agent.behavior_rules.join('\n')}
    
    TASK: ${task.description}
    CONTEXT: ${context}
    
    Produce the requested artifact (code, docs, etc.). 
    Be professional and adhere strictly to your persona rules.
  `;

  const response = await ai.models.generateContent({
    model: MODELS.PRO,
    contents: prompt,
  });

  return { content: response.text };
}

export async function evaluateTask(task: SwarmTask, artifact: string, critic: AgentCard): Promise<Partial<EvaluationReview>> {
  const prompt = `
    CRITIC ROLE: ${critic.role} (Lens)
    FOCUS AREAS: ${critic.skills.join(', ')}
    STRENGTHS: ${critic.strengths.join(', ')}
    
    TASK: ${task.description}
    ARTIFACT PRODUCED:
    ---
    ${artifact}
    ---
    
    Evaluate the artifact through your specific lens.
    Return a JSON object with:
    - score (0 to 1)
    - issues (array of { severity, category, description, location })
    - recommendations (array of strings)
    - risk_flags (array of { level, description })
  `;

  const response = await ai.models.generateContent({
    model: MODELS.FLASH,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                location: { type: Type.STRING }
              }
            }
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          risk_flags: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                level: { type: Type.STRING },
                description: { type: Type.STRING }
              }
            }
          }
        },
        required: ["score", "issues", "recommendations", "risk_flags"]
      }
    }
  });

  return JSON.parse(response.text);
}
