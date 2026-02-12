import { useState, useRef, useCallback } from "react";

export interface SimParams {
  velocity: number;
  angle: number;
  gravity: number;
  airResistance: boolean;
}

export interface SimData {
  time: number;
  maxHeight: number;
  range: number;
  currentVelocity: number;
  x: number;
  y: number;
  trajectory: { x: number; y: number; t: number }[];
}

const DRAG = 0.02;
const DT = 0.016;

export function useProjectileSimulation() {
  const [params, setParams] = useState<SimParams>({
    velocity: 30,
    angle: 45,
    gravity: 9.8,
    airResistance: false,
  });

  const [data, setData] = useState<SimData>({
    time: 0, maxHeight: 0, range: 0, currentVelocity: 0, x: 0, y: 0, trajectory: [],
  });

  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const stateRef = useRef({ vx: 0, vy: 0, x: 0, y: 0, t: 0, maxH: 0, traj: [] as { x: number; y: number; t: number }[] });
  const rafRef = useRef<number>(0);

  const step = useCallback(() => {
    const s = stateRef.current;
    const { gravity, airResistance } = params;

    let ax = 0, ay = -gravity;
    if (airResistance) {
      const speed = Math.sqrt(s.vx ** 2 + s.vy ** 2);
      ax -= DRAG * speed * s.vx;
      ay -= DRAG * speed * s.vy;
    }

    s.vx += ax * DT;
    s.vy += ay * DT;
    s.x += s.vx * DT;
    s.y += s.vy * DT;
    s.t += DT;

    if (s.y > s.maxH) s.maxH = s.y;
    s.traj.push({ x: s.x, y: Math.max(0, s.y), t: parseFloat(s.t.toFixed(2)) });

    if (s.y <= 0 && s.t > 0.1) {
      s.y = 0;
      const cv = Math.sqrt(s.vx ** 2 + s.vy ** 2);
      setData({
        time: s.t, maxHeight: s.maxH, range: s.x, currentVelocity: cv,
        x: s.x, y: 0, trajectory: [...s.traj],
      });
      setStatus("idle");
      return;
    }

    const cv = Math.sqrt(s.vx ** 2 + s.vy ** 2);
    setData({
      time: s.t, maxHeight: s.maxH, range: s.x, currentVelocity: cv,
      x: s.x, y: s.y, trajectory: [...s.traj],
    });

    rafRef.current = requestAnimationFrame(step);
  }, [params]);

  const start = useCallback(() => {
    if (status === "paused") {
      setStatus("running");
      rafRef.current = requestAnimationFrame(step);
      return;
    }
    const rad = (params.angle * Math.PI) / 180;
    stateRef.current = {
      vx: params.velocity * Math.cos(rad),
      vy: params.velocity * Math.sin(rad),
      x: 0, y: 0.01, t: 0, maxH: 0, traj: [],
    };
    setData({ time: 0, maxHeight: 0, range: 0, currentVelocity: params.velocity, x: 0, y: 0, trajectory: [] });
    setStatus("running");
    rafRef.current = requestAnimationFrame(step);
  }, [params, status, step]);

  const pause = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setStatus("paused");
  }, []);

  const reset = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    setStatus("idle");
    setData({ time: 0, maxHeight: 0, range: 0, currentVelocity: 0, x: 0, y: 0, trajectory: [] });
    stateRef.current = { vx: 0, vy: 0, x: 0, y: 0, t: 0, maxH: 0, traj: [] };
  }, []);

  return { params, setParams, data, status, start, pause, reset };
}
