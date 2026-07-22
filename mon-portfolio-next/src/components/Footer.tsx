"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useIntl, type Dictionary } from "@/providers/intl-provider";

/* ── SVG Social Icons ── */
function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 1024 1024" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 0C3.58 0 0 3.58 0 8C0 11.54 2.29 14.53 5.47 15.59C5.87 15.66 6.02 15.42 6.02 15.21C6.02 15.02 6.01 14.39 6.01 13.72C4 14.09 3.48 13.23 3.32 12.78C3.23 12.55 2.84 11.84 2.5 11.65C2.22 11.5 1.82 11.13 2.49 11.12C3.12 11.11 3.57 11.7 3.72 11.94C4.44 13.15 5.59 12.81 6.05 12.6C6.12 12.08 6.33 11.73 6.56 11.53C4.78 11.33 2.92 10.64 2.92 7.58C2.92 6.71 3.23 5.99 3.74 5.43C3.66 5.23 3.38 4.41 3.82 3.31C3.82 3.31 4.49 3.1 6.02 4.13C6.66 3.95 7.34 3.86 8.02 3.86C8.7 3.86 9.38 3.95 10.02 4.13C11.55 3.09 12.22 3.31 12.22 3.31C12.66 4.41 12.38 5.23 12.3 5.43C12.81 5.99 13.12 6.7 13.12 7.58C13.12 10.65 11.25 11.33 9.47 11.53C9.76 11.78 10.01 12.26 10.01 13.01C10.01 14.08 10 14.94 10 15.21C10 15.42 10.15 15.67 10.55 15.59C13.71 14.53 16 11.53 16 8C16 3.58 12.42 0 8 0Z"
        transform="scale(64)"
      />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className}>
      <defs>
        <mask id="linkedin-mask">
          <rect width="72" height="72" rx="8" fill="white" />
          <path
            d="M62 62H51.316V43.802c0-4.99-1.896-7.778-5.845-7.778-4.296 0-6.54 2.902-6.54 7.778V62H28.633V27.333h10.297v4.67s3.096-5.73 10.452-5.73C56.736 26.274 62 30.764 62 40.05V62zM16.35 22.794c-3.508 0-6.35-2.864-6.35-6.397 0-3.533 2.842-6.397 6.35-6.397 3.507 0 6.347 2.864 6.347 6.397 0 3.533-2.84 6.397-6.348 6.397zM11.033 62h10.737V27.333H11.033V62z"
            fill="black"
          />
        </mask>
      </defs>
      <rect width="72" height="72" rx="8" fill="currentColor" opacity="0.9" mask="url(#linkedin-mask)" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 2500 2500" fill="currentColor" className={className}>
      <path d="M833.4 1250c0-230.11 186.49-416.7 416.6-416.7s416.7 186.59 416.7 416.7-186.59 416.7-416.7 416.7S833.4 1480.11 833.4 1250m-225.26 0c0 354.5 287.36 641.86 641.86 641.86S1891.86 1604.5 1891.86 1250 1604.5 608.14 1250 608.14 608.14 895.5 608.14 1250M1767.27 582.69a150 150 0 10150.06-149.94h-.06a150.07 150.07 0 00-150 149.94M745 2267.47c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28 7.27-505.15c5.55-121.87 26-188 43-232.13 22.72-58.36 49.78-100 93.5-143.78s85.32-70.88 143.78-93.5c44-17.16 110.26-37.46 232.13-43 131.76-6.06 171.34-7.27 505-7.27s373.28 1.31 505.15 7.27c121.87 5.55 188 26 232.13 43 58.36 22.62 100 49.78 143.78 93.5s70.78 85.42 93.5 143.78c17.16 44 37.46 110.26 43 232.13 6.06 131.87 7.27 171.34 7.27 505.15s-1.21 373.28-7.27 505.15c-5.55 121.87-25.95 188.11-43 232.13-22.72 58.36-49.78 100-93.5 143.68s-85.42 70.78-143.78 93.5c-44 17.16-110.26 37.46-232.13 43-131.76 6.06-171.34 7.27-505.15 7.27s-373.28-1.21-505-7.27M734.65 7.57c-133.07 6.06-224 27.16-303.41 58.06C349 97.54 279.38 140.35 209.81 209.81S97.54 349 65.63 431.24c-30.9 79.46-52 170.34-58.06 303.41C1.41 867.93 0 910.54 0 1250s1.41 382.07 7.57 515.35c6.06 133.08 27.16 223.95 58.06 303.41 31.91 82.19 74.62 152 144.18 221.43S349 2402.37 431.24 2434.37c79.56 30.9 170.34 52 303.41 58.06C868 2498.49 910.54 2500 1250 2500s382.07-1.41 515.35-7.57c133.08-6.06 223.95-27.16 303.41-58.06 82.19-32 151.86-74.72 221.43-144.18s112.18-139.24 144.18-221.43c30.9-79.46 52.1-170.34 58.06-303.41 6.06-133.38 7.47-175.89 7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2150.95 97.54 2068.86 65.63c-79.56-30.9-170.44-52.1-303.41-58.06C1632.17 1.51 1589.56 0 1250.1 0S868 1.41 734.65 7.57"
      />
    </svg>
  );
}

