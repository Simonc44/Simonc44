import { Sparkles, Radio, Github, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type GlowBadgeVariant = "new" | "live" | "oss" | "star";

const variantStyles: Record<GlowBadgeVariant, string> = {
  new: "bg-primary/15 text-primary border-primary/30 shadow-[0_0_20px_-2px_hsl(var(--primary)/0.5)]",
  live:
    "bg-red-500/15 text-red-300 border-red-500/30 shadow-[0_0_20px_-2px_rgba(239,68,68,0.5)]",
  oss: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  star: "bg-amber-500/15 text-amber-300 border-amber-500/30",
};

interface GlowBadgeProps {
  variant?: GlowBadgeVariant;
  children: React.ReactNode;
  className?: string;
  /** Render as a small icon-only chip */
  iconOnly?: boolean;
}

const defaultIcons: Record<GlowBadgeVariant, React.ReactNode> = {
  new: <Sparkles className="w-3 h-3" />,
  live: <Radio className="w-3 h-3" />,
  oss: <Github className="w-3 h-3" />,
  star: <Star className="w-3 h-3" />,
};

/**
 * A small glowing chip used to label product cards, hero areas, or any
 * surface that needs editorial emphasis. Built-in variants:
 * - new → violet glow
 * - live → red pulse (animated)
 * - oss → emerald (used in projects)
 * - star → amber (used for showcase ratings)
 */
const GlowBadge = ({
  variant = "new",
  children,
  className,
  iconOnly = false,
}: GlowBadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium rounded-full px-2.5 py-1 border backdrop-blur-sm",
        "font-mono uppercase tracking-wider",
        variant === "live" && "animate-pulse",
        variantStyles[variant],
        className
      )}
    >
      {defaultIcons[variant]}
      {!iconOnly && <span>{children}</span>}
    </span>
  );
};

export default GlowBadge;
