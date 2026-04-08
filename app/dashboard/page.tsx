import Link from "next/link";
import sql from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const ideas = await sql`SELECT id, title, description, created_at FROM ideas ORDER BY created_at DESC`;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-1px" }}>your ideas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.3rem" }}>
            {ideas.length} idea{ideas.length !== 1 ? "s" : ""} validated
          </p>
        </div>
        <Link href="/" style={{
          background: "var(--accent)", color: "#0f0f0f",
          padding: "0.55rem 1.1rem", borderRadius: "8px",
          fontWeight: 700, fontSize: "0.82rem", textDecoration: "none",
        }}>
          + new idea
        </Link>
      </div>

      {ideas.length === 0 ? (
        <div style={{ textAlign: "center", marginTop: "6rem", color: "var(--text-muted)" }}>
          <p style={{ fontSize: "1rem" }}>nothing here yet.</p>
          <p style={{ fontSize: "0.82rem", marginTop: "0.4rem", fontStyle: "italic" }}>
            "an idea not validated is just a wish."
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
          {ideas.map((idea: any) => (
            <Link key={idea.id} href={`/ideas/${idea.id}`} style={{ textDecoration: "none" }}>
              <div className="card" style={{ padding: "1.1rem 1.4rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h2 style={{ fontWeight: 600, fontSize: "0.95rem" }}>{idea.title}</h2>
                  <span style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    {new Date(idea.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", marginTop: "0.35rem", lineHeight: 1.5 }}>
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