"use client";

import { useState, useEffect } from "react";
import { motion, useSpring } from "framer-motion";

export default function BulbToggle() {
  const [isOn, setIsOn] = useState(false);
  const rotate = useSpring(0, { stiffness: 60, damping: 6, mass: 1 });

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      setIsOn(true);
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  function toggle() {
    rotate.set(40);
    setTimeout(() => rotate.set(-25), 220);
    setTimeout(() => rotate.set(15), 480);
    setTimeout(() => rotate.set(-8), 680);
    setTimeout(() => rotate.set(3), 860);
    setTimeout(() => rotate.set(0), 1000);

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
      <motion.div
        style={{ rotate, transformOrigin: "top center", display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* string */}
        <div style={{ width: "1px", height: "36px", background: "#555" }} />
        {/* knob */}
        <div style={{
          width: "9px",
          height: "9px",
          borderRadius: "50%",
          background: isOn ? "#f5c518" : "#333",
          border: `1px solid ${isOn ? "#f5c518" : "#555"}`,
          boxShadow: isOn ? "0 0 6px #f5c518" : "none",
          transition: "background 0.3s, box-shadow 0.3s",
        }} />
      </motion.div>
    </div>
  );
}