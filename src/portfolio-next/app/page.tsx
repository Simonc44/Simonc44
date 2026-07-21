import { Suspense } from "react";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { TechStack } from "@/components/TechStack";
import { Projects } from "@/components/Projects";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { WavyTicker } from "@/components/WavyTicker";
import { XChatWindow } from "@/components/XChatWindow";
import type { GithubData } from "@/types/github";

/**
 * Server Component — fetches GitHub data at build time / ISR (1h).
 * Injects real data into Projects and About without client-side waterfalls.
 */
async function fetchGithubData(): Promise<GithubData | null> {
  try {
    // In production, use the absolute URL from NEXT_PUBLIC_SITE_URL.
    // In development, we call the API route directly from the server.
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : "http://localhost:3000");

    const res = await fetch(`${baseUrl}/api/github`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json() as Promise<GithubData>;
  } catch {
    return null;
  }
}

export default async function Page() {
  const githubData = await fetchGithubData();

  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero — 3D scroll-driven scene */}
      <Suspense fallback={null}>
        <Hero />
      </Suspense>

      {/* WavyTicker — real skills from GitHub language data */}
      <WavyTicker
        languages={githubData?.aggregatedLanguages ?? null}
        repos={githubData?.repos ?? null}
      />

      <About profile={githubData?.profile ?? null} repos={githubData?.repos ?? null} />

      <TechStack />

      <Projects repos={githubData?.repos ?? null} />

      <Contact />
      <Footer />

      {/* Floating chat window — always mounted, visibility toggled internally */}
      <XChatWindow />
    </main>
  );
}
