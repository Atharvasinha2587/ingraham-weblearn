import { useNavigate } from "react-router-dom";
import { ArrowLeft, Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RTooltip } from "recharts";
import { usePendulumSimulation } from "@/hooks/usePendulumSimulation";
import PendulumCanvas from "@/components/simulation/PendulumCanvas";

export default function PendulumSimulation() {
  const navigate = useNavigate();
  const { params, setParams, data, status, start, pause, reset } = usePendulumSimulation();
  const running = status === "running";
  const sampled = data.history.filter((_, i) => i % 3 === 0 || i === data.history.length - 1);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-secondary/20 lg:flex-row">
      <div className="relative flex-1">
        <button onClick={() => navigate("/physics")} className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md border border-border/60 shadow-sm transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <PendulumCanvas data={data} params={params} />
      </div>

      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[340px]">
        <div className="glass-panel flex flex-col gap-5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Controls</h2>
          {[
            { label: "Length", tip: "Pendulum string length", value: params.length, min: 1, max: 8, step: 0.1, unit: "m", key: "length" as const },
            { label: "Gravity", tip: "Gravitational acceleration", value: params.gravity, min: 1, max: 20, step: 0.1, unit: "m/s²", key: "gravity" as const },
            { label: "Damping", tip: "Energy loss per swing", value: params.damping, min: 0, max: 0.5, step: 0.01, unit: "", key: "damping" as const },
            { label: "Initial Angle", tip: "Starting angle from vertical", value: params.initialAngle, min: 5, max: 90, step: 1, unit: "°", key: "initialAngle" as const },
          ].map((s) => (
            <div key={s.key} className="space-y-2">
              <div className="flex items-center justify-between">
                <Tooltip><TooltipTrigger asChild><span className="text-sm font-medium text-muted-foreground cursor-help">{s.label}</span></TooltipTrigger><TooltipContent side="left"><p className="text-xs">{s.tip}</p></TooltipContent></Tooltip>
                <span className="text-sm font-mono text-primary">{s.value} {s.unit}</span>
              </div>
              <Slider min={s.min} max={s.max} step={s.step} value={[s.value]} onValueChange={([v]) => setParams((p) => ({ ...p, [s.key]: v }))} disabled={running} />
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            {status !== "running" ? (
              <button onClick={start} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
                <Play className="h-4 w-4" /> {status === "paused" ? "Resume" : "Start"}
              </button>
            ) : (
              <button onClick={pause} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:-translate-y-0.5">
                <Pause className="h-4 w-4" /> Pause
              </button>
            )}
            <button onClick={reset} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:-translate-y-0.5">
              <RotateCcw className="h-4 w-4" /> Reset
            </button>
          </div>
        </div>

        <div className="glass-panel space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Data</h2>
          {[
            { l: "Time", v: data.time.toFixed(2), u: "s" },
            { l: "Angle", v: data.angle.toFixed(2), u: "°" },
            { l: "Angular Velocity", v: data.angularVelocity.toFixed(3), u: "rad/s" },
          ].map((d) => (
            <div key={d.l} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{d.l}</span>
              <span className="font-mono text-sm text-foreground">{d.v} <span className="text-xs text-muted-foreground">{d.u}</span></span>
            </div>
          ))}
        </div>

        <div className="glass-panel space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Equations</h2>
          <div className="space-y-1 font-mono text-xs text-foreground/80">
            <p>α = −(g/L)·sin(θ) − b·ω</p>
            <p>L = <span className="text-primary">{params.length}</span> m, g = <span className="text-primary">{params.gravity}</span> m/s²</p>
            <p>T ≈ 2π√(L/g) = <span className="text-primary">{(2 * Math.PI * Math.sqrt(params.length / params.gravity)).toFixed(2)}</span> s</p>
          </div>
        </div>

        <div className="glass-panel p-5">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">Angle vs Time</h2>
          <div className="h-44">
            {sampled.length > 1 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sampled}>
                  <defs>
                    <linearGradient id="pendGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 13% 89%)" />
                  <XAxis dataKey="t" tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "hsl(220 10% 46%)" }} />
                  <RTooltip contentStyle={{ background: "hsl(0 0% 100% / 0.95)", border: "1px solid hsl(220 13% 89%)", borderRadius: "12px", fontSize: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }} />
                  <Line type="monotone" dataKey="angle" stroke="url(#pendGrad)" strokeWidth={2.5} dot={false} animationDuration={300} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Run simulation to see data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
