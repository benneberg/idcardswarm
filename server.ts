import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { ai, MODELS } from "./src/lib/gemini";
import { Type } from "@google/genai";
import pino from "pino";

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '1mb' }));

// Rate Limiting Middleware (Sliding Window, 30 req/min per IP)
interface RateLimitRecord {
  count: number;
  resetAt: number;
}
const rateLimitMap = new Map<string, RateLimitRecord>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

export function rateLimiter(req: express.Request, res: express.Response, next: express.NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - 1);
    return next();
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    res.setHeader('Retry-After', retryAfter);
    res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
    res.setHeader('X-RateLimit-Remaining', 0);
    logger.warn({ ip, retryAfter }, "Rate limit exceeded on swarm API");
    return res.status(429).json({
      error: "Rate limit exceeded. Maximum 30 requests per minute.",
      retryAfterSeconds: retryAfter
    });
  }

  record.count += 1;
  res.setHeader('X-RateLimit-Limit', MAX_REQUESTS_PER_WINDOW);
  res.setHeader('X-RateLimit-Remaining', MAX_REQUESTS_PER_WINDOW - record.count);
  next();
}

// Telemetry helper
function recordTelemetry(res: express.Response, requestId: string, endpoint: string, model: string, startTime: number, status: 'success' | 'error', extra: Record<string, any> = {}) {
  const durationMs = Math.round(performance.now() - startTime);
  res.setHeader('X-Response-Time-Ms', durationMs);
  logger.info({
    requestId,
    endpoint,
    model,
    durationMs,
    status,
    ...extra
  }, `[Telemetry] ${endpoint} finished in ${durationMs}ms with status ${status}`);
  return durationMs;
}

// API Routes
app.get("/api/health", (req, res) => {
  logger.info({ path: "/api/health" }, "Health check pulse");
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    rateLimitCapacity: MAX_REQUESTS_PER_WINDOW
  });
});

app.post("/api/swarm/decompose", rateLimiter, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  try {
    const { goal, team } = req.body;
    
    // Payload validation & sanitization
    if (!goal || typeof goal !== 'string' || goal.trim().length === 0) {
      return res.status(400).json({ error: "Goal is required and must be a non-empty string." });
    }
    if (goal.length > 4000) {
      return res.status(400).json({ error: "Goal payload exceeds maximum allowed size (4,000 characters)." });
    }
    if (!Array.isArray(team) || team.length === 0) {
      return res.status(400).json({ error: "Team is required and must be a non-empty array of agents." });
    }
    if (team.length > 50) {
      return res.status(400).json({ error: "Team size exceeds maximum allowed count (50 agents)." });
    }

    logger.info({ requestId, goalLength: goal.length, teamSize: team.length }, "Decomposing goal into tasks");
    
    const prompt = `
      You are a CTO Agent (Orchestrator). 
      Your goal is to decompose the following user goal into a set of discrete, technical tasks for a swarm of AI agents.
      
      GOAL: ${goal.trim()}
      
      TEAM CAPABILITIES:
      ${team.map((a: any) => `- ${a.role || 'Agent'} (${(a.skills || []).join(', ')}) [ID: ${a.id}]`).join('\n')}
      
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
    recordTelemetry(res, requestId, "/api/swarm/decompose", MODELS.PRO, startTime, "success", { taskCount: tasks.length });
    res.json(tasks);
  } catch (error: any) {
    recordTelemetry(res, requestId, "/api/swarm/decompose", MODELS.PRO, startTime, "error", { error: error.message });
    logger.error({ requestId, error: error.message }, "Decomposition failed");
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/execute", rateLimiter, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  try {
    const { task, agent, context } = req.body;
    
    // Payload validation & sanitization
    if (!task || typeof task !== 'object' || !task.description) {
      return res.status(400).json({ error: "Valid task object with description is required." });
    }
    if (!agent || typeof agent !== 'object' || !agent.role) {
      return res.status(400).json({ error: "Valid agent object with role is required." });
    }
    if (context && typeof context === 'string' && context.length > 50000) {
      return res.status(400).json({ error: "Context exceeds maximum length of 50,000 characters." });
    }

    logger.info({ requestId, agentId: agent.id, taskId: task.id }, "Executing task");
    
    const prompt = `
      ROLE: ${agent.role}
      STRENGTHS: ${(agent.strengths || []).join(', ')}
      BEHAVIOR RULES:
      ${(agent.behavior_rules || []).join('\n')}
      
      TASK: ${task.description}
      CONTEXT: ${context || 'None provided.'}
      
      Produce the requested artifact. Be professional and adhere strictly to your persona.
    `;

    const response = await ai.models.generateContent({
      model: MODELS.PRO,
      contents: prompt,
    });

    recordTelemetry(res, requestId, "/api/swarm/execute", MODELS.PRO, startTime, "success", { agentId: agent.id, taskId: task.id });
    res.json({ content: response.text });
  } catch (error: any) {
    recordTelemetry(res, requestId, "/api/swarm/execute", MODELS.PRO, startTime, "error", { error: error.message });
    logger.error({ requestId, error: error.message }, "Task execution failed");
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/evaluate", rateLimiter, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  try {
    const { task, artifact, critic } = req.body;
    
    // Payload validation & sanitization
    if (!task || typeof task !== 'object' || !task.description) {
      return res.status(400).json({ error: "Valid task object with description is required." });
    }
    if (!critic || typeof critic !== 'object' || !critic.role) {
      return res.status(400).json({ error: "Valid critic object with role is required." });
    }
    if (typeof artifact !== 'string' || artifact.length === 0) {
      return res.status(400).json({ error: "Artifact string is required." });
    }
    if (artifact.length > 100000) {
      return res.status(400).json({ error: "Artifact exceeds maximum allowed length of 100,000 characters." });
    }

    logger.info({ requestId, criticId: critic.id, taskId: task.id }, "Evaluating artifact");
    
    const prompt = `
      CRITIC ROLE: ${critic.role}
      FOCUS AREAS: ${(critic.skills || []).join(', ')}
      
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
    recordTelemetry(res, requestId, "/api/swarm/evaluate", MODELS.FLASH, startTime, "success", { score: evalData.score });
    res.json(evalData);
  } catch (error: any) {
    recordTelemetry(res, requestId, "/api/swarm/evaluate", MODELS.FLASH, startTime, "error", { error: error.message });
    logger.error({ requestId, error: error.message }, "Evaluation failed");
    res.status(500).json({ error: error.message });
  }
});

