import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { ClientApp } from "@/components/ClientApp";
import { getGithubData } from "@/lib/github";

export const dynamic = "force-dynamic";

export default async function Page() {
  let githubData = null;
  try {
    githubData = await getGithubData();
  } catch {
    // GitHub API indisponible → affichage sans données
  }

  return (
    <main className="relative min-h-screen overflow-x-hidden selection:bg-white/20 selection:text-white">
      {/* ClientApp handles CompactNavbar and XChatWindow state without breaking SSR */}
      <ClientApp />

      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      <TechStack />

      <About profile={githubData?.profile ?? null} repos={githubData?.repos ?? null} />

      <Projects repos={githubData?.repos ?? null} />

      <Contact />
      <Footer />
    </main>
  );
}
