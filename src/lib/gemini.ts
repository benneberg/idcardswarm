import { GoogleGenAI } from "@google/genai";

let aiInstance: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiInstance = new GoogleGenAI({ apiKey });
  }
  return aiInstance;
}

export const ai = new Proxy({} as GoogleGenAI, {
  get(_target, prop: string | symbol) {
    const client = getGemini();
    const val = (client as any)[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  }
});

export const MODELS = {
  FLASH: "gemini-2.5-flash",
  PRO: "gemini-2.5-flash",
};
