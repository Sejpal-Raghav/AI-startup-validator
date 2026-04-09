import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { analyzeIdea } from "@/lib/ai";

const rateLimit = new Map<string, { count: number; ts: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const window = 60 * 1000; // 1 minute
  const max = 5;

  const entry = rateLimit.get(ip);
  if (!entry || now - entry.ts > window) {
    rateLimit.set(ip, { count: 1, ts: now });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

function sanitize(input: string): string {
  return input
    .replace(/```[\s\S]*?```/g, "")
    .replace(/ignore\s+(previous|above|all)\s+instructions?/gi, "")
    .replace(/system\s*prompt/gi, "")
    .replace(/you\s+are\s+now/gi, "")
    .trim();
}

export async function GET() {
  const ideas = await sql`SELECT id, title, description, created_at FROM ideas ORDER BY created_at DESC`;
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Too many requests. Wait a minute." }, { status: 429 });
  }

  const { title, description } = await req.json();

  if (!title || !description) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  if (title.length > 100 || description.length > 1000) {
    return NextResponse.json({ error: "Input too long" }, { status: 400 });
  }

  const cleanTitle = sanitize(title);
  const cleanDescription = sanitize(description);

  if (!cleanTitle || !cleanDescription) {
    return NextResponse.json({ error: "Invalid input detected" }, { status: 400 });
  }

  const report = await analyzeIdea(cleanTitle, cleanDescription);

  if (!report.is_valid) {
    return NextResponse.json({ error: report.rejection_reason }, { status: 422 });
  }

  const result = await sql`
    INSERT INTO ideas (title, description, report)
    VALUES (${cleanTitle}, ${cleanDescription}, ${JSON.stringify(report)})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}