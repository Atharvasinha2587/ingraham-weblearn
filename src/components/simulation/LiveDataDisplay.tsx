import type { SimData } from "@/hooks/useProjectileSimulation";

function DataItem({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-mono text-sm text-foreground">
        {value} <span className="text-xs text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

export default function LiveDataDisplay({ data }: { data: SimData }) {
  return (
    <div className="glass-panel space-y-3 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Live Data</h2>
      <DataItem label="Time" value={data.time.toFixed(2)} unit="s" />
      <DataItem label="Max Height" value={data.maxHeight.toFixed(2)} unit="m" />
      <DataItem label="Range" value={data.range.toFixed(2)} unit="m" />
      <DataItem label="Current Velocity" value={data.currentVelocity.toFixed(2)} unit="m/s" />
    </div>
  );
}
