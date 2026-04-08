"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (!title.trim() || !description.trim()) return setError("both fields required.");
    setLoading(true);
    setError("");

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) { setError("something went wrong."); setLoading(false); return; }
    const data = await res.json();
    router.push(`/ideas/${data.id}`);
  }

  const inputStyle = {
    width: "100%",
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    padding: "0.75rem 1rem",
    color: "var(--text)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  };

  return (
    <div style={{ maxWidth: "580px", margin: "4rem auto 0" }}>
      <p className="label" style={{ marginBottom: "0.8rem" }}>startup validator</p>
      <h1 style={{ fontSize: "2.2rem", fontWeight: 700, letterSpacing: "-1.5px", lineHeight: 1.15 }}>
        is your idea<br />
        <span style={{ color: "var(--accent)" }}>worth building?</span>
      </h1>
      <p style={{ color: "var(--text-muted)", marginTop: "0.75rem", fontSize: "0.88rem" }}>
        drop your idea. get a brutal, honest AI analysis.
      </p>

      <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <div>
          <label className="label">idea title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI that roasts your business plan"
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        <div>
          <label className="label">describe it</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="what problem does it solve? who is it for?"
            rows={5}
            style={{ ...inputStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = "var(--accent)")}
            onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
          />
        </div>

        {error && <p style={{ color: "var(--danger)", fontSize: "0.82rem" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? "var(--bg-card)" : "var(--accent)",
            color: loading ? "var(--text-muted)" : "#0f0f0f",
            border: "none",
            borderRadius: "8px",
            padding: "0.85rem",
            fontWeight: 700,
            fontSize: "0.9rem",
            cursor: loading ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.2s",
          }}
        >
          {loading ? "analyzing..." : "validate →"}
        </button>

        {loading && (
          <p style={{ color: "var(--text-muted)", fontSize: "0.78rem", textAlign: "center", fontStyle: "italic" }}>
            "the graveyard is full of ideas that never shipped." — takes ~15s
          </p>
        )}
      </div>
    </div>
  );
}