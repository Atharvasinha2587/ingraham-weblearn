import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Beaker, FlaskConical, TestTube, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Chemical dataset
const CHEMICALS = [
  { name: "Water", formula: "H₂O", density: 1.0, color: "hsl(200 70% 70%)", opacity: 0.4 },
  { name: "Sulfuric Acid", formula: "H₂SO₄", density: 1.84, color: "hsl(50 80% 55%)", opacity: 0.6 },
  { name: "Mercury", formula: "Hg", density: 13.6, color: "hsl(220 20% 50%)", opacity: 0.9 },
  { name: "Ethanol", formula: "C₂H₅OH", density: 0.789, color: "hsl(30 60% 80%)", opacity: 0.35 },
  { name: "Glycerin", formula: "C₃H₈O₃", density: 1.261, color: "hsl(45 40% 75%)", opacity: 0.5 },
  { name: "Hydrochloric Acid", formula: "HCl", density: 1.18, color: "hsl(120 40% 65%)", opacity: 0.45 },
  { name: "Olive Oil", formula: "Mixed", density: 0.92, color: "hsl(55 70% 50%)", opacity: 0.7 },
  { name: "Honey", formula: "Mixed", density: 1.42, color: "hsl(35 80% 45%)", opacity: 0.85 },
  { name: "Acetone", formula: "C₃H₆O", density: 0.784, color: "hsl(200 30% 85%)", opacity: 0.3 },
  { name: "Bromine", formula: "Br₂", density: 3.12, color: "hsl(15 70% 40%)", opacity: 0.8 },
];

type GlasswareType = "beaker" | "conical" | "test-tube" | "graduated" | "volumetric" | "burette";

const GLASSWARE: { type: GlasswareType; label: string; maxVolume: number }[] = [
  { type: "beaker", label: "Beaker", maxVolume: 500 },
  { type: "conical", label: "Conical Flask", maxVolume: 300 },
  { type: "test-tube", label: "Test Tube", maxVolume: 50 },
  { type: "graduated", label: "Graduated Cylinder", maxVolume: 250 },
  { type: "volumetric", label: "Volumetric Flask", maxVolume: 500 },
  { type: "burette", label: "Burette", maxVolume: 100 },
];

interface AddedChemical {
  chemical: typeof CHEMICALS[0];
  volume: number;
}

