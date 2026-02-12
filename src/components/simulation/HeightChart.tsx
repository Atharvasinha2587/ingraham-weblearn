import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import type { SimData } from "@/hooks/useProjectileSimulation";

export default function HeightChart({ data }: { data: SimData }) {
  // Sample every Nth point to keep chart performant
  const sampled = data.trajectory.filter((_, i) => i % 3 === 0 || i === data.trajectory.length - 1);

  return (
    <div className="glass-panel glow-border p-5">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Height vs Time</h2>
      <div className="h-40">
        {sampled.length > 1 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sampled}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 20% 16%)" />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} label={{ value: "t (s)", position: "insideBottomRight", offset: -5, fontSize: 10, fill: "hsl(215 15% 55%)" }} />
              <YAxis tick={{ fontSize: 10, fill: "hsl(215 15% 55%)" }} label={{ value: "h (m)", angle: -90, position: "insideLeft", fontSize: 10, fill: "hsl(215 15% 55%)" }} />
              <Tooltip
                contentStyle={{ background: "hsl(220 20% 8% / 0.9)", border: "1px solid hsl(220 20% 16%)", borderRadius: "8px", fontSize: 12 }}
                labelStyle={{ color: "hsl(215 15% 55%)" }}
              />
              <Line type="monotone" dataKey="y" stroke="hsl(185 80% 55%)" strokeWidth={2} dot={false} />
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
