import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import AtomCanvas from "@/components/simulation/AtomCanvas";

const elements: Record<number, { name: string; symbol: string; protons: number; neutrons: number; electrons: number }> = {
  1: { name: "Lithium-like", symbol: "Li", protons: 3, neutrons: 3, electrons: 2 },
  2: { name: "Boron-like", symbol: "B", protons: 5, neutrons: 5, electrons: 5 },
  3: { name: "Nitrogen-like", symbol: "N", protons: 7, neutrons: 7, electrons: 7 },
};

export default function AtomSimulation() {
  const navigate = useNavigate();
  const [shells, setShells] = useState(2);
  const el = elements[shells];

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      <div className="relative flex-1">
        <button onClick={() => navigate("/chemistry")} className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-card/60 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <AtomCanvas shells={shells} />
      </div>

      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[340px]">
        <div className="glass-panel glow-border flex flex-col gap-5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Atom Explorer</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Electron Shells</span>
              <span className="text-sm font-mono text-primary">{shells}</span>
            </div>
            <Slider min={1} max={3} step={1} value={[shells]} onValueChange={([v]) => setShells(v)} />
          </div>
        </div>

        <div className="glass-panel glow-border space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Element Info</h2>
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-2xl font-bold text-primary">
              {el.symbol}
            </div>
            <div>
              <p className="text-base font-semibold text-foreground">{el.name}</p>
              <p className="text-xs text-muted-foreground">Approximate model</p>
            </div>
          </div>
          {[
            { l: "Protons", v: el.protons, c: "text-destructive" },
            { l: "Neutrons", v: el.neutrons, c: "text-muted-foreground" },
            { l: "Electrons", v: el.electrons, c: "text-primary" },
          ].map((d) => (
            <div key={d.l} className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{d.l}</span>
              <span className={`font-mono text-sm ${d.c}`}>{d.v}</span>
            </div>
          ))}
        </div>

        <div className="glass-panel glow-border space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Legend</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-destructive" /> <span className="text-muted-foreground">Protons (positive)</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-muted-foreground" /> <span className="text-muted-foreground">Neutrons (neutral)</span></div>
            <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-primary" /> <span className="text-muted-foreground">Electrons (negative)</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
