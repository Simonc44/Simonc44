/**
 * Minimal letter-glyph icon registry. Each export is a function
 * component `(props: { className?: string }) => JSX.Element` —
 * compatible with the shape imported by `TechStack.tsx`. Swap any
 * of these for a real brand SVG whenever you decide on the final
 * style.
 *
 * The icons below are deliberately *not* brand SVGs — they're
 * diaphanous letter chips with a brand-flavoured accent. They ship
 * with the module so the runtime resolves without extra setup.
 */

type IconProps = { className?: string };

interface LetterIconProps extends IconProps {
  letter: string;
  bg: string;
  fg: string;
}

function LetterGlyph({ letter, bg, fg, className }: LetterIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" fill={bg} />
      <text
        x="12"
        y="16"
        textAnchor="middle"
        fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
        fontWeight="700"
        fontSize="11"
        fill={fg}
      >
        {letter}
      </text>
    </svg>
  );
}

export const ReactIcon = (p: IconProps) => (
  <LetterGlyph letter="R" bg="#0ea5e9" fg="#0b1220" className={p.className} />
);
export const TypeScriptIcon = (p: IconProps) => (
  <LetterGlyph letter="TS" bg="#1e40af" fg="#dbeafe" className={p.className} />
);
export const NextJsIcon = (p: IconProps) => (
  <LetterGlyph letter="N" bg="#0f172a" fg="#f8fafc" className={p.className} />
);
export const TailwindIcon = (p: IconProps) => (
  <LetterGlyph letter="TW" bg="#0e7490" fg="#cffafe" className={p.className} />
);
export const FirebaseIcon = (p: IconProps) => (
  <LetterGlyph letter="F" bg="#b45309" fg="#fef3c7" className={p.className} />
);
export const NodeJsIcon = (p: IconProps) => (
  <LetterGlyph letter="NJ" bg="#15803d" fg="#dcfce7" className={p.className} />
);
export const ViteIcon = (p: IconProps) => (
  <LetterGlyph letter="V" bg="#6d28d9" fg="#ede9fe" className={p.className} />
);
export const DatabaseIcon = (p: IconProps) => (
  <LetterGlyph letter="DB" bg="#0f766e" fg="#ccfbf1" className={p.className} />
);
export const GeminiIcon = (p: IconProps) => (
  <LetterGlyph letter="G" bg="#1d4ed8" fg="#bfdbfe" className={p.className} />
);
export const GroqIcon = (p: IconProps) => (
  <LetterGlyph letter="GR" bg="#c2410c" fg="#ffedd5" className={p.className} />
);
export const TanStackIcon = (p: IconProps) => (
  <LetterGlyph letter="TQ" bg="#9f1239" fg="#ffe4e6" className={p.className} />
);
export const VercelIcon = (p: IconProps) => (
  <LetterGlyph letter="Vl" bg="#0f172a" fg="#fafafa" className={p.className} />
);
