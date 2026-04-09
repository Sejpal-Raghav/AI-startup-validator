"use client";

export default function DownloadReport({ title }: { title: string }) {
  async function download() {
    const element = document.getElementById("report-content");
    if (!element) return;

    const mod = await import("html2pdf.js");
    const html2pdf = mod.default ?? mod;

    const original = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "light");

    await new Promise((res) => setTimeout(res, 150));

    html2pdf()
      .set({
        margin: 0.5,
        filename: `${title.replace(/\s+/g, "-").toLowerCase()}-report.pdf`,
        html2canvas: { scale: 2, backgroundColor: "#f7f3eb", useCORS: true },
        jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
      })
      .from(element)
      .save()
      .then(() => {
        if (original) document.documentElement.setAttribute("data-theme", original);
        else document.documentElement.removeAttribute("data-theme");
      });
  }

  return (
    <button
      onClick={download}
      style={{
        background: "transparent",
        border: "1px solid var(--border)",
        borderRadius: "8px",
        padding: "0.55rem 1.1rem",
        color: "var(--text-muted)",
        fontSize: "0.82rem",
        cursor: "pointer",
        fontFamily: "inherit",
        transition: "border-color 0.2s, color 0.2s",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--accent)";
        e.currentTarget.style.color = "var(--accent)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.color = "var(--text-muted)";
      }}
    >
      ↓ download pdf
    </button>
  );
}