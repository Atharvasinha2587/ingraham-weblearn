import type { SimParams } from "@/hooks/useProjectileSimulation";

export default function FormulaBox({ params }: { params: SimParams }) {
  const vx = (params.velocity * Math.cos(params.angle * Math.PI / 180)).toFixed(1);
  const vy = (params.velocity * Math.sin(params.angle * Math.PI / 180)).toFixed(1);

  return (
    <div className="glass-panel space-y-3 p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Equations</h2>
      <div className="space-y-2 font-mono text-xs text-foreground/80">
        <p>v₀ = {params.velocity} m/s, θ = {params.angle}°</p>
        <p>vₓ = v₀·cos(θ) = <span className="text-primary">{vx}</span> m/s</p>
        <p>vᵧ = v₀·sin(θ) = <span className="text-primary">{vy}</span> m/s</p>
        <p>x(t) = vₓ · t</p>
        <p>y(t) = vᵧ·t − ½g·t²</p>
        <p>g = {params.gravity} m/s²</p>
      </div>
    </div>
  );
}