// AI-Assisted Procedural Persona Generation
app.post("/api/swarm/generate-persona", rateLimiter, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({ error: "Prompt string is required." });
    }
    if (prompt.length > 2000) {
      return res.status(400).json({ error: "Prompt exceeds maximum allowed length of 2,000 characters." });
    }

    logger.info({ requestId, promptLength: prompt.length }, "Procedurally generating persona with AI");

    const systemPrompt = `
      You are an expert AI cognitive architect. Given a brief persona description, generate a complete, balanced persona blueprint.
      
      USER PROMPT: ${prompt.trim()}
      
      Generate a realistic name, age (18-65), professional role, occupation, detailed bio, motivations (comma-separated), pain points (comma-separated), experience level ('junior', 'mid', 'senior', or 'staff'), tech proficiency (0-100), Big Five personality traits (0-100 for openness, conscientiousness, risk_tolerance, extraversion, agreeableness), capability vector scores (0-1.0 for technical_depth, curiosity, reliability, adaptability, creativity, leadership), and 2-3 specific behavioral rules.
    `;

    const response = await ai.models.generateContent({
      model: MODELS.FLASH,
      contents: systemPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            age: { type: Type.INTEGER },
            role: { type: Type.STRING },
            occupation: { type: Type.STRING },
            bio: { type: Type.STRING },
            motivations: { type: Type.STRING },
            pain_points: { type: Type.STRING },
            experience: { type: Type.STRING, enum: ["junior", "mid", "senior", "staff"] },
            tech_proficiency: { type: Type.INTEGER },
            personality: {
              type: Type.OBJECT,
              properties: {
                openness: { type: Type.INTEGER },
                conscientiousness: { type: Type.INTEGER },
                risk_tolerance: { type: Type.INTEGER },
                extraversion: { type: Type.INTEGER },
                agreeableness: { type: Type.INTEGER }
              },
              required: ["openness", "conscientiousness", "risk_tolerance", "extraversion", "agreeableness"]
            },
            capability_vector: {
              type: Type.OBJECT,
              properties: {
                technical_depth: { type: Type.NUMBER },
                curiosity: { type: Type.NUMBER },
                reliability: { type: Type.NUMBER },
                adaptability: { type: Type.NUMBER },
                creativity: { type: Type.NUMBER },
                leadership: { type: Type.NUMBER }
              },
              required: ["technical_depth", "curiosity", "reliability", "adaptability", "creativity"]
            },
            behavior_rules: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["name", "age", "role", "occupation", "bio", "motivations", "pain_points", "experience", "tech_proficiency", "personality", "capability_vector", "behavior_rules"]
        }
      }
    });

    const personaData = JSON.parse(response.text || "{}");
    recordTelemetry(res, requestId, "/api/swarm/generate-persona", MODELS.FLASH, startTime, "success", { personaRole: personaData.role });
    res.json(personaData);
  } catch (error: any) {
    recordTelemetry(res, requestId, "/api/swarm/generate-persona", MODELS.FLASH, startTime, "error", { error: error.message });
    logger.error({ requestId, error: error.message }, "Persona generation failed");
    res.status(500).json({ error: error.message });
  }
});

// Server-Authoritative Swarm Execution Tick Endpoint
app.post("/api/swarm/tick", rateLimiter, async (req, res) => {
  const requestId = Math.random().toString(36).substring(7);
  const startTime = performance.now();
  try {
    const { jobId, tasks, agents } = req.body;
    if (!jobId || !Array.isArray(tasks)) {
      return res.status(400).json({ error: "jobId and tasks array are required." });
    }

    // Identify next executable task whose dependencies are satisfied
    const pendingTasks = tasks.filter((t: any) => t.status === 'pending');
    const completedTaskIds = new Set(tasks.filter((t: any) => t.status === 'done').map((t: any) => t.id));
    
    const readyTask = pendingTasks.find((t: any) => 
      !t.dependencies || t.dependencies.length === 0 || t.dependencies.every((dep: string) => completedTaskIds.has(dep))
    );

    const isAllDone = tasks.length > 0 && pendingTasks.length === 0 && tasks.every((t: any) => t.status === 'done');

    recordTelemetry(res, requestId, "/api/swarm/tick", "LOCAL", startTime, "success", {
      readyTaskId: readyTask?.id || null,
      isAllDone
    });

    res.json({
      jobId,
      status: isAllDone ? 'completed' : readyTask ? 'active' : 'idle',
      readyTask: readyTask || null,
      pendingCount: pendingTasks.length,
      completedCount: completedTaskIds.size
    });
  } catch (error: any) {
    recordTelemetry(res, requestId, "/api/swarm/tick", "LOCAL", startTime, "error", { error: error.message });
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
    console.log(`Server running on http://localhost:${PORT}`);
    logger.info({ port: PORT, env: process.env.NODE_ENV || "development" }, `Civitas Server Node Booted on port ${PORT}`);
  });
}

startApp();
