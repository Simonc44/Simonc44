"use client";

import { useRef, useState, useEffect, type ComponentType } from "react";
import { motion, useAnimationFrame, useMotionValue } from "framer-motion";
import {
  TypeScriptIcon,
  ReactIcon,
  NextJsIcon,
  ThreeJsIcon,
  FramerIcon,
  TailwindIcon,
  NodeJsIcon,
  PythonIcon,
  TanStackIcon,
  FirebaseIcon,
  VercelIcon,
  GroqIcon,
  RustIcon,
  McpIcon,
} from "@/components/tech-stack-icons";

interface TickerItem {
  name: string;
  icon: ComponentType<{ className?: string }>;
  glow: string;
}

const TICKER_ITEMS: TickerItem[] = [
  { name: "TypeScript", icon: TypeScriptIcon, glow: "rgba(49,120,198,0.15)" },
  { name: "React", icon: ReactIcon, glow: "rgba(97,218,251,0.15)" },
  { name: "Next.js", icon: NextJsIcon, glow: "rgba(255,255,255,0.1)" },
  { name: "Three.js", icon: ThreeJsIcon, glow: "rgba(255,255,255,0.1)" },
  { name: "Framer Motion", icon: FramerIcon, glow: "rgba(167,139,250,0.15)" },
  { name: "Tailwind CSS", icon: TailwindIcon, glow: "rgba(56,189,248,0.15)" },
  { name: "Node.js", icon: NodeJsIcon, glow: "rgba(51,153,51,0.15)" },
  { name: "Python", icon: PythonIcon, glow: "rgba(55,118,171,0.15)" },
  { name: "TanStack", icon: TanStackIcon, glow: "rgba(255,65,84,0.15)" },
  { name: "Firebase", icon: FirebaseIcon, glow: "rgba(245,158,11,0.15)" },
  { name: "Vercel", icon: VercelIcon, glow: "rgba(255,255,255,0.08)" },
  { name: "Groq", icon: GroqIcon, glow: "rgba(249,115,22,0.15)" },
  { name: "Rust", icon: RustIcon, glow: "rgba(206,66,43,0.15)" },
  { name: "MCP", icon: McpIcon, glow: "rgba(244,114,182,0.15)" },
];

const MULTIPLIED_ITEMS = [
  ...TICKER_ITEMS,
  ...TICKER_ITEMS,
  ...TICKER_ITEMS,
  ...TICKER_ITEMS,
];

export function WavyTicker() {
  const [isHovered, setIsHovered] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const xPosition = useMotionValue(0);
  const sectionRef = useRef<HTMLElement>(null);

  const waveAmplitude = 12;
  const waveFrequency = 0.015;
  const scaleAmplitude = 0.12;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useAnimationFrame((_time, delta) => {
    if (!isMounted) return;

    const speed = isHovered ? 0.15 : 0.8;
    let newX = xPosition.get() - speed * (delta / 16);

    if (newX <= -2000) {
      newX = 0;
    }
    xPosition.set(newX);
  });

  return (
    <section
      ref={sectionRef}
      aria-label="Stack technique"
      className="relative w-full overflow-hidden border-y border-white/[0.06] bg-black/30 py-16"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Aurora background */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full"
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)",
          }}
        />
        <motion.div
          className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full"
          animate={{
            x: [0, -30, 20, 0],
            y: [0, 20, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          style={{
            background: "radial-gradient(circle, rgba(236,72,153,0.04) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Side fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-40 bg-gradient-to-r from-background via-background/80 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-40 bg-gradient-to-l from-background via-background/80 to-transparent" />

      {/* Scrolling track with 3D wave */}
      <div className="flex whitespace-nowrap" style={{ perspective: "500px" }}>
        <motion.div
          style={{ x: xPosition }}
          className="flex items-center gap-10 pr-10"
        >
          {MULTIPLIED_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const phase = idx * 60 * waveFrequency;
            const rawY = Math.sin(phase) * waveAmplitude;
            const rawScale = 1 + Math.sin(phase) * scaleAmplitude;
            const rawOpacity = 0.6 + (1 - Math.abs(Math.sin(phase))) * 0.4;
            const zOffset = Math.sin(phase) * 20;

            return (
              <div
                key={`${item.name}-${idx}`}
                className="flex items-center gap-10"
                style={{
                  transform: `translateY(${rawY.toFixed(1)}px) scale(${rawScale.toFixed(3)}) translateZ(${zOffset.toFixed(0)}px)`,
                  opacity: rawOpacity,
                  transition: "opacity 0.3s ease",
                }}
              >
                <span
                  className="group inline-flex cursor-default items-center gap-3 rounded-full border border-white/[0.06] bg-white/[0.02] px-5 py-2.5 font-mono text-sm font-medium tracking-wide text-neutral-300 whitespace-nowrap transition-all duration-500 hover:scale-110 hover:border-white/40 hover:bg-white/[0.08] hover:text-white"
                  style={{
                    backdropFilter: "blur(8px)",
                    boxShadow: isHovered ? `0 0 30px -8px ${item.glow}` : "none",
                    transition: "box-shadow 0.5s ease, transform 0.4s var(--ease-elite, cubic-bezier(0.16,1,0.3,1))",
                  }}
                >
                  <Icon className="h-5 w-5 flex-shrink-0 transition-transform duration-500 group-hover:scale-110" />
                  {item.name}
                </span>

                {/* Decorative dot separator — hidden on smaller screens */}
                <span
                  className="relative hidden h-1.5 w-1.5 sm:inline-block"
                  style={{
                    opacity: rawOpacity * 0.4,
                  }}
                >
                  <span className="absolute inset-0 animate-ping rounded-full bg-white/20" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white/30" />
                </span>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
