import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PhysicsPage from "./pages/PhysicsPage";
import ChemistryPage from "./pages/ChemistryPage";
import MathematicsPage from "./pages/MathematicsPage";
import ProjectileSimulation from "./pages/ProjectileSimulation";
import PendulumSimulation from "./pages/PendulumSimulation";
import AtomSimulation from "./pages/AtomSimulation";
import UnitCircleSimulation from "./pages/UnitCircleSimulation";
import ChemistryLabSimulation from "./pages/ChemistryLabSimulation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/physics" element={<PhysicsPage />} />
          <Route path="/chemistry" element={<ChemistryPage />} />
          <Route path="/mathematics" element={<MathematicsPage />} />
          <Route path="/simulation/projectile" element={<ProjectileSimulation />} />
          <Route path="/simulation/pendulum" element={<PendulumSimulation />} />
          <Route path="/simulation/atom" element={<AtomSimulation />} />
          <Route path="/simulation/unit-circle" element={<UnitCircleSimulation />} />
          <Route path="/simulation/chemistry-lab" element={<ChemistryLabSimulation />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
