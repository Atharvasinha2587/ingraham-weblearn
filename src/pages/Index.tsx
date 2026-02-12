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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <h2 className={`text-xl font-bold ${color}`}>{title}</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        {experiments.map((exp) => (
          <div
            key={exp.title}
            className={`glass-panel glow-border p-5 text-left transition-all hover:scale-[1.03] ${
              exp.ready ? "cursor-pointer" : "opacity-50"
            }`}
            onClick={() => exp.ready && navigate(exp.route)}
          >
            <exp.icon className="mb-2 h-7 w-7 text-primary" />
            <h3 className="mb-1 text-base font-semibold text-foreground">{exp.title}</h3>
            <p className="text-xs text-muted-foreground">{exp.desc}</p>
            {!exp.ready && (
              <span className="mt-2 inline-block rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">
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

      <div className="relative z-10 flex flex-col items-center px-6 pt-20 pb-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Atom className="h-4 w-4" />
            Virtual Lab by Ingraham Polytechnic
          </div>

          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
            Atharva's Virtual{" "}
            <span className="text-gradient-primary">Science Lab</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Explore Physics, Chemistry & Mathematics Laws Visually — with real-time 3D simulations.
          </p>

          <button
            onClick={() => navigate("/simulation/projectile")}
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            Open Simulation
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        {/* Sections */}
        <div className="mt-16 w-full max-w-4xl space-y-10 text-left">
          <SectionCard title="⚡ Physics" color="text-primary" experiments={physics} navigate={navigate} />
          <SectionCard title="🧪 Chemistry" color="text-glow-warm" experiments={chemistry} navigate={navigate} />
          <SectionCard title="📐 Mathematics" color="text-accent" experiments={mathematics} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}
