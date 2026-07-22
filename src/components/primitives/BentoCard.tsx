import { cn } from "@/lib/utils";

interface BentoCardProps {
  className?: string;
  children: React.ReactNode;
  /** Adds a soft gradient halo behind the children */
  glow?: boolean;
  /** Render as <a> with href instead of <div> */
  href?: string;
  /** Opens href in a new tab */
  external?: boolean;
  /** Disable hover interactivity */
  static?: boolean;
  /** Optional aria-label for the wrapping element */
  ariaLabel?: string;
}

/**
 * A glassmorphic card used as the building block of the Bento grids in the
 * About section. Optional glow halo, hover-glow border treatment, and an a11y
 * label override for link-as-card patterns.
 */
const BentoCard = ({
  className,
  children,
  glow = false,
  href,
  external = false,
  static: isStatic = false,
  ariaLabel,
}: BentoCardProps) => {
  const baseClass = cn(
    "group relative overflow-hidden rounded-2xl border border-white/[0.06]",
    "bg-card/[0.04] backdrop-blur-md p-6 transition-all duration-300",
    !isStatic && "hover:border-primary/30 hover:-translate-y-0.5",
    !isStatic && "hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.4)]",
    className
  );

  const inner = (
    <>
      {glow && (
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/[0.08] via-transparent to-accent/[0.06] opacity-70"
          aria-hidden="true"
        />
      )}
      <div className="relative">{children}</div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
        className={baseClass}
      >
        {inner}
      </a>
    );
  }

  return (
    <div aria-label={ariaLabel} className={baseClass}>
      {inner}
    </div>
  );
};

export default BentoCard;
