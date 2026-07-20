import { useMemo, useState } from "react";
import { X, Menu, ArrowUpRight } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#tech" },
  { name: "Terminal", href: "#terminal" },
  { name: "Projects", href: "#projects" },
];

/**
 * Compact pill navbar inspired by Framer's "Compact Navbar" template.
 *
 * - Floats centered at top, semi-translucent glass.
 * - Hides on scroll-down, reappears on scroll-up (velocity-based).
 * - Active item indicator still uses `layoutId="activeNav"` so the
 *   background pill slides between the tabs.
 * - Mobile drawer preserved beneath the pill using a portaled drawer.
 */
const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const sectionIds = useMemo(
    () => NAV_ITEMS.map((item) => item.href.replace("#", "")),
    []
  );
  const activeSection = useActiveSection(sectionIds);

  // Scroll-direction indicator.
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => {
    if (shouldReduceMotion) {
      setHidden(false);
      return;
    }
    const velocity = scrollY.getVelocity();
    const goingDown = velocity > 8;
    const pastTop = latest > 80;
    setHidden(goingDown && pastTop);
  });

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <motion.nav
        animate={shouldReduceMotion ? undefined : { y: hidden ? "-160%" : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 28, mass: 0.6 }}
        className="fixed top-3 left-1/2 -translate-x-1/2 z-50"
      >
        {/* Decoupled pointer-events on the pill so clicks pass through
            the area between the pill and the page edge. */}
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-background/60 backdrop-blur-xl shadow-card px-2 py-1.5"
        >
          {/* Logo + status dot */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Back to top"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-display font-semibold tracking-tight hover:opacity-80 transition-opacity"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)] animate-pulse" />
            simon<span className="text-primary">.</span>
          </a>

          {/* Desktop links — pill style */}
          <div
            className="hidden md:flex items-center gap-1 pl-1 pr-1"
            role="navigation"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.href.replace("#", "");
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="relative px-3.5 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-full"
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNav"
                      className="absolute inset-0 rounded-full bg-primary/15 border border-primary/25"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 28,
                      }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right CTA */}
          <a
            href="#contact"
            onClick={(e) => handleNavClick(e, "#contact")}
            className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary text-primary-foreground font-mono text-[11px] uppercase tracking-widest px-3.5 py-1.5 hover:shadow-glow transition-all duration-300"
          >
            Initialize
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile burger — always present, only visible < md */}
          <button
            className="md:hidden p-1.5 rounded-full hover:bg-primary/15 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <X className="w-4 h-4" />
            ) : (
              <Menu className="w-4 h-4" />
            )}
          </button>
        </motion.div>
      </motion.nav>

      {/* Mobile drawer — separate from scroll-hide logic so touch users
          always have a fallback. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/70 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.22 }}
              className="absolute top-20 left-4 right-4 rounded-2xl bg-background/95 backdrop-blur-lg border border-white/[0.06] shadow-card px-4 py-4 space-y-2"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className={`block px-4 py-3 text-base font-medium rounded-xl transition-all duration-200 ${
                      isActive
                        ? "text-foreground bg-primary/10 border border-primary/20"
                        : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                  </a>
                );
              })}
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary text-primary-foreground font-mono text-[11px] uppercase tracking-widest px-4 py-2.5"
              >
                Initialize
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navigation;
