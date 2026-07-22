import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import type { GithubData } from "@/types/github";
import { ClientApp } from "@/components/ClientApp";

export const dynamic = "force-dynamic";

async function fetchGithubData(): Promise<GithubData | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/github`);
    if (!res.ok) return null;
    const data: GithubData = await res.json();
    return data;
  } catch {
    return null;
  }
}

export default async function Page() {
  const githubData = await fetchGithubData();

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
