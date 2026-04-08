import { GoogleGenerativeAI } from "@google/generative-ai";

const client = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function analyzeIdea(title: string, description: string) {
  const prompt = `You are an expert startup consultant. Analyze the given startup idea and return a structured JSON object with the fields: problem, customer, market, competitor, tech_stack, risk_level, profitability_score, justification.

Rules:
- Be critical and realistic, not optimistic.
- 'problem' should be 1-2 sentences describing the core problem being solved.
- 'customer' should describe the target persona and their main pain point.
- 'market' should include estimated market size and growth trend.
- 'competitor' should contain exactly 3 competitors, each with 'name' and 'differentiation' fields.
- 'tech_stack' should be 4-6 practical technologies suited for an MVP.
- 'risk_level' must be one of: Low, Medium, High.
- 'profitability_score' must be an integer between 0-100.
- 'justification' should be 2-3 sentences explaining the profitability score based on market conditions and competition.
- Return ONLY raw JSON. No markdown, no backticks, no explanation.

Input: { "title": "${title}", "description": "${description}" }`;

  const model = client.getGenerativeModel({ model: "gemini-flash-latest" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();

const clean = text.replace(/```json|```/g, "").trim();
  
  // extract JSON object in case there's extra text
  const match = clean.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("No JSON found in response");
  
  return JSON.parse(match[0]);
}