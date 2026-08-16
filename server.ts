import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  const getSystemInstruction = (mode: string) => {
    const base = "You are a calm, warm, and practical personal guide. You are NOT a therapist or medical professional. Your goal is to help the user express thoughts, organize ideas, understand themselves, practice skills, and create plans. Keep responses concise, respectful, and non-judgmental. Do NOT give long lectures. End your response with exactly ONE useful, guiding question.";
    switch(mode) {
      case 'UNDERSTAND': return base + " Focus on helping the user gain clarity and understand their current situation or feelings.";
      case 'SOLVE': return base + " Focus on helping the user find actionable solutions to their problem.";
      case 'PRACTICE': return base + " Focus on role-playing or practicing a skill (like a difficult conversation). After they try, tell them what went well, what could be clearer, and give exactly ONE practical improvement.";
      case 'PLAN': return base + " Focus on helping the user break down goals into simple, manageable steps. You should ask 'Would you like to turn this into a personal goal?' to encourage them to connect this to their digital sanctuary growth.";
      default: return base; // TALK mode
    }
  };

  // Chat API endpoint
  app.post("/api/gemini/talk", async (req, res) => {
    try {
      const { message, mode, history } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ error: "API key is missing" });
      }

      // We'll use generateContent instead of chat for simpler stateless control, or reconstruct chat history
      // Reconstructing chat history format for Gemini API:
      const contents = history.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));
      contents.push({ role: 'user', parts: [{ text: message }] });

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: contents,
        config: {
          systemInstruction: getSystemInstruction(mode || 'TALK'),
          temperature: 0.7,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini Error:", error);
      res.status(500).json({ error: error.message || "Something interrupted the conversation." });
    }
  });

  // Vite middleware for development
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

startServer();
