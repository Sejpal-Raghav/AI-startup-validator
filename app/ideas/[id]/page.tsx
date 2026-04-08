import sql from "@/lib/db";
import { notFound } from "next/navigation";

export default async function IdeaReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await sql`SELECT * FROM ideas WHERE id = ${id}`;
  if (!result.length) notFound();

  const idea = result[0];
  const r = idea.report;

  const riskColor: Record<string, string> = {
    Low: "#4caf50", Medium: "#f5c518", High: "#ff6b6b",
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto" }}>

      <div style={{ marginBottom: "2.5rem" }}>
        <p className="label" style={{ color: "var(--accent)", marginBottom: "0.5rem" }}>validation report</p>
        <h1 style={{ fontSize: "1.9rem", fontWeight: 700, letterSpacing: "-1px" }}>{idea.title}</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "0.4rem" }}>{idea.description}</p>
      </div>

      {/* Score row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        <div className="card" style={{ padding: "1.2rem" }}>
          <p className="label">profitability score</p>
          <p style={{ fontSize: "2.4rem", fontWeight: 700, color: "var(--accent)", marginTop: "0.2rem" }}>
            {r.profitability_score}<span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>/100</span>
          </p>
        </div>
        <div className="card" style={{ padding: "1.2rem" }}>
          <p className="label">risk level</p>
          <p style={{ fontSize: "2.4rem", fontWeight: 700, color: riskColor[r.risk_level] ?? "var(--text)", marginTop: "0.2rem" }}>
            {r.risk_level}
          </p>
        </div>
      </div>

      {/* Text sections */}
      {[
        { label: "problem", value: r.problem },
        { label: "target customer", value: r.customer },
        { label: "market overview", value: typeof r.market === "object" ? `${r.market.size} — ${r.market.trend}` : r.market },
        { label: "justification", value: r.justification },
      ].map(({ label, value }) => (
        <div key={label} style={{ marginBottom: "1.4rem" }}>
          <p className="label">{label}</p>
          <div className="card" style={{ padding: "1rem 1.2rem" }}>
            <p style={{ color: "var(--text)", fontSize: "0.9rem", lineHeight: 1.7 }}>{value}</p>
          </div>
        </div>
      ))}

      {/* Competitors */}
      <div style={{ marginBottom: "1.4rem" }}>
        <p className="label">competitors</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {r.competitor.map((c: { name: string; differentiation: string }, i: number) => (
            <div key={i} className="card" style={{ padding: "0.9rem 1.2rem", display: "flex", gap: "1rem" }}>
              <span style={{ color: "var(--accent)", fontWeight: 700, minWidth: "18px" }}>{i + 1}.</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.88rem" }}>{c.name}</p>
                <p style={{ color: "var(--text-muted)", fontSize: "0.83rem", marginTop: "0.2rem" }}>{c.differentiation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech stack */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p className="label">suggested tech stack</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {r.tech_stack.map((tech: string) => (
            <span key={tech} className="card" style={{ padding: "0.35rem 0.85rem", fontSize: "0.82rem", borderRadius: "6px" }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <a href="/dashboard" style={{ color: "var(--text-muted)", fontSize: "0.82rem", textDecoration: "none" }}>
        ← back to dashboard
      </a>
    </div>
  );
}