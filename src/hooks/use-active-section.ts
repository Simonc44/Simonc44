import { useState, useEffect, useRef } from "react";

function throttle<T extends unknown[]>(fn: (...args: T) => void, wait: number) {
  let lastTime = 0;
  return (...args: T) => {
    const now = Date.now();
    if (now - lastTime >= wait) {
      lastTime = now;
      fn(...args);
    }
  };
}

export function useActiveSection(sectionIds: string[], offset: number = 100) {
  const [activeSection, setActiveSection] = useState<string>(sectionIds[0] ?? "");
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const section = document.getElementById(sectionIds[i]);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          return;
        }
      }

      setActiveSection(sectionIds[0] ?? "");
    };

    const throttledUpdate = throttle(() => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(updateActiveSection);
    }, 100);

    window.addEventListener("scroll", throttledUpdate, { passive: true });
    window.addEventListener("resize", throttledUpdate, { passive: true });
    updateActiveSection();

    return () => {
      window.removeEventListener("scroll", throttledUpdate);
      window.removeEventListener("resize", throttledUpdate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [sectionIds, offset]);

  return activeSection;
}
