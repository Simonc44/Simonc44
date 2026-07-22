import { FadeIn } from "@/components/animations/FadeIn";

interface SectionHeaderProps {
  /** Editorial "01 /", "02 /", etc. — display font mono uppercase */
  index: string;
  /** Headline — large display treatment */
  title: string;
  /** Optional subhead, muted foreground */
  description?: string;
  /** Render an eyebrow badge (e.g. NEW) */
  eyebrow?: React.ReactNode;
  /** Center-aligned variant */
  centered?: boolean;
}

const SectionHeader = ({
  index,
  title,
  description,
  eyebrow,
  centered = false,
}: SectionHeaderProps) => {
  return (
    <FadeIn>
      <div
        className={`space-y-3 max-w-3xl ${centered ? "mx-auto text-center" : ""}`}
      >
        <div
          className={`flex items-center gap-3 text-xs font-mono uppercase tracking-[0.18em] ${
            centered ? "justify-center" : ""
          }`}
        >
          <span className="text-primary/80">{index}</span>
          <span className="h-px flex-1 max-w-12 bg-gradient-to-r from-primary/40 to-transparent" />
          {eyebrow}
        </div>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </FadeIn>
  );
};

export default SectionHeader;
