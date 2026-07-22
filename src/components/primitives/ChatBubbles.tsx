import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

export interface ChatMessage {
  id: string;
  /** "left" = received (other party), "right" = sent (you) */
  side: "left" | "right";
  /** Optional display name shown above the bubble */
  name?: string;
  /** Body text */
  body: string;
}

interface ChatBubblesProps {
  /** Ordered conversation. Rendered top-down with a small stagger. */
  messages: ChatMessage[];
  /** Stagger between bubbles in seconds */
  stagger?: number;
  /** Tailwind className for the outer container */
  className?: string;
}

/**
 * A scroll-triggered chat-bubble sequence. Inspired by Framer's
 * "XChatWindow" template — used inside the About bento as a visual
 *   "founder ↔ collaborator" conversation.
 *
 * Behavior:
 *  - When the wrapper enters the viewport, bubbles cascade in via
 *    `staggerChildren` so the user sees a "live" conversation unfold.
 *  - On exit / re-entry the animation re-runs (matches the rest of
 *    the About bento's `whileInView` styling).
 *  - Under `prefers-reduced-motion`, bubbles appear instantly.
 */
const containerVariants = {
  hidden: {},
  visible: (stagger: number) => ({
    transition: { staggerChildren: stagger, delayChildren: 0.15 },
  }),
};

const itemVariants = {
  hidden: (side: "left" | "right") => ({
    opacity: 0,
    y: 12,
    x: side === "left" ? -12 : 12,
  }),
  visible: {
    opacity: 1,
    y: 0,
    x: 0,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const ChatBubbles = ({
  messages,
  stagger = 0.35,
  className,
}: ChatBubblesProps) => {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: false, margin: "-15% 0px" });

  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col gap-3", className)}
      role="log"
      aria-label="Conversation between a recruiter and the developer"
    >
      <motion.ul
        className="space-y-3"
        initial="hidden"
        animate={shouldReduceMotion ? "visible" : inView ? "visible" : "hidden"}
        variants={containerVariants}
        custom={stagger}
      >
        {messages.map((m) => (
          <motion.li
            key={m.id}
            variants={itemVariants}
            custom={m.side}
            className={cn(
              "flex w-full",
              m.side === "right" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                "border backdrop-blur-md shadow-card",
                m.side === "right"
                  ? "bg-primary/15 border-primary/30 text-foreground rounded-br-sm"
                  : "bg-white/[0.04] border-white/[0.08] text-foreground/90 rounded-bl-sm"
              )}
              aria-label={`${m.side === "right" ? "Sent" : "Received"}: ${
                m.body
              }`}
            >
              {m.name && (
                <p className="text-[10px] font-mono uppercase tracking-widest text-primary/70 mb-1">
                  {m.name}
                </p>
              )}
              {m.body}
            </div>
          </motion.li>
        ))}
      </motion.ul>

      {/* Subtle typing indicator when not in reduced-motion & an extra
          visual hint at the bottom of the conversation. */}
      {!shouldReduceMotion && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 0.45 } : { opacity: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex gap-1 px-2 self-end"
        >
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ y: inView ? [0, -3, 0] : 0 }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                delay: i * 0.18,
                ease: "easeInOut",
              }}
              className="block w-1.5 h-1.5 rounded-full bg-foreground/50"
            />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ChatBubbles;
