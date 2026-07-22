import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CommandBlockProps {
  command: string;
  /** Optional prefix shown in muted color, e.g. "$" */
  prefix?: string;
  /** Optional label shown to the left of the command, e.g. "npx" */
  label?: string;
  /** Disable copy functionality */
  readonly?: boolean;
  className?: string;
}

/**
 * A large, copyable CLI command block — inspired by Freebuff's
 * `$ npm install -g freebuff` hero treatment. Used as the
 * primary CTA of the dark hero.
 */
const CommandBlock = ({
  command,
  prefix = "$",
  label,
  readonly = false,
  className,
}: CommandBlockProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    if (readonly) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      toast({
        title: "Copied",
        description: command,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy",
        description: command,
        variant: "destructive",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      disabled={readonly}
      aria-label={readonly ? command : `Copy command: ${command}`}
      className={
        "group inline-flex items-center gap-3 md:gap-4 rounded-2xl border border-white/[0.08] bg-card/[0.05] backdrop-blur-md px-4 md:px-6 py-3 md:py-4 font-mono text-sm md:text-base transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_-10px_hsl(var(--primary)/0.5)] hover:-translate-y-0.5 " +
        (className ?? "")
      }
    >
      {label && (
        <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground border-r border-white/10 pr-3 md:pr-4">
          {label}
        </span>
      )}
      <span className="text-muted-foreground/70 select-none">{prefix}</span>
      <span className="text-foreground font-medium">{command}</span>
      <span className="ml-2 text-muted-foreground group-hover:text-primary transition-colors">
        {copied ? (
          <Check className="w-4 h-4 text-emerald-400" />
        ) : (
          <Copy className="w-4 h-4" />
        )}
      </span>
    </button>
  );
};

export default CommandBlock;
