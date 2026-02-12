import { useState, useRef, useCallback } from "react";

export interface PendulumParams {
  length: number;
  gravity: number;
  damping: number;
  initialAngle: number;
}

export interface PendulumData {
  time: number;
  angle: number;
  angularVelocity: number;
  x: number;
  y: number;
  history: { t: number; angle: number }[];
}

const DT = 0.016;

export function usePendulumSimulation() {
  const [params, setParams] = useState<PendulumParams>({
    length: 3,
    gravity: 9.8,
    damping: 0.01,
    initialAngle: 45,
  });

  const [data, setData] = useState<PendulumData>({
    time: 0, angle: 0, angularVelocity: 0, x: 0, y: 0, history: [],
  });

  const [status, setStatus] = useState<"idle" | "running" | "paused">("idle");
  const stateRef = useRef({ theta: 0, omega: 0, t: 0, hist: [] as { t: number; angle: number }[] });
  const rafRef = useRef<number>(0);

  const step = useCallback(() => {
    const s = stateRef.current;
    const { length, gravity, damping } = params;

    const alpha = -(gravity / length) * Math.sin(s.theta) - damping * s.omega;
    s.omega += alpha * DT;
    s.theta += s.omega * DT;
    s.t += DT;

    const angleDeg = (s.theta * 180) / Math.PI;
    s.hist.push({ t: parseFloat(s.t.toFixed(2)), angle: parseFloat(angleDeg.toFixed(2)) });

    const x = length * Math.sin(s.theta);
    const y = -length * Math.cos(s.theta);

    setData({
      time: s.t,
      angle: angleDeg,
      angularVelocity: s.omega,
      x, y,
      history: [...s.hist],
    });

    rafRef.current = requestAnimationFrame(step);
  }, [params]);

  const start = useCallback(() => {
    if (status === "paused") {
      setStatus("running");
      rafRef.current = requestAnimationFrame(step);
      return;
    }
    const theta0 = (params.initialAngle * Math.PI) / 180;
    stateRef.current = { theta: theta0, omega: 0, t: 0, hist: [] };
    setData({ time: 0, angle: params.initialAngle, angularVelocity: 0, x: 0, y: 0, history: [] });
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
    setData({ time: 0, angle: 0, angularVelocity: 0, x: 0, y: 0, history: [] });
    stateRef.current = { theta: 0, omega: 0, t: 0, hist: [] };
  }, []);

  return { params, setParams, data, status, start, pause, reset };
}
