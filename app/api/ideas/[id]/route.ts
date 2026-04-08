import { NextRequest, NextResponse } from "next/server";
import sql from "@/lib/db";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const idea = await sql`SELECT * FROM ideas WHERE id = ${params.id}`;
  if (!idea.length) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(idea[0]);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await sql`DELETE FROM ideas WHERE id = ${params.id}`;
  return NextResponse.json({ message: "Deleted" });
}