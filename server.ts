import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ai, MODELS } from "./src/lib/gemini";
import { Type } from "@google/genai";
import dotenv from "dotenv";
import pino from "pino";

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API Routes
app.get("/api/health", (req, res) => {
  logger.info({ path: "/api/health" }, "Health check pulse");
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/swarm/decompose", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const { goal, team } = req.body;
    logger.info({ requestId, goal }, "Decomposing goal into tasks");
    
    const prompt = `
      You are a CTO Agent (Orchestrator). 
      Your goal is to decompose the following user goal into a set of discrete, technical tasks for a swarm of AI agents.
      
      GOAL: ${goal}
      
      TEAM CAPABILITIES:
      ${team.map((a: any) => `- ${a.role} (${a.skills.join(', ')})`).join('\n')}
      
      Return a JSON array of tasks. Each task should have:
      - id (string, snake_case)
      - description (string)
      - type (string)
      - dependencies (array of task ids)
      - routing_tags (array of strings)
      - assigned_agents (array of strings specifically IDs from the team provided)
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
              assigned_agents: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["id", "description", "type", "dependencies", "routing_tags", "assigned_agents"]
          }
        }
      }
    });

    const tasks = JSON.parse(response.text || "[]");
    logger.info({ requestId, taskCount: tasks.length }, "Decomposition successful");
    res.json(tasks);
  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Decomposition failed");
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/execute", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const { task, agent, context } = req.body;
    logger.info({ requestId, agentId: agent.id, taskId: task.id }, "Executing task");
    
    const prompt = `
      ROLE: ${agent.role}
      STRENGTHS: ${agent.strengths?.join(', ')}
      BEHAVIOR RULES:
      ${agent.behavior_rules?.join('\n')}
      
      TASK: ${task.description}
      CONTEXT: ${context}
      
      Produce the requested artifact. Be professional and adhere strictly to your persona.
    `;

    const response = await ai.models.generateContent({
      model: MODELS.PRO,
      contents: prompt,
    });

    logger.info({ requestId, status: "completed" }, "Task execution finished");
    res.json({ content: response.text });
  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Task execution failed");
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/evaluate", async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  try {
    const { task, artifact, critic } = req.body;
    logger.info({ requestId, criticId: critic.id, taskId: task.id }, "Evaluating artifact");
    
    const prompt = `
      CRITIC ROLE: ${critic.role}
      FOCUS AREAS: ${critic.skills.join(', ')}
      
      TASK: ${task.description}
      ARTIFACT:
      ---
      ${artifact}
      ---
      
      Evaluate the artifact. Return a JSON object with:
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

    const evalData = JSON.parse(response.text || "{}");
    logger.info({ requestId, score: evalData.score }, "Evaluation complete");
    res.json(evalData);
  } catch (error: any) {
    logger.error({ requestId, error: error.message }, "Evaluation failed");
    res.status(500).json({ error: error.message });
  }
});

// Vite middleware for development
async function startApp() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    logger.info({ port: PORT, env: process.env.NODE_ENV || "development" }, "Civitas Server Node Booted");
  });
}

startApp();
