"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GradientTextProps {
  children: ReactNode;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  /** Colors array for the gradient (default: white → silver) */
  colors?: string[];
  /** Animation duration in seconds for the gradient shift (default: 4) */
  duration?: number;
}

/**
 * GradientText — Animated gradient text with a smooth shifting color stop.
 *
 * Renders children with an animated gradient background clipped to the text.
 * The gradient slowly shifts between the provided colors.
 */
export function GradientText({
  children,
  className = "",
  as: Tag = "span",
  colors,
  duration = 4,
}: GradientTextProps) {
  const gradientColors = colors ?? [
    "#ffffff",
    "#a1a1aa",
    "#e4e4e7",
    "#ffffff",
  ];

  return (
    <Tag className={`relative inline-block ${className}`}>
      <motion.span
        className="bg-clip-text text-transparent"
        style={{
          backgroundImage: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
          backgroundSize: "300% 100%",
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration,
          ease: "easeInOut",
          repeat: Infinity,
        }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
