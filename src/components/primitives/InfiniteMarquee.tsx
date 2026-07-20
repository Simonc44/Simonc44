import { motion } from "framer-motion";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InfiniteMarqueeProps {
  children: React.ReactNode;
  /** Seconds per full pass. Higher = slower. */
  speed?: number;
  /** Reverse direction */
  reverse?: boolean;
  /** Vertical orientation */
  vertical?: boolean;
  /** Pause on hover inside the track */
  pauseOnHover?: boolean;
  className?: string;
  /** Gap between repeated items in pixels */
  gap?: number;
}

/**
 * A seamlessly looping infinite marquee built on a Framer Motion track that
 * translates by exactly half its width (so two copies of the same content
 * read as one continuous line). Honors prefers-reduced-motion.
 */
const InfiniteMarquee = ({
  children,
  speed = 30,
  reverse = false,
  vertical = false,
  pauseOnHover = true,
  className,
  gap = 48,
}: InfiniteMarqueeProps) => {
  const shouldReduceMotion = useReducedMotion();
  const direction = vertical ? "y" : "x";
  const axisAnimation = reverse ? ["0%", "-50%"] : ["-50%", "0%"];

  if (shouldReduceMotion) {
    return (
      <div className={cn("mask-fade-x overflow-hidden", className)}>
        <div className="flex w-max" style={{ gap }}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mask-fade-x overflow-hidden",
        pauseOnHover && "[&:hover_.marquee-track]:animation-play-state-paused",
        className
      )}
      role="presentation"
      aria-hidden="true"
    >
      <motion.div
        className="marquee-track flex w-max"
        style={{ gap }}
        animate={{ [direction]: axisAnimation }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear",
        }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
};

export default InfiniteMarquee;
