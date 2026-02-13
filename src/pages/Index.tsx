import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Atom, FlaskConical, Zap, ArrowRight, Calculator, Orbit } from "lucide-react";
import HeroScene from "@/components/HeroScene";

interface Experiment {
  icon: React.ElementType;
  title: string;
  desc: string;
  route: string;
  ready: boolean;
}

const physics: Experiment[] = [
  { icon: Zap, title: "Projectile Motion", desc: "Launch, arc, and land — visualize kinematics in 3D", route: "/simulation/projectile", ready: true },
  { icon: Orbit, title: "Pendulum", desc: "Simple harmonic motion with adjustable length & gravity", route: "/simulation/pendulum", ready: true },
];

const chemistry: Experiment[] = [
  { icon: Atom, title: "Atom Model", desc: "Explore atomic structure with orbiting electrons in 3D", route: "/simulation/atom", ready: true },
  { icon: FlaskConical, title: "Ideal Gas Law", desc: "PV = nRT in an interactive chamber", route: "#", ready: false },
];

const mathematics: Experiment[] = [
  { icon: Calculator, title: "3D Function Plotter", desc: "Visualize mathematical functions in three dimensions", route: "#", ready: false },
  { icon: Calculator, title: "Trigonometry Circle", desc: "Unit circle with sine, cosine & tangent visualization", route: "#", ready: false },
];

function SectionCard({ title, color, experiments, navigate }: { title: string; color: string; experiments: Experiment[]; navigate: (r: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-5"
    >
      <h2 className={`text-lg font-semibold tracking-wide ${color}`}>{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {experiments.map((exp) => (
          <div
            key={exp.title}
            className={`glass-panel glow-border group p-6 text-left transition-all duration-300 hover:bg-card/70 hover:border-white/[0.1] ${
              exp.ready ? "cursor-pointer hover:-translate-y-0.5" : "opacity-40"
            }`}
            onClick={() => exp.ready && navigate(exp.route)}
          >
            <exp.icon className="mb-3 h-6 w-6 text-primary/80 transition-colors group-hover:text-primary" />
            <h3 className="mb-1.5 text-sm font-semibold text-foreground">{exp.title}</h3>
            <p className="text-xs leading-relaxed text-muted-foreground">{exp.desc}</p>
            {!exp.ready && (
              <span className="mt-3 inline-block rounded-full bg-muted/60 px-3 py-0.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                Coming Soon
              </span>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <HeroScene />

      <div className="relative z-10 flex flex-col items-center px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/80">
            <Atom className="h-3.5 w-3.5" />
            Virtual Lab by Ingraham Polytechnic
          </div>

          <h1 className="mb-5 font-sans text-4xl font-bold leading-[1.15] tracking-tight text-foreground md:text-6xl" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
            Atharva's Virtual{" "}
            <span className="text-gradient-primary">Science Lab</span>
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground">
            Explore Physics, Chemistry & Mathematics laws visually — with real-time 3D simulations.
          </p>

          <button
            onClick={() => navigate("/simulation/projectile")}
            className="group inline-flex items-center gap-3 rounded-2xl bg-primary/90 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/15"
          >
            Open Simulation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </button>
        </motion.div>

        {/* Sections */}
        <div className="mt-20 w-full max-w-4xl space-y-12 text-left">
          <SectionCard title="⚡ Physics" color="text-primary" experiments={physics} navigate={navigate} />
          <SectionCard title="🧪 Chemistry" color="text-glow-warm" experiments={chemistry} navigate={navigate} />
          <SectionCard title="📐 Mathematics" color="text-accent" experiments={mathematics} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
