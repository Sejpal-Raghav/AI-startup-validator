import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ValidateAI",
  description: "Validate your startup idea with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className} style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Navbar />
        <main style={{ padding: "2.5rem 2rem", maxWidth: "760px", margin: "0 auto", width: "100%", flex: 1 }}>
          {children}
        </main>
        <footer style={{ textAlign: "center", padding: "1.5rem", borderTop: "1px solid var(--border)", fontSize: "0.72rem", color: "var(--text-muted)" }}>
          Raghav Sejpal · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}