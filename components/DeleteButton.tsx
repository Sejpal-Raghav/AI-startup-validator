"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleConfirm(e: React.MouseEvent) {
    e.preventDefault();
    setPending(false);
    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    router.refresh();
  }

  function handleCancel(e: React.MouseEvent) {
    e.preventDefault();
    setPending(false);
  }

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    setPending(true);
  }

  return (
    <>
      <button
        onClick={handleClick}
        style={{
          background: "transparent",
          border: "1px solid var(--border)",
          color: "#555",
          cursor: "pointer",
          padding: "0.3rem 0.4rem",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
          transition: "color 0.2s, border-color 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#ff6b6b";
          e.currentTarget.style.borderColor = "rgba(255,107,107,0.4)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#555";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <Trash2 size={13} />
      </button>

      {pending && (
        <div
          onClick={(e) => e.preventDefault()}
          style={{
            position: "fixed",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--bg-card)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            padding: "1rem 1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            zIndex: 999,
            boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          }}
        >
          <p style={{ fontSize: "0.88rem", color: "var(--text)" }}>delete this idea?</p>
          <button
            onClick={handleConfirm}
            style={{
              background: "rgba(255,107,107,0.1)",
              border: "1px solid rgba(255,107,107,0.4)",
              color: "#ff6b6b",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: "0.35rem 0.8rem",
              borderRadius: "6px",
              fontFamily: "inherit",
            }}
          >
            delete
          </button>
          <button
            onClick={handleCancel}
            style={{
              background: "transparent",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              cursor: "pointer",
              padding: "0.35rem 0.8rem",
              borderRadius: "6px",
              fontFamily: "inherit",
            }}
          >
            cancel
          </button>
        </div>
      )}
    </>
  );
}