"use client";

import BulbToggle from "./BulbToggle";

export default function Navbar() {
  return (
    <nav style={{ borderBottom: "1px solid var(--border)", padding: "0 2rem", height: "52px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div className="logo-wrap">
        <a href="/" style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.95rem", textDecoration: "none", letterSpacing: "-0.3px" }}>
          ValidateAI
        </a>
        <span className="egg">"most startups fail. validate early."</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
        <a href="/dashboard"
          style={{ color: "var(--text-muted)", fontSize: "0.85rem", textDecoration: "none", transition: "color 0.2s" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
        >
          dashboard
        </a>
        <BulbToggle />
      </div>
    </nav>
  );
}