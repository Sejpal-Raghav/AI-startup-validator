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
    if (!title || !description) return setError("Fill in both fields.");
    setLoading(true);
    setError("");

    const res = await fetch("/api/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }),
    });

    if (!res.ok) {
      setError("Something went wrong. Try again.");
      setLoading(false);
      return;
    }

    const data = await res.json();
    router.push(`/ideas/${data.id}`);
  }

  return (
    <div className="mt-16 max-w-2xl mx-auto">
      <h1 style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-1px" }}>
        Got a startup idea?
      </h1>
      <p style={{ color: "#777", marginTop: "0.5rem", fontSize: "0.95rem" }}>
        Drop it below and get an AI-powered validation report in seconds.
      </p>

      <div style={{ marginTop: "2.5rem", display: "flex", flexDirection: "column", gap: "1.2rem" }}>
        <div>
          <label style={{ fontSize: "0.8rem", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>
            Idea Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. AI-powered resume builder"
            style={{
              marginTop: "0.5rem",
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "#e8e8e8",
              fontSize: "0.95rem",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f5c518")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
        </div>

        <div>
          <label style={{ fontSize: "0.8rem", color: "#999", textTransform: "uppercase", letterSpacing: "1px" }}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your idea in a few sentences..."
            rows={5}
            style={{
              marginTop: "0.5rem",
              width: "100%",
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: "8px",
              padding: "0.75rem 1rem",
              color: "#e8e8e8",
              fontSize: "0.95rem",
              outline: "none",
              resize: "vertical",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f5c518")}
            onBlur={(e) => (e.target.style.borderColor = "#2a2a2a")}
          />
        </div>

        {error && <p style={{ color: "#ff6b6b", fontSize: "0.85rem" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            background: loading ? "#2a2a2a" : "#f5c518",
            color: loading ? "#555" : "#0f0f0f",
            border: "none",
            borderRadius: "8px",
            padding: "0.85rem",
            fontWeight: 700,
            fontSize: "0.95rem",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "opacity 0.2s",
            width: "100%",
          }}
        >
          {loading ? "Analyzing..." : "Validate Idea →"}
        </button>
      </div>
    </div>
  );
}