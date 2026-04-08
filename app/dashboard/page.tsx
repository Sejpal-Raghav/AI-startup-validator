import Link from "next/link";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const ideas = await sql`SELECT id, title, description, created_at FROM ideas ORDER BY created_at DESC`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-1px" }}>Your Ideas</h1>
          <p style={{ color: "#777", fontSize: "0.9rem", marginTop: "0.3rem" }}>{ideas.length} idea{ideas.length !== 1 && "s"} validated</p>
        </div>
        <Link
          href="/"
          style={{
            background: "#f5c518",
            color: "#0f0f0f",
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            fontWeight: 700,
            fontSize: "0.85rem",
            textDecoration: "none",
          }}
        >
          + New Idea
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "5rem", color: "#555" }}>
          <p style={{ fontSize: "1.1rem" }}>No ideas yet.</p>
          <p style={{ fontSize: "0.85rem", marginTop: "0.4rem" }}>Submit your first idea to get started.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {ideas.map((idea: any) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`} style={{ textDecoration: "none" }}>
              <div style={{
                background: "#1a1a1a",
                border: "1px solid #2a2a2a",
                borderRadius: "10px",
                padding: "1.2rem 1.5rem",
                cursor: "pointer",
              }} className="idea-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontWeight: 600, fontSize: "1rem", color: "#e8e8e8" }}>{idea.title}</h2>
                  <span style={{ color: "#555", fontSize: "0.8rem" }}>
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.4rem", lineHeight: 1.5 }}>
                  {idea.description.length > 120 ? idea.description.slice(0, 120) + "..." : idea.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}