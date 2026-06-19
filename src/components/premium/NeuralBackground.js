"use client";

import { useEffect, useRef } from "react";

const NODE_COUNT = 72;
const CONNECTION_DIST = 170;
const PULSE_INTERVAL = 170;
const NODE_SPEED = 0.00082;
const PULSE_SPEED_MIN = 0.078;
const PULSE_SPEED_RANGE = 0.072;

export default function NeuralBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    let animId;
    let W, H;

    /* ── build nodes ── */
    const nodes = Array.from({ length: NODE_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * NODE_SPEED,
      vy: (Math.random() - 0.5) * NODE_SPEED,
      r: 1.6 + Math.random() * 2.4,
      baseAlpha: 0.18 + Math.random() * 0.28,
      glowAlpha: 0,
    }));

    /* ── pulses ── */
    const pulses = [];

    function buildEdges() {
      const edges = [];
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = (nodes[i].x - nodes[j].x) * W;
          const dy = (nodes[i].y - nodes[j].y) * H;
          if (Math.sqrt(dx * dx + dy * dy) < CONNECTION_DIST) {
            edges.push([i, j]);
          }
        }
      }
      return edges;
    }

    let edges = [];

    function spawnPulse() {
      if (!edges.length) return;
      const edge = edges[Math.floor(Math.random() * edges.length)];
      const forward = Math.random() > 0.5;
      pulses.push({
        from: forward ? edge[0] : edge[1],
        to: forward ? edge[1] : edge[0],
        t: 0,
        speed: PULSE_SPEED_MIN + Math.random() * PULSE_SPEED_RANGE,
        color: Math.random() > 0.5 ? "#7C3AED" : "#06B6D4",
      });
    }

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      edges = buildEdges();
    }
    resize();
    window.addEventListener("resize", resize);

    const pulseTimer = setInterval(spawnPulse, PULSE_INTERVAL);

    function draw() {
      ctx.clearRect(0, 0, W, H);

      /* connections */
      for (const [i, j] of edges) {
        const nx = nodes[i].x * W, ny = nodes[i].y * H;
        const mx = nodes[j].x * W, my = nodes[j].y * H;
        const dist = Math.sqrt((nx - mx) ** 2 + (ny - my) ** 2);
        const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
        ctx.beginPath();
        ctx.moveTo(nx, ny);
        ctx.lineTo(mx, my);
        ctx.strokeStyle = `rgba(103,232,249,${alpha})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      /* pulses */
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k];
        p.t += p.speed;
        if (p.t >= 1) {
          /* glow landing node */
          nodes[p.to].glowAlpha = 1;
          pulses.splice(k, 1);
          continue;
        }
        const fx = nodes[p.from].x * W, fy = nodes[p.from].y * H;
        const tx = nodes[p.to].x * W,  ty = nodes[p.to].y * H;
        const px = fx + (tx - fx) * p.t;
        const py = fy + (ty - fy) * p.t;

        const grad = ctx.createRadialGradient(px, py, 0, px, py, 9);
        grad.addColorStop(0, p.color + "cc");
        grad.addColorStop(1, p.color + "00");
        ctx.beginPath();
        ctx.arc(px, py, 9, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        /* trail */
        ctx.beginPath();
        ctx.moveTo(fx, fy);
        ctx.lineTo(px, py);
        ctx.strokeStyle = p.color + "44";
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* nodes */
      for (const n of nodes) {
        if (n.glowAlpha > 0) n.glowAlpha = Math.max(0, n.glowAlpha - 0.038);
        const alpha = n.baseAlpha + n.glowAlpha * 0.72;

        if (n.glowAlpha > 0.05) {
          const g = ctx.createRadialGradient(n.x * W, n.y * H, 0, n.x * W, n.y * H, 18);
          g.addColorStop(0, `rgba(103,232,249,${n.glowAlpha * 0.5})`);
          g.addColorStop(1, "rgba(103,232,249,0)");
          ctx.beginPath();
          ctx.arc(n.x * W, n.y * H, 18, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(n.x * W, n.y * H, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(167,139,250,${alpha})`;
        ctx.fill();

        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
        n.x = Math.max(0, Math.min(1, n.x));
        n.y = Math.max(0, Math.min(1, n.y));
      }

      edges = buildEdges();
      animId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(pulseTimer);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.9,
      }}
      aria-hidden="true"
    />
  );
}
