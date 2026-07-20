import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";

/**
 * Root route. Server component — just composes the page tree. The Hero
 * receives `modelUrl` so the 3D scene tries to load `/models/hero.glb`
 * on first render. Drop your .glb into `public/models/` (see
 * `public/models/README.md` for the workflow) and it will swap in.
 *
 * Set `modelUrl={undefined}` (or omit) to keep the procedural
 * fallback torus knot.
 */
export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Navbar />
      {/* 3D scenes suspend on HDR + .glb loading; outer Suspense keeps the
          page tree responsive while R3F mounts. */}
      <Suspense fallback={null}>
        <Hero modelUrl="/models/hero.glb" />
      </Suspense>
      <About />
      <TechStack />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
