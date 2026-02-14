import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceDot } from "recharts";
import type { SimData } from "@/hooks/useProjectileSimulation";

export default function HeightChart({ data }: { data: SimData }) {
  const sampled = data.trajectory.filter((_, i) => i % 3 === 0 || i === data.trajectory.length - 1);

  // Find peak point
  const peak = sampled.reduce((max, p) => (p.y > max.y ? p : max), { x: 0, y: 0, t: 0 });

  return (
    <div className="glass-panel p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height vs Time</h2>
      <div className="h-44">
        {sampled.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampled}>
              <defs>
                <linearGradient id="heightGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 89%)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "hsl(220 10% 46%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} label={{ value: "h (m)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(220 10% 46%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(0 0% 100% / 0.95)", border: "1px solid hsl(220 13% 89%)", borderRadius: "12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                labelStyle={{ color: "hsl(220 10% 46%)" }}
              />
              <Line type="monotone" dataKey="y" stroke="url(#heightGrad)" strokeWidth={2.5} dot={false} animationDuration={300} />
              {peak.y > 0 && (
                <ReferenceDot x={peak.t} y={peak.y} r={5} fill="#ec4899" stroke="#fff" strokeWidth={2} />
              )}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Run a simulation to see data
          </div>
        )}
      </div>
    </div>
  );
}
