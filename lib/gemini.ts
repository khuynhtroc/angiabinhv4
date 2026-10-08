import { GoogleGenAI } from "@google/genai";

let defaultClient: GoogleGenAI | null = null;

export function getGeminiClient(customApiKey?: string): GoogleGenAI | null {
  const apiKey = customApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!customApiKey && defaultClient) {
    return defaultClient;
  }
  const client = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
  if (!customApiKey) {
    defaultClient = client;
  }
  return client;
}
