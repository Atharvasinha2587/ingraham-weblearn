import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import AtomCanvas from "@/components/simulation/AtomCanvas";

// Periodic table data (first 36 elements)
const ELEMENTS = [
  { z: 1, symbol: "H", name: "Hydrogen", mass: 1.008, group: 1, period: 1, density: 0.00009, shells: 1, category: "nonmetal" },
  { z: 2, symbol: "He", name: "Helium", mass: 4.003, group: 18, period: 1, density: 0.00018, shells: 1, category: "noble-gas" },
  { z: 3, symbol: "Li", name: "Lithium", mass: 6.941, group: 1, period: 2, density: 0.534, shells: 2, category: "alkali-metal" },
  { z: 4, symbol: "Be", name: "Beryllium", mass: 9.012, group: 2, period: 2, density: 1.85, shells: 2, category: "alkaline-earth" },
  { z: 5, symbol: "B", name: "Boron", mass: 10.81, group: 13, period: 2, density: 2.34, shells: 2, category: "metalloid" },
  { z: 6, symbol: "C", name: "Carbon", mass: 12.011, group: 14, period: 2, density: 2.267, shells: 2, category: "nonmetal" },
  { z: 7, symbol: "N", name: "Nitrogen", mass: 14.007, group: 15, period: 2, density: 0.00125, shells: 2, category: "nonmetal" },
  { z: 8, symbol: "O", name: "Oxygen", mass: 15.999, group: 16, period: 2, density: 0.00143, shells: 2, category: "nonmetal" },
  { z: 9, symbol: "F", name: "Fluorine", mass: 18.998, group: 17, period: 2, density: 0.0017, shells: 2, category: "halogen" },
  { z: 10, symbol: "Ne", name: "Neon", mass: 20.18, group: 18, period: 2, density: 0.0009, shells: 2, category: "noble-gas" },
  { z: 11, symbol: "Na", name: "Sodium", mass: 22.99, group: 1, period: 3, density: 0.971, shells: 3, category: "alkali-metal" },
  { z: 12, symbol: "Mg", name: "Magnesium", mass: 24.305, group: 2, period: 3, density: 1.738, shells: 3, category: "alkaline-earth" },
  { z: 13, symbol: "Al", name: "Aluminium", mass: 26.982, group: 13, period: 3, density: 2.698, shells: 3, category: "post-transition" },
  { z: 14, symbol: "Si", name: "Silicon", mass: 28.086, group: 14, period: 3, density: 2.329, shells: 3, category: "metalloid" },
  { z: 15, symbol: "P", name: "Phosphorus", mass: 30.974, group: 15, period: 3, density: 1.82, shells: 3, category: "nonmetal" },
  { z: 16, symbol: "S", name: "Sulfur", mass: 32.06, group: 16, period: 3, density: 2.067, shells: 3, category: "nonmetal" },
  { z: 17, symbol: "Cl", name: "Chlorine", mass: 35.45, group: 17, period: 3, density: 0.00321, shells: 3, category: "halogen" },
  { z: 18, symbol: "Ar", name: "Argon", mass: 39.948, group: 18, period: 3, density: 0.00178, shells: 3, category: "noble-gas" },
  { z: 19, symbol: "K", name: "Potassium", mass: 39.098, group: 1, period: 4, density: 0.862, shells: 3, category: "alkali-metal" },
  { z: 20, symbol: "Ca", name: "Calcium", mass: 40.078, group: 2, period: 4, density: 1.55, shells: 3, category: "alkaline-earth" },
];

const CATEGORY_COLORS: Record<string, string> = {
  "nonmetal": "hsl(210 90% 52%)",
  "noble-gas": "hsl(280 60% 55%)",
  "alkali-metal": "hsl(350 70% 55%)",
  "alkaline-earth": "hsl(28 85% 55%)",
  "metalloid": "hsl(160 60% 42%)",
  "halogen": "hsl(180 55% 42%)",
  "post-transition": "hsl(200 40% 55%)",
};

