import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini (Server-side only)
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const MODELS = {
  FLASH: "gemini-3.5-flash",
  PRO: "gemini-3.1-pro-preview",
};

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.post("/api/swarm/decompose", async (req, res) => {
  try {
    const { goal, team } = req.body;
    
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

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Decomposition error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/execute", async (req, res) => {
  try {
    const { task, agent, context } = req.body;
    
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

    res.json({ content: response.text });
  } catch (error: any) {
    console.error("Execution error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/swarm/evaluate", async (req, res) => {
  try {
    const { task, artifact, critic } = req.body;
    
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

    res.json(JSON.parse(response.text));
  } catch (error: any) {
    console.error("Evaluation error:", error);
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
  });
}

startApp();