const SOCIALS = [
  {
    id: "github",
    href: "https://github.com/Simonc44",
    label: "GitHub",
    Icon: GithubIcon,
  },
  {
    id: "linkedin",
    href: "https://www.linkedin.com/in/simon-chusseau-91541a378/",
    label: "LinkedIn",
    Icon: LinkedinIcon,
  },
  {
    id: "instagram",
    href: "https://www.instagram.com/simonch44/",
    label: "Instagram",
    Icon: InstagramIcon,
  },
];

const COLUMN_LINKS: { labelKey: keyof Dictionary; href: string }[] = [
  { labelKey: "footer.home", href: "#hero" },
  { labelKey: "footer.process", href: "#about" },
  { labelKey: "footer.creations", href: "#projects" },
  { labelKey: "footer.contact", href: "#contact" },
];

/**
 * Premium multi-section footer with hero banner, nav bar, and info grid.
 */
export function Footer() {
  const { t } = useIntl();
  const reduce = useReducedMotion();
  const year = new Date().getFullYear();

  return (
    <motion.footer
      initial={reduce ? undefined : { opacity: 0 }}
      whileInView={reduce ? undefined : { opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6 }}
      className="pt-16 pb-8"
    >
      {/* ── Bloc 1: Freebuff Hero Banner (full-width, titre par-dessus l'image) ── */}
      <div className="relative mt-12 h-[46vh] min-h-[360px] w-full overflow-hidden select-none md:h-[56vh]">
        {/* 1. L'image de paysage en fond (z-10) */}
        <img
          src="/footer.png"
          alt="Space Nebula Landscape"
          aria-hidden="true"
          decoding="async"
          draggable="false"
          style={{
            maskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 85%, transparent 100%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, transparent 0%, black 25%, black 85%, transparent 100%)",
          }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-full w-full select-none object-cover object-bottom brightness-[0.85]"
        />

        {/* 2. Le Titre PAR-DESSUS l'image (z-20) — fondu en bas pour fondre dans la nébuleuse */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[clamp(80px,12vw,220px)] z-20 text-center"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 40%, transparent 80%, transparent 100%)",
          }}
        >
          <h2
            className="bg-gradient-to-b from-white via-white/80 to-white/20 bg-clip-text font-serif font-medium leading-none tracking-tight text-transparent drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
          >
            Simon Chusseau
          </h2>
        </div>

        {/* 3. Gradient de fondu du bas pour la transition avec les liens (z-30) */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-20 bg-gradient-to-t from-[#0a0a0a] to-transparent" />
      </div>

      {/* ── Bloc 2: Sub-nav Bar (full-width separator) ── */}
      <div className="border-t border-white/10" />

      <div className="container mx-auto max-w-7xl px-6">
        <div className="pt-6 pb-12 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-400">
          <span>{t["footer.copyright"].replace("{year}", String(year))}</span>
          <div className="flex items-center gap-2">
            {SOCIALS.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center text-neutral-400 transition-colors hover:text-white"
                aria-label={social.label}
              >
                <social.Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* ── Bloc 3: Footer Columns Grid ── */}          <div className="grid grid-cols-1 gap-8 pt-8 md:grid-cols-2 max-w-7xl mx-auto">
          {/* Column 1: Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <h3 className="font-display text-lg font-semibold text-white mb-4">
              Simon Chusseau
            </h3>
            <p className="text-sm text-neutral-400 leading-relaxed">
              {t["footer.description"]}
            </p>
          </motion.div>

          {/* Column 2: Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.2, 0.65, 0.3, 0.9] }}
          >
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">
              {t["footer.navTitle"]}
            </h4>
            <ul className="space-y-2.5">
              {COLUMN_LINKS.map((link, i) => (
                <motion.li
                  key={link.labelKey}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }}
                >
                  <a
                    href={link.href}
                    className="text-sm text-neutral-400 transition-all duration-300 hover:text-white hover:translate-x-1 inline-block"
                  >
                    {t[link.labelKey]}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.footer>
  );
}