const CATEGORY_BG: Record<string, string> = {
  "nonmetal": "hsl(210 90% 96%)",
  "noble-gas": "hsl(280 60% 96%)",
  "alkali-metal": "hsl(350 70% 96%)",
  "alkaline-earth": "hsl(28 85% 96%)",
  "metalloid": "hsl(160 60% 96%)",
  "halogen": "hsl(180 55% 96%)",
  "post-transition": "hsl(200 40% 96%)",
};

export default function AtomSimulation() {
  const navigate = useNavigate();
  const [selectedZ, setSelectedZ] = useState(6); // Carbon default
  const [searchQuery, setSearchQuery] = useState("");

  const el = ELEMENTS.find((e) => e.z === selectedZ) || ELEMENTS[0];
  const shellCount = Math.min(el.shells, 3);

  const filteredElements = useMemo(() => {
    if (!searchQuery) return ELEMENTS;
    const q = searchQuery.toLowerCase();
    return ELEMENTS.filter(
      (e) => e.name.toLowerCase().includes(q) || e.symbol.toLowerCase().includes(q) || e.z.toString() === q
    );
  }, [searchQuery]);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-br from-background to-secondary/20 lg:flex-row">
      {/* 3D Canvas */}
      <div className="relative flex-1">
        <button onClick={() => navigate("/chemistry")} className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-xl bg-card/80 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md border border-border/60 shadow-sm transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <AtomCanvas shells={shellCount} protons={el.z} neutrons={Math.round(el.mass) - el.z} />
      </div>

      {/* Side Panel */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[380px]">
        {/* Element Detail */}
        <div className="glass-panel p-5 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Element Detail</h2>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border-2 text-center"
              style={{ borderColor: CATEGORY_COLORS[el.category] || "hsl(220 13% 89%)", backgroundColor: CATEGORY_BG[el.category] || "hsl(220 16% 96%)" }}
            >
              <span className="text-xs text-muted-foreground">{el.z}</span>
              <span className="text-2xl font-bold" style={{ color: CATEGORY_COLORS[el.category] }}>{el.symbol}</span>
              <span className="text-[10px] text-muted-foreground">{el.mass}</span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">{el.name}</p>
              <p className="text-xs text-muted-foreground capitalize">{el.category.replace("-", " ")}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { l: "Atomic Number", v: el.z },
              { l: "Atomic Mass", v: `${el.mass} u` },
              { l: "Group", v: el.group },
              { l: "Period", v: el.period },
              { l: "Density", v: `${el.density} g/cm³` },
              { l: "Electron Shells", v: el.shells },
            ].map((d) => (
              <div key={d.l} className="rounded-xl bg-secondary/50 p-2.5">
                <p className="text-[10px] text-muted-foreground">{d.l}</p>
                <p className="text-sm font-medium text-foreground">{d.v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Periodic Table Grid */}
        <div className="glass-panel p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Periodic Table</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search element..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-secondary/30 pl-9 pr-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="grid grid-cols-5 gap-1.5 max-h-[300px] overflow-y-auto pr-1">
            {filteredElements.map((e) => (
              <button
                key={e.z}
                onClick={() => setSelectedZ(e.z)}
                className={`flex flex-col items-center rounded-lg p-1.5 text-center transition-all duration-200 border ${
                  selectedZ === e.z
                    ? "border-primary shadow-md shadow-primary/15 scale-105"
                    : "border-transparent hover:border-border hover:shadow-sm"
                }`}
                style={{
                  backgroundColor: selectedZ === e.z ? (CATEGORY_BG[e.category] || "hsl(220 16% 96%)") : undefined,
                }}
              >
                <span className="text-[9px] text-muted-foreground">{e.z}</span>
                <span className="text-sm font-bold" style={{ color: CATEGORY_COLORS[e.category] }}>{e.symbol}</span>
                <span className="text-[8px] text-muted-foreground truncate w-full">{e.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="glass-panel space-y-3 p-5">
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
