import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Orbit } from "lucide-react";

const experiments = [
  { icon: Zap, title: "Projectile Motion", desc: "Launch, arc, and land — visualize kinematics in 3D with adjustable velocity, angle, and gravity.", route: "/simulation/projectile" },
  { icon: Orbit, title: "Pendulum", desc: "Simple harmonic motion with adjustable length, gravity, and damping.", route: "/simulation/pendulum" },
];

export default function PhysicsPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <button onClick={() => navigate("/")} className="mb-8 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[hsl(200,85%,60%)]">01 — Physics</p>
          <h1 className="text-gradient-physics mb-2 text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>Physics Lab</h1>
          <p className="mb-10 text-sm text-muted-foreground">Explore kinematics, dynamics, and waves through interactive experiments.</p>
        </motion.div>
        <div className="grid gap-5 sm:grid-cols-2">
          {experiments.map((exp, i) => (
            <motion.div
              key={exp.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => navigate(exp.route)}
              className="glass-panel glow-border group cursor-pointer p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[hsl(200,85%,60%)]/20"
            >
              <exp.icon className="mb-3 h-6 w-6 text-[hsl(200,85%,60%)]" />
              <h3 className="mb-1.5 text-sm font-semibold text-foreground">{exp.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{exp.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
