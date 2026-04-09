import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const MODELS = [
  "gemini-flash-latest",
  "gemini-pro-latest",
  "gemini-2.5-flash-lite",
  "gemini-3-flash-preview",
  "gemini-3-pro-preview",
];

export async function analyzeIdea(title: string, description: string) {
  const prompt = `You are an expert startup consultant with deep market research experience. Analyze the given startup idea and return a structured JSON object with the fields: is_valid, rejection_reason, problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.

Rules:
- First evaluate if the idea is specific enough to analyze. If too vague, set 'is_valid' to false and 'rejection_reason' to a short message explaining what's missing. If valid, set 'is_valid' to true and 'rejection_reason' to null.
- Be critical and realistic, not optimistic.
- 'problem' should be 1-2 sentences framing a specific, real pain — not a generic observation.
- 'customer' must be an array of exactly 3 strings: [who they are, their core pain point, where to find them].
- 'market' must be an array of exactly 3 strings: [estimated market size with a source reference e.g. "~$12B by 2027 — Statista", growth rate and trend, one key insight about the market].
- 'competitor' should contain exactly 3 competitors, each with 'name' and 'differentiation' fields.
- 'tech_stack' should be 4-6 practical technologies, each formatted as "Technology (reason)" e.g. "Next.js (frontend)".
- 'risk_level' must be one of: Low, Medium, High.
- 'profitability_score' must be an integer between 0-100.
- 'justification' should be 2-3 sentences explicitly referencing the market data and competitor landscape to explain the score.
- Return ONLY raw JSON. No markdown, no backticks, no explanation.

Input: { "title": "${title}", "description": "${description}" }`;

  let lastError;

  for (const modelName of MODELS) {
    try {
      const model = client.getGenerativeModel({
        model: modelName,
        generationConfig: { responseMimeType: "application/json" } as any,
      });
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      const match = text.replace(/```json|```/g, "").trim().match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in response");
      return JSON.parse(match[0]);
    } catch (err) {
      console.warn(`Model ${modelName} failed, trying next...`);
      lastError = err;
    }
  }

  throw new Error(`All models failed. Last error: ${lastError}`);
}