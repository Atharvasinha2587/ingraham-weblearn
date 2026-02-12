import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Atom, FlaskConical, Zap, ArrowRight } from "lucide-react";
import HeroScene from "@/components/HeroScene";

const experiments = [
  { icon: Zap, title: "Projectile Motion", desc: "Launch, arc, and land — visualize kinematics in 3D", ready: true },
  { icon: Atom, title: "Pendulum Dynamics", desc: "Simple & damped harmonic motion", ready: false },
  { icon: FlaskConical, title: "Ideal Gas Law", desc: "PV = nRT in an interactive chamber", ready: false },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <HeroScene />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-3xl"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Atom className="h-4 w-4" />
            Virtual Science Lab
          </div>

          <h1 className="mb-4 text-5xl font-extrabold leading-tight tracking-tight text-foreground md:text-7xl">
            Interactive 3D{" "}
            <span className="text-gradient-primary">Science Lab</span>
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-lg text-muted-foreground">
            Explore Physics and Chemistry Laws Visually — with real-time simulations, live data, and intuitive controls.
          </p>

          <button
            onClick={() => navigate("/simulation/projectile")}
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            Open Simulation
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-20 grid w-full max-w-4xl gap-4 md:grid-cols-3"
        >
          {experiments.map((exp) => (
            <div
              key={exp.title}
              className={`glass-panel glow-border p-6 text-left transition-all hover:scale-[1.03] ${
                exp.ready ? "cursor-pointer" : "opacity-50"
              }`}
              onClick={() => exp.ready && navigate("/simulation/projectile")}
            >
              <exp.icon className="mb-3 h-8 w-8 text-primary" />
              <h3 className="mb-1 text-lg font-semibold text-foreground">{exp.title}</h3>
              <p className="text-sm text-muted-foreground">{exp.desc}</p>
              {!exp.ready && (
                <span className="mt-3 inline-block rounded-full bg-muted px-3 py-0.5 text-xs text-muted-foreground">
                  Coming Soon
                </span>
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
