"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!confirm("delete this idea?")) return;

    await fetch(`/api/ideas/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      style={{
        background: "transparent",
        border: "1px solid transparent",
        color: "#555",
        fontSize: "0.78rem",
        cursor: "pointer",
        padding: "0.3rem 0.6rem",
        borderRadius: "6px",
        fontFamily: "inherit",
        transition: "color 0.2s, border-color 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#ff6b6b";
        e.currentTarget.style.borderColor = "rgba(255,107,107,0.3)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#555";
        e.currentTarget.style.borderColor = "transparent";
      }}
    >
      delete
    </button>
  );
}