import type { Express } from "express";
import { createServer, type Server } from "http";
import { SYSTEM_PROMPT } from "./prompt";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/ask", async (req, res) => {
    try {
      const { question } = req.body || {};

      if (!question || typeof question !== "string") {
        return res.status(400).json({ message: "Missing 'question' in request body" });
      }

      if (question.length > 250) {
        return res.status(400).json({ message: "Question too long. Max 250 characters." });
      }

      const apiKey = process.env.OPENROUTER_API_KEY_2;
      if (!apiKey) {
        console.error("OPENROUTER_API_KEY_2 not configured");
        return res.status(500).json({ message: "API key not configured" });
      }

      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "X-Title": "NW Portfolio Website"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-small",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: question }
          ]
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error("OpenRouter API error:", errText);
        return res.status(response.status).json({
          message: "Error from OpenRouter API",
          details: errText
        });
      }

      const data = await response.json();
      return res.json({
        answer: data.choices?.[0]?.message?.content || "No response received."
      });
    } catch (err) {
      console.error("Internal error in /api/ask:", err);
      return res.status(500).json({ message: "Error processing question" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
