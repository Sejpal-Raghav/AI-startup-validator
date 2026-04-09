import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";
import { analyzeIdea } from "@/lib/ai";

export async function GET() {
  const ideas = await sql`SELECT id, title, description, created_at FROM ideas ORDER BY created_at DESC`;
  return NextResponse.json(ideas);
}

export async function POST(req: NextRequest) {
  const { title, description } = await req.json();
  if (!title || !description) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const report = await analyzeIdea(title, description);

  if (!report.is_valid) {
    return NextResponse.json({ error: report.rejection_reason }, { status: 422 });
  }

  const result = await sql`
    INSERT INTO ideas (title, description, report)
    VALUES (${title}, ${description}, ${JSON.stringify(report)})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}