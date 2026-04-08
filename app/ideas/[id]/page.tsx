import sql from "@/lib/db";
import { notFound } from "next/navigation";

export default async function IdeaReport({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await sql`SELECT * FROM ideas WHERE id = ${id}`;
  if (!result.length) notFound();

  const idea = result[0];
  const r = idea.report;

  const riskColor: Record<string, string> = {
    Low: "#4caf50",
    Medium: "#f5c518",
    High: "#ff6b6b",
  };

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto" }}>

      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <p style={{ color: "#f5c518", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>Validation Report</p>
        <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-1px", marginTop: "0.4rem" }}>{idea.title}</h1>
        <p style={{ color: "#666", fontSize: "0.85rem", marginTop: "0.4rem" }}>{idea.description}</p>
      </div>

      {/* Score Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "1.2rem" }}>
          <p style={{ color: "#777", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Profitability Score</p>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, color: "#f5c518", marginTop: "0.3rem" }}>{r.profitability_score}<span style={{ fontSize: "1rem", color: "#555" }}>/100</span></p>
        </div>
        <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "10px", padding: "1.2rem" }}>
          <p style={{ color: "#777", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px" }}>Risk Level</p>
          <p style={{ fontSize: "2.5rem", fontWeight: 700, color: riskColor[r.risk_level] ?? "#e8e8e8", marginTop: "0.3rem" }}>{r.risk_level}</p>
        </div>
      </div>

      {/* Sections */}
      {[
        { label: "Problem", value: r.problem },
        { label: "Target Customer", value: r.customer },
        { label: "Market Overview", value: r.market },
        { label: "Justification", value: r.justification },
      ].map(({ label, value }) => (
        <Section key={label} label={label} value={value} />
      ))}

      {/* Competitors */}
      <div style={{ marginBottom: "1.5rem" }}>
        <SectionLabel label="Competitors" />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {r.competitor.map((c: { name: string; differentiation: string }, i: number) => (
            <div key={i} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "0.9rem 1.2rem", display: "flex", gap: "1rem", alignItems: "flex-start" }}>
              <span style={{ color: "#f5c518", fontWeight: 700, minWidth: "20px" }}>{i + 1}.</span>
              <div>
                <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{c.name}</p>
                <p style={{ color: "#777", fontSize: "0.85rem", marginTop: "0.2rem" }}>{c.differentiation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div style={{ marginBottom: "2rem" }}>
        <SectionLabel label="Suggested Tech Stack" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
          {r.tech_stack.map((tech: string) => (
            <span key={tech} style={{ background: "#1f1f1f", border: "1px solid #2a2a2a", borderRadius: "6px", padding: "0.4rem 0.9rem", fontSize: "0.85rem", color: "#e8e8e8" }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Back */}
      <a href="/dashboard" style={{ color: "#555", fontSize: "0.85rem", textDecoration: "none" }}>← Back to Dashboard</a>
    </div>
  );
}

function SectionLabel({ label }: { label: string }) {
  return <p style={{ color: "#777", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "0.6rem" }}>{label}</p>;
}

function Section({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <SectionLabel label={label} />
      <p style={{ color: "#ccc", fontSize: "0.95rem", lineHeight: 1.7, background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: "8px", padding: "1rem 1.2rem" }}>
        {value}
      </p>
    </div>
  );
}