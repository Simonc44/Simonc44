import { useState, useEffect } from "react";
import { X, Menu } from "lucide-react";

const NAV_ITEMS = [
  { name: "About", href: "#about" },
  { name: "Terminal", href: "#terminal" },
  { name: "Stack", href: "#tech" },
  { name: "Projects", href: "#projects" },
  { name: "Contact", href: "#contact" },
];

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setMenuOpen(false);
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-background/85 backdrop-blur-lg border-b border-primary/10 shadow-lg"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="text-xl font-bold text-gradient hover:scale-105 transition-transform font-mono"
            >
              SC.
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-primary rounded-lg hover:bg-primary/8 transition-all duration-200 relative group"
                >
                  {item.name}
                  <span className="absolute -bottom-0.5 left-4 right-4 h-0.5 bg-gradient-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full" />
                </a>
              ))}
            </div>

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
      </nav>

      {/* Mobile drawer */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />
        {/* Panel */}
        <div
          className={`absolute top-16 left-0 right-0 bg-background/95 backdrop-blur-lg border-b border-primary/10 px-4 py-4 transition-transform duration-300 ${
            menuOpen ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {NAV_ITEMS.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="block px-4 py-3 text-base font-medium text-muted-foreground hover:text-primary hover:bg-primary/8 rounded-xl transition-all duration-200"
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
