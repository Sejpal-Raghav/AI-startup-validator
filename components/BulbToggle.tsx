"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function BulbToggle() {
  const [isOn, setIsOn] = useState(false);
  const rotate = useSpring(0, { stiffness: 300, damping: 8 });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsOn(true);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggle() {
    rotate.set(25);
    setTimeout(() => rotate.set(-12), 150);
    setTimeout(() => rotate.set(6), 300);
    setTimeout(() => rotate.set(0), 450);

    const next = !isOn;
    setIsOn(next);
    document.documentElement.setAttribute("data-theme", next ? "light" : "dark");
    localStorage.setItem("theme", next ? "light" : "dark");
  }

  return (
    <div
      onClick={toggle}
      title={isOn ? "lights off" : "lights on"}
      style={{ display: "flex", flexDirection: "column", alignItems: "center", cursor: "pointer", userSelect: "none" }}
    >
      <div style={{ width: "1px", height: "14px", background: "#555" }} />
      <motion.div style={{ rotate, transformOrigin: "top center" }}>
        <svg width="18" height="26" viewBox="0 0 18 26" fill="none">
          <path
            d="M9 1C5.69 1 3 3.69 3 7c0 2.1 1.04 3.96 2.63 5.1L6 14h6l.37-1.9C13.96 10.96 15 9.1 15 7c0-3.31-2.69-6-6-6z"
            fill={isOn ? "#f5c518" : "var(--bg-card)"}
            stroke="var(--border)"
            strokeWidth="1"
          />
          {isOn && (
            <path
              d="M9 1C5.69 1 3 3.69 3 7c0 2.1 1.04 3.96 2.63 5.1L6 14h6l.37-1.9C13.96 10.96 15 9.1 15 7c0-3.31-2.69-6-6-6z"
              fill="#f5c518"
              opacity="0.35"
            />
          )}
          <rect x="6" y="14" width="6" height="2" rx="0.5" fill="var(--border)" />
          <rect x="6.5" y="16" width="5" height="1.5" rx="0.5" fill="var(--border)" />
          <rect x="7" y="17.5" width="4" height="1.5" rx="0.5" fill="var(--border)" />
        </svg>
      </motion.div>
    </div>
  );
}