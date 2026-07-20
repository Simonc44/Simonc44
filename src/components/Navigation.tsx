import { useState, useMemo } from "react";
import { X, Menu, ArrowUpRight } from "lucide-react";
import { useActiveSection } from "@/hooks/use-active-section";
import { motion, AnimatePresence } from "framer-motion";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Stack", href: "#tech" },
  { name: "Terminal", href: "#terminal" },
  { name: "Projects", href: "#projects" },
];

const Navigation = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const sectionIds = useMemo(
    () => NAV_ITEMS.map((item) => item.href.replace("#", "")),
    []
  );
  const activeSection = useActiveSection(sectionIds);

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
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/80 backdrop-blur-xl border-b border-border/40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 text-lg font-display font-semibold tracking-tight hover:opacity-80 transition-opacity"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              simon<span className="text-primary">.</span>
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.href.replace("#", "");
                return (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.name}
                    {isActive && (
                      <motion.span
                        layoutId="activeNav"
                        className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

            {/* Right CTA */}
            <div className="flex items-center gap-2">
              <a
                href="#contact"
                onClick={(e) => handleNavClick(e, "#contact")}
                className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-gradient-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-2 hover:shadow-glow transition-all duration-300"
              >
                Initialize
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              {/* Mobile burger */}
              <button
                className="md:hidden p-2 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
              onClick={() => setMenuOpen(false)}
            />
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-border/40 px-4 py-4"
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
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-primary text-primary-foreground font-mono text-xs uppercase tracking-widest px-4 py-2"
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
