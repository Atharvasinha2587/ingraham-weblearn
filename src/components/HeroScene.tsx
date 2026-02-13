import { useRef, useEffect, useCallback } from "react";

interface FloatingEquation {
  text: string;
  x: number;
  y: number;
  speed: number;
  opacity: number;
  size: number;
  drift: number;
  phase: number;
}

const EQUATIONS = [
  "E = mc²",
  "F = ma",
  "PV = nRT",
  "∇ × E = -∂B/∂t",
  "ΔG = ΔH - TΔS",
  "λ = h/p",
  "v = u + at",
  "∮ B·dl = μ₀I",
  "a² + b² = c²",
  "∫ f(x)dx",
  "ψ = Ae^(ikx)",
  "s = ut + ½at²",
  "K = ½mv²",
  "ΔS ≥ 0",
  "∇²φ = 0",
  "e^(iπ) + 1 = 0",
  "F = kq₁q₂/r²",
  "pH = -log[H⁺]",
  "T = 2π√(l/g)",
  "dU = δQ - δW",
];

export default function HeroScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const equationsRef = useRef<FloatingEquation[]>([]);
  const animFrameRef = useRef<number>(0);

  const initEquations = useCallback((w: number, h: number) => {
    equationsRef.current = Array.from({ length: 18 }, (_, i) => ({
      text: EQUATIONS[i % EQUATIONS.length],
      x: Math.random() * w,
      y: Math.random() * h,
      speed: 0.15 + Math.random() * 0.3,
      opacity: 0.04 + Math.random() * 0.08,
      size: 12 + Math.random() * 14,
      drift: (Math.random() - 0.5) * 0.3,
      phase: Math.random() * Math.PI * 2,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (equationsRef.current.length === 0) initEquations(canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    let t = 0;
    const animate = () => {
      t += 0.016;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Subtle grid dots
      ctx.fillStyle = "rgba(255,255,255,0.015)";
      const spacing = 60;
      for (let gx = 0; gx < canvas.width; gx += spacing) {
        for (let gy = 0; gy < canvas.height; gy += spacing) {
          ctx.beginPath();
          ctx.arc(gx, gy, 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Floating equations
      for (const eq of equationsRef.current) {
        eq.y -= eq.speed;
        eq.x += eq.drift + Math.sin(t * 0.5 + eq.phase) * 0.15;

        if (eq.y < -40) {
          eq.y = canvas.height + 40;
          eq.x = Math.random() * canvas.width;
        }

        ctx.save();
        ctx.globalAlpha = eq.opacity;
        ctx.font = `${eq.size}px 'Space Grotesk', 'Inter', sans-serif`;
        ctx.fillStyle = "hsl(220, 40%, 70%)";
        ctx.fillText(eq.text, eq.x, eq.y);
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initEquations]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-10"
    />
  );
}
