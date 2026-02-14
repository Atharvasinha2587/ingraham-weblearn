import { Play, Pause, RotateCcw } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { SimParams } from "@/hooks/useProjectileSimulation";

interface Props {
  params: SimParams;
  setParams: (p: SimParams | ((prev: SimParams) => SimParams)) => void;
  status: "idle" | "running" | "paused";
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

function LabeledSlider({
  label, tooltip, value, min, max, step, unit, onChange, disabled,
}: {
  label: string; tooltip: string; value: number; min: number; max: number; step: number; unit: string;
  onChange: (v: number) => void; disabled?: boolean;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium text-muted-foreground cursor-help">{label}</span>
          </TooltipTrigger>
          <TooltipContent side="left"><p className="text-xs">{tooltip}</p></TooltipContent>
        </Tooltip>
        <span className="text-sm font-mono text-primary">{value} {unit}</span>
      </div>
      <Slider
        min={min} max={max} step={step} value={[value]}
        onValueChange={([v]) => onChange(v)}
        disabled={disabled}
        className="w-full"
      />
    </div>
  );
}

export default function ControlsPanel({ params, setParams, status, onStart, onPause, onReset }: Props) {
  const running = status === "running";
  const disabled = running;

  return (
    <div className="glass-panel flex flex-col gap-5 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Controls</h2>

      <LabeledSlider
        label="Initial Velocity" tooltip="Launch speed of the projectile"
        value={params.velocity} min={0} max={100} step={1} unit="m/s"
        onChange={(v) => setParams((p) => ({ ...p, velocity: v }))} disabled={disabled}
      />
      <LabeledSlider
        label="Launch Angle" tooltip="Angle above the horizontal"
        value={params.angle} min={0} max={90} step={1} unit="°"
        onChange={(v) => setParams((p) => ({ ...p, angle: v }))} disabled={disabled}
      />
      <LabeledSlider
        label="Gravity" tooltip="Gravitational acceleration"
        value={params.gravity} min={1} max={20} step={0.1} unit="m/s²"
        onChange={(v) => setParams((p) => ({ ...p, gravity: v }))} disabled={disabled}
      />

      <div className="flex items-center justify-between">
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium text-muted-foreground cursor-help">Air Resistance</span>
          </TooltipTrigger>
          <TooltipContent side="left"><p className="text-xs">Applies a drag force proportional to v²</p></TooltipContent>
        </Tooltip>
        <Switch
          checked={params.airResistance}
          onCheckedChange={(v) => setParams((p) => ({ ...p, airResistance: v }))}
          disabled={disabled}
        />
      </div>

      <div className="flex gap-2 pt-2">
        {status !== "running" ? (
          <button onClick={onStart} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:-translate-y-0.5">
            <Play className="h-4 w-4" /> {status === "paused" ? "Resume" : "Start"}
          </button>
        ) : (
          <button onClick={onPause} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-secondary-foreground transition-all hover:-translate-y-0.5">
            <Pause className="h-4 w-4" /> Pause
          </button>
        )}
        <button onClick={onReset} className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:-translate-y-0.5">
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
