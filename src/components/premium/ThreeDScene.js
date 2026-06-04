"use client";

import { motion } from "framer-motion";

const palette = [
  { accent: "#67E8F9", glow: "rgba(103,232,249,0.34)" },
  { accent: "#A78BFA", glow: "rgba(167,139,250,0.30)" },
  { accent: "#22D3EE", glow: "rgba(34,211,238,0.32)" },
  { accent: "#34D399", glow: "rgba(52,211,153,0.28)" },
  { accent: "#F472B6", glow: "rgba(244,114,182,0.26)" },
  { accent: "#FBBF24", glow: "rgba(251,191,36,0.22)" },
];

const techMarks = [
  "AI", "ML", "API", "GPT", "NLP", "CV", "RAG", "LLM", "DATA", "GPU",
  "SQL", "JS", "TS", "PY", "NODE", "CLOUD", "DEV", "OPS", "SEC", "UX",
];

const icons = ["chip", "brain", "flow", "code", "scan", "bolt"];

const TechGlyph = ({ type }) => {
  switch (type) {
    case "brain":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M24 13c-6 0-10 4-10 10v18c0 6 4 10 10 10h16c6 0 10-4 10-10V23c0-6-4-10-10-10H24Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M22 27h20M22 38h20M30 19v26M42 24v16" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <path d="M18 23h-7M18 41h-7M46 23h7M46 41h7" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        </svg>
      );
    case "flow":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M12 18h12v12H12V18ZM40 10h12v12H40V10ZM40 42h12v12H40V42Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M24 24h8c6 0 9-8 8-8M24 24h8c6 0 9 24 8 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        </svg>
      );
    case "code":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M24 19 12 32l12 13M40 19l12 13-12 13M35 15 29 49" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="square" />
        </svg>
      );
    case "scan":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M16 22v-8h8M40 14h8v8M48 42v8h-8M24 50h-8v-8M18 32h28" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" />
          <path d="M22 25h20M22 39h14" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
        </svg>
      );
    case "bolt":
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M36 6 15 36h16l-3 22 21-31H34l2-21Z" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="miter" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 64 64" aria-hidden="true">
          <path d="M18 18h28v28H18V18Z" fill="none" stroke="currentColor" strokeWidth="4" />
          <path d="M26 10v8M38 10v8M26 46v8M38 46v8M10 26h8M10 38h8M46 26h8M46 38h8" stroke="currentColor" strokeWidth="3" strokeLinecap="square" />
          <path d="M27 27h10v10H27V27Z" fill="currentColor" />
        </svg>
      );
  }
};

const buildParticles = (variant) => {
  const count = variant === "dashboard" ? 30 : 34;

  return Array.from({ length: count }, (_, index) => {
    const color = palette[index % palette.length];
    const isChip = index % 3 === 0;
    const isBeam = index % 6 === 0;
    const size = isChip ? 60 + (index % 3) * 10 : isBeam ? 90 + (index % 4) * 18 : 28 + (index % 3) * 7;
    const topBand = 4 + ((index * 11) % 26);
    const bottomBand = 70 + ((index * 7) % 22);
    const leftBand = 2 + ((index * 5) % 22);
    const rightBand = 76 + ((index * 9) % 20);
    const innerX = 12 + ((index * 13) % 76);
    const innerY = index % 2 === 0 ? topBand : bottomBand;
    const side = index % 4;
    const pathMap = [
      { x: ["-12vw", `${leftBand}vw`, `${innerX}vw`, "112vw"], y: [`${bottomBand}vh`, `${innerY}vh`, `${topBand}vh`, `${topBand + 8}vh`] },
      { x: ["112vw", `${rightBand}vw`, `${100 - innerX}vw`, "-12vw"], y: [`${topBand}vh`, `${innerY}vh`, `${bottomBand}vh`, `${bottomBand - 8}vh`] },
      { x: [`${leftBand}vw`, `${innerX}vw`, `${rightBand}vw`, `${rightBand - 5}vw`], y: ["-12vh", `${topBand}vh`, `${bottomBand}vh`, "112vh"] },
      { x: [`${rightBand}vw`, `${100 - innerX}vw`, `${leftBand}vw`, `${leftBand + 5}vw`], y: ["112vh", `${bottomBand}vh`, `${topBand}vh`, "-12vh"] },
    ];

    return {
      id: `${techMarks[index % techMarks.length]}-${index}`,
      label: techMarks[index % techMarks.length],
      icon: icons[index % icons.length],
      className: isBeam ? "ai-particle ai-particle--beam" : isChip ? "ai-particle ai-particle--chip" : "ai-particle ai-particle--node",
      size,
      path: pathMap[side],
      color,
      duration: 34 + (index % 9) * 3.6,
      delay: -(index * 2.1) % 34,
      rotate: (index % 2 === 0 ? 1 : -1) * (3 + (index % 5) * 3),
      opacity: isBeam ? 0.34 : 0.48 + (index % 4) * 0.06,
    };
  });
};

const ThreeDScene = ({ variant = "login", className = "" }) => {
  const particles = buildParticles(variant);

  return (
    <div className={`ai-particle-field ai-particle-field--${variant} ${className}`} aria-hidden="true">
      <div className="ai-depth-grid" />
      <div className="ai-scan-line ai-scan-line--one" />
      <div className="ai-scan-line ai-scan-line--two" />
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={particle.className}
          style={{
            "--particle-size": `${particle.size}px`,
            "--particle-accent": particle.color.accent,
            "--particle-glow": particle.color.glow,
            "--particle-opacity": particle.opacity,
          }}
          initial={{
            x: particle.path.x[0],
            y: particle.path.y[0],
            rotateZ: 0,
            scale: 0.9,
          }}
          animate={{
            x: particle.path.x,
            y: particle.path.y,
            rotateZ: [0, particle.rotate, -particle.rotate * 0.4, 0],
            scale: [0.9, 1.04, 0.96, 0.9],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "linear",
            delay: particle.delay,
          }}
        >
          {particle.className.includes("beam") ? (
            <span />
          ) : (
            <>
              <TechGlyph type={particle.icon} />
              {particle.className.includes("chip") && <strong>{particle.label}</strong>}
            </>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default ThreeDScene;
