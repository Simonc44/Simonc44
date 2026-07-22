"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";

/**
 * LogoBlur — Elite Studio frosted glass component.
 * Applies a strong blur by default. When the user hovers, a clear "window" (mask)
 * follows the cursor, revealing the logos underneath with crisp clarity.
 */
export function LogoBlur({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-8 glass-obsidian"
    >
      {/* 
        Couche floutée (Toujours visible, affiche les éléments floutés).
        On applique le flou directement sur le conteneur des logos.
      */}
      <div className="relative z-10 opacity-40 blur-[4px] transition-all duration-700 ease-out">
        {children}
      </div>

      {/* 
        Couche nette (Révélée uniquement au survol via un masque radial).
        Le masque suit la souris grâce à framer-motion.
      */}
      <motion.div
        className="absolute inset-0 z-20 p-8"
        animate={{
          WebkitMaskImage: isHovered
            ? `radial-gradient(120px circle at ${mousePosition.x}px ${mousePosition.y}px, black 20%, transparent 100%)`
            : `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, black 0%, transparent 0%)`,
        }}
        transition={{ type: "tween", ease: "backOut", duration: 0.15 }}
      >
        {children}
      </motion.div>
      
      {/* Subtile lueur (glow) suivant le curseur */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-30"
        animate={{
          background: isHovered
            ? `radial-gradient(150px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.06), transparent 100%)`
            : `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0), transparent 0%)`,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
      />
    </div>
  );
}
