import { useNavigate } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Atom, ArrowRight, ArrowDown } from "lucide-react";
import ProjectilePreview from "@/components/landing/ProjectilePreview";
import AtomPreview from "@/components/landing/AtomPreview";
import CalculatorPreview from "@/components/landing/CalculatorPreview";

function Section({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative flex min-h-screen flex-col items-center justify-center px-6 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground">
      {/* ── Hero ── */}
      <section className="relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-2xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/[0.06] px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-primary/80">
            <Atom className="h-3.5 w-3.5" />
            Virtual Lab by Ingraham Polytechnic
          </div>
          <h1
            className="mb-5 text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Atharva's Virtual{" "}
            <span className="text-gradient-primary">Science Lab</span>
          </h1>
          <p className="mx-auto mb-10 max-w-lg text-base leading-relaxed text-muted-foreground">
            Explore Physics, Chemistry & Mathematics through interactive 3D simulations.
          </p>
          <button
            onClick={() => {
              document.getElementById("physics")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group inline-flex items-center gap-3 rounded-2xl bg-primary/90 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-primary hover:shadow-lg hover:shadow-primary/20"
          >
            Explore Simulations
            <ArrowDown className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
          </button>
        </motion.div>
      </section>

      {/* ── Physics ── */}
      <Section>
        <div id="physics" className="absolute -top-20" />
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="order-2 h-[400px] w-full lg:order-1">
            <ProjectilePreview />
          </div>
          <div className="order-1 space-y-5 text-center lg:order-2 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(200,85%,60%)]">
              01 — Physics
            </p>
            <h2
              className="text-gradient-physics text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Physics
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Launch projectiles, swing pendulums — understand kinematics and dynamics through real-time 3D experiments.
            </p>
            <button
              onClick={() => navigate("/physics")}
              className="group mt-2 inline-flex items-center gap-2 rounded-xl border border-[hsl(200,85%,60%)]/20 bg-[hsl(200,85%,60%)]/10 px-6 py-3 text-sm font-semibold text-[hsl(200,85%,60%)] transition-all hover:bg-[hsl(200,85%,60%)]/20"
            >
              Open Physics Lab
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </Section>

      {/* ── Chemistry ── */}
      <Section>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="space-y-5 text-center lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(150,70%,50%)]">
              02 — Chemistry
            </p>
            <h2
              className="text-gradient-chemistry text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Chemistry
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Explore atomic structures with orbiting electrons, visualize chemical bonds and molecular geometry.
            </p>
            <button
              onClick={() => navigate("/chemistry")}
              className="group mt-2 inline-flex items-center gap-2 rounded-xl border border-[hsl(150,70%,50%)]/20 bg-[hsl(150,70%,50%)]/10 px-6 py-3 text-sm font-semibold text-[hsl(150,70%,50%)] transition-all hover:bg-[hsl(150,70%,50%)]/20"
            >
              Open Chemistry Lab
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="h-[400px] w-full">
            <AtomPreview />
          </div>
        </div>
      </Section>

      {/* ── Mathematics ── */}
      <Section>
        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div className="order-2 h-[400px] w-full lg:order-1">
            <CalculatorPreview />
          </div>
          <div className="order-1 space-y-5 text-center lg:order-2 lg:text-left">
            <p className="text-xs font-semibold uppercase tracking-widest text-[hsl(35,90%,60%)]">
              03 — Mathematics
            </p>
            <h2
              className="text-gradient-math text-4xl font-bold md:text-5xl"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Mathematics
            </h2>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Visualize trigonometric functions, explore the unit circle, and understand mathematical concepts in 3D.
            </p>
            <button
              onClick={() => navigate("/mathematics")}
              className="group mt-2 inline-flex items-center gap-2 rounded-xl border border-[hsl(35,90%,60%)]/20 bg-[hsl(35,90%,60%)]/10 px-6 py-3 text-sm font-semibold text-[hsl(35,90%,60%)] transition-all hover:bg-[hsl(35,90%,60%)]/20"
            >
              Open Math Lab
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-xs text-muted-foreground">
        <p>Atharva's Virtual Science Lab · Ingraham Polytechnic</p>
      </footer>
    </div>
  );
}
