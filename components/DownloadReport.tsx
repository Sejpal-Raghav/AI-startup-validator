"use client";

export default function DownloadReport({ title }: { title: string }) {
  async function download() {
    const html2pdf = (await import("html2pdf.js")).default;
    const element = document.getElementById("report-content");
    html2pdf(element, {
      margin: 0.5,
      filename: `${title.replace(/\s+/g, "-").toLowerCase()}-report.pdf`,
      html2canvas: { scale: 2, backgroundColor: "#ffffff" },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" },
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