import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Slider } from "@/components/ui/slider";

export default function UnitCircleSimulation() {
  const navigate = useNavigate();
  const [angleDeg, setAngleDeg] = useState(45);
  const angleRad = (angleDeg * Math.PI) / 180;

  const cosVal = Math.cos(angleRad);
  const sinVal = Math.sin(angleRad);
  const tanVal = Math.abs(cosVal) > 0.001 ? Math.tan(angleRad) : Infinity;

  const cx = 250;
  const cy = 250;
  const r = 180;
  const px = cx + r * cosVal;
  const py = cy - r * sinVal;

  // Generate sine wave
  const sineWavePath = useCallback(() => {
    let d = "";
    for (let i = 0; i <= 360; i += 2) {
      const rad = (i * Math.PI) / 180;
      const x = 540 + (i / 360) * 200;
      const y = cy - r * 0.5 * Math.sin(rad);
      d += `${i === 0 ? "M" : "L"}${x},${y}`;
    }
    return d;
  }, [cy, r]);

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* Main area */}
      <div className="relative flex flex-1 items-center justify-center">
        <button
          onClick={() => navigate("/mathematics")}
          className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-card/60 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <svg viewBox="0 0 760 500" className="h-full max-h-[80vh] w-full max-w-[90vw]">
          {/* Grid */}
          {Array.from({ length: 11 }, (_, i) => {
            const x = cx - r + (i * 2 * r) / 10;
            return (
              <line key={`vg${i}`} x1={x} y1={cy - r} x2={x} y2={cy + r} stroke="hsl(250 15% 15%)" strokeWidth={0.5} />
            );
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const y = cy - r + (i * 2 * r) / 10;
            return (
              <line key={`hg${i}`} x1={cx - r} y1={y} x2={cx + r} y2={y} stroke="hsl(250 15% 15%)" strokeWidth={0.5} />
            );
          })}

          {/* Axes */}
          <line x1={cx - r - 20} y1={cy} x2={cx + r + 20} y2={cy} stroke="hsl(250 10% 30%)" strokeWidth={1} />
          <line x1={cx} y1={cy - r - 20} x2={cx} y2={cy + r + 20} stroke="hsl(250 10% 30%)" strokeWidth={1} />

          {/* Circle */}
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(270 70% 65%)" strokeWidth={1.5} opacity={0.4} />

          {/* Radius line */}
          <line x1={cx} y1={cy} x2={px} y2={py} stroke="hsl(270 70% 65%)" strokeWidth={2} />

          {/* Cosine (horizontal) */}
          <line x1={cx} y1={cy} x2={px} y2={cy} stroke="hsl(200 85% 60%)" strokeWidth={2.5} strokeLinecap="round" />
          <text x={(cx + px) / 2} y={cy + 18} fill="hsl(200 85% 60%)" fontSize={11} textAnchor="middle" fontFamily="JetBrains Mono">
            cos = {cosVal.toFixed(3)}
          </text>

          {/* Sine (vertical) */}
          <line x1={px} y1={cy} x2={px} y2={py} stroke="hsl(340 75% 60%)" strokeWidth={2.5} strokeLinecap="round" />
          <text x={px + 12} y={(cy + py) / 2 + 4} fill="hsl(340 75% 60%)" fontSize={11} textAnchor="start" fontFamily="JetBrains Mono">
            sin = {sinVal.toFixed(3)}
          </text>

          {/* Tangent line */}
          {Math.abs(tanVal) < 10 && (
            <>
              <line
                x1={cx + r}
                y1={cy}
                x2={cx + r}
                y2={cy - r * tanVal}
                stroke="hsl(35 90% 60%)"
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.7}
              />
              <line
                x1={cx}
                y1={cy}
                x2={cx + r}
                y2={cy - r * tanVal}
                stroke="hsl(35 90% 60%)"
                strokeWidth={1}
                strokeDasharray="4 4"
                opacity={0.4}
              />
            </>
          )}

          {/* Angle arc */}
          {(() => {
            const arcR = 30;
            const endAngle = Math.min(angleDeg, 359);
            const largeArc = endAngle > 180 ? 1 : 0;
            const ax = cx + arcR * Math.cos((-endAngle * Math.PI) / 180);
            const ay = cy + arcR * Math.sin((-endAngle * Math.PI) / 180);
            return (
              <path
                d={`M${cx + arcR},${cy} A${arcR},${arcR} 0 ${largeArc} 0 ${ax},${ay}`}
                fill="none"
                stroke="hsl(270 70% 65%)"
                strokeWidth={1.5}
                opacity={0.6}
              />
            );
          })()}
          <text x={cx + 40} y={cy - 8} fill="hsl(270 70% 65%)" fontSize={11} fontFamily="JetBrains Mono">
            {angleDeg}°
          </text>

          {/* Point */}
          <circle cx={px} cy={py} r={6} fill="hsl(270 70% 65%)" />
          <circle cx={px} cy={py} r={10} fill="hsl(270 70% 65%)" opacity={0.2} />

          {/* Sine wave */}
          <path d={sineWavePath()} fill="none" stroke="hsl(340 75% 60%)" strokeWidth={1.5} opacity={0.4} />
          <text x={640} y={cy - r * 0.5 - 10} fill="hsl(340 75% 60%)" fontSize={10} textAnchor="middle" opacity={0.6}>
            sin(θ)
          </text>

          {/* Current position on sine wave */}
          <circle
            cx={540 + (angleDeg / 360) * 200}
            cy={cy - r * 0.5 * sinVal}
            r={4}
            fill="hsl(340 75% 60%)"
          />
          <line
            x1={px}
            y1={py}
            x2={540 + (angleDeg / 360) * 200}
            y2={cy - r * 0.5 * sinVal}
            stroke="hsl(340 75% 60%)"
            strokeWidth={0.5}
            strokeDasharray="3 3"
            opacity={0.3}
          />

          {/* Labels */}
          <text x={cx + r + 8} y={cy + 4} fill="hsl(250 10% 40%)" fontSize={10}>1</text>
          <text x={cx - r - 16} y={cy + 4} fill="hsl(250 10% 40%)" fontSize={10}>-1</text>
          <text x={cx + 4} y={cy - r - 8} fill="hsl(250 10% 40%)" fontSize={10}>1</text>
          <text x={cx + 4} y={cy + r + 16} fill="hsl(250 10% 40%)" fontSize={10}>-1</text>
        </svg>
      </div>

      {/* Side Panel */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[340px]">
        <div className="glass-panel glow-border flex flex-col gap-5 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Controls</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">Angle (θ)</span>
              <span className="font-mono text-sm text-primary">{angleDeg}°</span>
            </div>
            <Slider min={0} max={360} step={1} value={[angleDeg]} onValueChange={([v]) => setAngleDeg(v)} />
          </div>
        </div>

        <div className="glass-panel glow-border space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Values</h2>
          {[
            { l: "cos(θ)", v: cosVal.toFixed(4), c: "text-[hsl(200,85%,60%)]" },
            { l: "sin(θ)", v: sinVal.toFixed(4), c: "text-[hsl(340,75%,60%)]" },
            { l: "tan(θ)", v: Math.abs(tanVal) > 1000 ? "undefined" : tanVal.toFixed(4), c: "text-[hsl(35,90%,60%)]" },
          ].map((d) => (
            <div key={d.l} className="flex items-center justify-between">
              <span className="font-mono text-xs text-muted-foreground">{d.l}</span>
              <span className={`font-mono text-sm ${d.c}`}>{d.v}</span>
            </div>
          ))}
        </div>

        <div className="glass-panel glow-border space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Formulas</h2>
          <div className="space-y-1.5 font-mono text-xs text-foreground/70">
            <p>cos(θ) = adjacent / hypotenuse</p>
            <p>sin(θ) = opposite / hypotenuse</p>
            <p>tan(θ) = sin(θ) / cos(θ)</p>
            <p className="pt-2 text-muted-foreground">sin²(θ) + cos²(θ) = 1</p>
            <p className="text-muted-foreground">
              {sinVal.toFixed(3)}² + {cosVal.toFixed(3)}² ={" "}
              <span className="text-primary">{(sinVal * sinVal + cosVal * cosVal).toFixed(4)}</span>
            </p>
          </div>
        </div>

        <div className="glass-panel glow-border space-y-3 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Quadrant</h2>
          <div className="text-sm text-foreground">
            {angleDeg <= 90 ? "I — sin+, cos+" : angleDeg <= 180 ? "II — sin+, cos−" : angleDeg <= 270 ? "III — sin−, cos−" : "IV — sin−, cos+"}
          </div>
          <p className="font-mono text-xs text-muted-foreground">
            θ = {angleRad.toFixed(4)} rad
          </p>
        </div>
      </div>
    </div>
  );
}
