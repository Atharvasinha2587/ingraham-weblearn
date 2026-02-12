import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProjectileSimulation } from "@/hooks/useProjectileSimulation";
import SimulationCanvas from "@/components/simulation/SimulationCanvas";
import ControlsPanel from "@/components/simulation/ControlsPanel";
import LiveDataDisplay from "@/components/simulation/LiveDataDisplay";
import FormulaBox from "@/components/simulation/FormulaBox";
import HeightChart from "@/components/simulation/HeightChart";

export default function ProjectileSimulation() {
  const navigate = useNavigate();
  const { params, setParams, data, status, start, pause, reset } = useProjectileSimulation();

  return (
    <div className="flex h-screen flex-col bg-background lg:flex-row">
      {/* 3D Canvas */}
      <div className="relative flex-1">
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-4 z-10 flex items-center gap-2 rounded-lg bg-card/60 px-3 py-2 text-sm text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="absolute left-4 bottom-4 z-10 rounded-lg bg-card/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
          Orbit: drag · Zoom: scroll · Pan: right-drag
        </div>

        <SimulationCanvas data={data} />
      </div>

      {/* Side Panel */}
      <div className="flex w-full flex-col gap-4 overflow-y-auto p-4 lg:w-[340px]">
        <ControlsPanel
          params={params}
          setParams={setParams}
          status={status}
          onStart={start}
          onPause={pause}
          onReset={reset}
        />
        <LiveDataDisplay data={data} />
        <FormulaBox params={params} />
        <HeightChart data={data} />
      </div>
    </div>
  );
}