function GlasswareSVG({ type, chemicals, maxVolume }: { type: GlasswareType; chemicals: AddedChemical[]; maxVolume: number }) {
  const totalVolume = chemicals.reduce((s, c) => s + c.volume, 0);
  const fillPercent = Math.min(totalVolume / maxVolume, 1);

  // Sort by density (heaviest at bottom)
  const sorted = [...chemicals].sort((a, b) => b.chemical.density - a.chemical.density);
  let yOffset = 0;

  return (
    <svg viewBox="0 0 200 300" className="w-full h-full max-h-[280px]">
      {/* Glass outline */}
      {type === "beaker" && (
        <>
          <rect x="40" y="40" width="120" height="220" rx="4" fill="none" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          <line x1="40" y1="40" x2="30" y2="30" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          {/* Markings */}
          {[0.25, 0.5, 0.75].map((m, i) => (
            <g key={i}>
              <line x1="40" y1={260 - m * 220} x2="55" y2={260 - m * 220} stroke="hsl(220 13% 80%)" strokeWidth="1" />
              <text x="58" y={264 - m * 220} fontSize="8" fill="hsl(220 10% 60%)">{Math.round(m * maxVolume)}ml</text>
            </g>
          ))}
          {/* Liquid layers */}
          {sorted.map((c, i) => {
            const layerHeight = (c.volume / maxVolume) * 220;
            const y = 260 - yOffset - layerHeight;
            yOffset += layerHeight;
            return (
              <motion.rect
                key={i}
                x="42" width="116" rx="2"
                initial={{ height: 0, y: 260 }}
                animate={{ height: layerHeight, y }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                fill={c.chemical.color}
                opacity={c.chemical.opacity}
              />
            );
          })}
        </>
      )}
      {type === "conical" && (
        <>
          <path d="M70 40 L40 260 L160 260 L130 40 Z" fill="none" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          <line x1="90" y1="40" x2="110" y2="40" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          {sorted.map((c, i) => {
            const layerHeight = (c.volume / maxVolume) * 220;
            const y = 260 - yOffset - layerHeight;
            yOffset += layerHeight;
            const topW = 40 + (120 * (260 - y)) / 220;
            const botW = 40 + (120 * (260 - y + layerHeight)) / 220;
            const topX = 100 - topW / 2;
            const botX = 100 - botW / 2;
            return (
              <motion.path
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: c.chemical.opacity }}
                transition={{ duration: 0.8 }}
                d={`M${topX} ${y} L${botX} ${y + layerHeight} L${botX + botW} ${y + layerHeight} L${topX + topW} ${y} Z`}
                fill={c.chemical.color}
              />
            );
          })}
        </>
      )}
      {type === "test-tube" && (
        <>
          <path d="M80 30 L80 230 Q80 270 100 270 Q120 270 120 230 L120 30" fill="none" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          {sorted.map((c, i) => {
            const layerHeight = (c.volume / maxVolume) * 240;
            const y = 270 - yOffset - layerHeight;
            yOffset += layerHeight;
            return (
              <motion.rect
                key={i}
                x="82" width="36" rx="2"
                initial={{ height: 0, y: 268 }}
                animate={{ height: Math.min(layerHeight, 238), y: Math.max(y, 32) }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                fill={c.chemical.color}
                opacity={c.chemical.opacity}
              />
            );
          })}
        </>
      )}
      {(type === "graduated" || type === "volumetric" || type === "burette") && (
        <>
          <rect x="75" y="30" width="50" height="240" rx="4" fill="none" stroke="hsl(220 13% 75%)" strokeWidth="2" />
          {[0.2, 0.4, 0.6, 0.8].map((m, i) => (
            <g key={i}>
              <line x1="75" y1={270 - m * 240} x2="85" y2={270 - m * 240} stroke="hsl(220 13% 80%)" strokeWidth="1" />
              <text x="63" y={274 - m * 240} fontSize="7" fill="hsl(220 10% 60%)" textAnchor="end">{Math.round(m * maxVolume)}</text>
            </g>
          ))}
          {sorted.map((c, i) => {
            const layerHeight = (c.volume / maxVolume) * 240;
            const y = 270 - yOffset - layerHeight;
            yOffset += layerHeight;
            return (
              <motion.rect
                key={i}
                x="77" width="46" rx="2"
                initial={{ height: 0, y: 268 }}
                animate={{ height: layerHeight, y }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                fill={c.chemical.color}
                opacity={c.chemical.opacity}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}

export default function ChemistryLabSimulation() {
  const navigate = useNavigate();
  const [selectedGlassware, setSelectedGlassware] = useState<GlasswareType>("beaker");
  const [addedChemicals, setAddedChemicals] = useState<AddedChemical[]>([]);
  const [pouringIdx, setPouringIdx] = useState<number | null>(null);
  const [volumeToAdd, setVolumeToAdd] = useState(50);

  const glassware = GLASSWARE.find((g) => g.type === selectedGlassware)!;
  const totalVolume = addedChemicals.reduce((s, c) => s + c.volume, 0);
  const remainingCapacity = glassware.maxVolume - totalVolume;

  const mixedDensity = useMemo(() => {
    if (addedChemicals.length === 0) return 0;
    const totalMass = addedChemicals.reduce((s, c) => s + c.volume * c.chemical.density, 0);
    return totalMass / totalVolume;
  }, [addedChemicals, totalVolume]);

  const addChemical = (chemIdx: number) => {
    const chem = CHEMICALS[chemIdx];
    const vol = Math.min(volumeToAdd, remainingCapacity);
    if (vol <= 0) return;
    setPouringIdx(chemIdx);
    setTimeout(() => setPouringIdx(null), 800);
    setAddedChemicals((prev) => [...prev, { chemical: chem, volume: vol }]);
  };

  const resetExperiment = () => {
    setAddedChemicals([]);
  };

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-secondary/20 lg:flex-row">
      {/* Main visualization */}
      <div className="relative flex flex-1 items-center justify-center p-8">
        <button onClick={() => navigate("/chemistry")} className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md border border-border/60 shadow-sm transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="flex flex-col items-center gap-6">
          {/* Pouring animation */}
          <AnimatePresence>
            {pouringIdx !== null && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm font-medium text-primary"
              >
                Adding {CHEMICALS[pouringIdx].name}...
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-48 h-72">
            <GlasswareSVG type={selectedGlassware} chemicals={addedChemicals} maxVolume={glassware.maxVolume} />
          </div>

          <p className="text-sm text-muted-foreground">{glassware.label} ({glassware.maxVolume} ml capacity)</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[380px]">
        {/* Glassware selector */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Glassware</h2>
          <div className="grid grid-cols-3 gap-2">
            {GLASSWARE.map((g) => (
              <button
                key={g.type}
                onClick={() => { setSelectedGlassware(g.type); resetExperiment(); }}
                className={`rounded-xl p-2.5 text-center text-xs font-medium transition-all border ${
                  selectedGlassware === g.type
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border bg-card text-muted-foreground hover:border-primary/30"
                }`}
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>

        {/* Volume */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Volume to Add</h2>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="font-mono text-sm text-primary">{volumeToAdd} ml</span>
          </div>
          <input
            type="range"
            min={5}
            max={Math.max(5, remainingCapacity)}
            value={Math.min(volumeToAdd, Math.max(5, remainingCapacity))}
            onChange={(e) => setVolumeToAdd(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </div>

        {/* Chemicals */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Chemicals</h2>
          <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto pr-1">
            {CHEMICALS.map((chem, i) => (
              <button
                key={chem.name}
                onClick={() => addChemical(i)}
                disabled={remainingCapacity <= 0}
                className="flex items-center gap-2 rounded-xl border border-border bg-card p-2.5 text-left transition-all hover:border-primary/30 hover:shadow-sm disabled:opacity-40"
              >
                <div className="h-4 w-4 rounded-full flex-shrink-0" style={{ backgroundColor: chem.color, opacity: chem.opacity }} />
                <div>
                  <p className="text-xs font-medium text-foreground">{chem.name}</p>
                  <p className="text-[10px] text-muted-foreground">{chem.formula} · ρ={chem.density}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Results</h2>
          <div className="space-y-2">
            {[
              { l: "Total Volume", v: `${totalVolume.toFixed(1)} ml` },
              { l: "Remaining Capacity", v: `${remainingCapacity.toFixed(1)} ml` },
              { l: "Mixed Density", v: totalVolume > 0 ? `${mixedDensity.toFixed(3)} g/cm³` : "—" },
              { l: "Total Mass", v: totalVolume > 0 ? `${(mixedDensity * totalVolume).toFixed(1)} g` : "—" },
              { l: "Layers", v: addedChemicals.length },
            ].map((d) => (
              <div key={d.l} className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{d.l}</span>
                <span className="font-mono text-sm text-foreground">{d.v}</span>
              </div>
            ))}
          </div>
          <button
            onClick={resetExperiment}
            className="w-full mt-2 rounded-xl border border-border bg-card px-4 py-2 text-xs font-medium text-muted-foreground transition-all hover:text-foreground hover:-translate-y-0.5"
          >
            Reset Experiment
          </button>
        </div>

        {/* Added chemicals list */}
        {addedChemicals.length > 0 && (
          <div className="glass-panel p-5 space-y-3">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Added</h2>
            <div className="space-y-1.5">
              {addedChemicals.map((c, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <div className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: c.chemical.color }} />
                  <span className="text-muted-foreground">{c.chemical.name}</span>
                  <span className="ml-auto font-mono text-foreground">{c.volume} ml</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
