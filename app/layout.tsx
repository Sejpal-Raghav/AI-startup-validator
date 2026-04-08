import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Startup Validator",
  description: "Validate your startup idea with AI",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav style={{ borderBottom: "1px solid #1f1f1f" }} className="px-8 py-4 flex items-center justify-between">
          <a href="/" style={{ color: "#f5c518", fontWeight: 700, fontSize: "1.1rem", letterSpacing: "-0.5px" }}>
            ValidateAI
          </a>
          <a href="/dashboard" style={{ color: "#999", fontSize: "0.9rem" }} className="hover:text-white transition-colors">
            Dashboard →
          </a>
        </nav>
        <main className="px-8 py-10 max-w-4xl mx-auto">
          {children}
        </main>
      </body>
    </html>
  );
}