import { useState } from "react";
import { Terminal, Loader2, AlertCircle, Copy, Check } from "lucide-react";
import { useGitHubProfile, useGitHubRepos } from "@/hooks/use-github";
import { getGitHubContributionChartUrl } from "@/lib/github";
import SectionHeader from "@/components/primitives/SectionHeader";
import GlowBadge from "@/components/primitives/GlowBadge";

type Tab = "overview" | "heatmap" | "repos";
const TABS: { id: Tab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "heatmap", label: "Heatmap" },
  { id: "repos", label: "Repositories" },
];

const GitHubTerminal = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } =
    useGitHubProfile();
  const { data: repos, isLoading: reposLoading } = useGitHubRepos();
  const [tab, setTab] = useState<Tab>("overview");
  const [copiedHandle, setCopiedHandle] = useState(false);

  const isLoading = profileLoading || reposLoading;
  const error = profileError;

  const onCopyHandle = async () => {
    try {
      if (!profile?.login) return;
      await navigator.clipboard.writeText(`https://github.com/${profile.login}`);
      setCopiedHandle(true);
      setTimeout(() => setCopiedHandle(false), 1800);
    } catch {
      /* noop */
    }
  };

  return (
    <section id="terminal" className="py-24 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-primary/[0.06] via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10 space-y-10">
        <SectionHeader
          index="03 / Engine"
          title="Live from my GitHub."
          description="A live window into my repos, contribution heatmap and recent shipping."
          eyebrow={<GlowBadge variant="oss">Open source feed</GlowBadge>}
        />

        {/* Glass product window */}
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-card/[0.05] backdrop-blur-md shadow-card transition-all duration-500 hover:border-primary/30">
          {/* Title bar */}
          <div className="bg-secondary/40 border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400/80" />
              <span className="w-3 h-3 rounded-full bg-amber-400/80" />
              <span className="w-3 h-3 rounded-full bg-emerald-400/80" />
            </div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-muted-foreground">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              simon@github:~
            </div>
            <GlowBadge variant="live">Live</GlowBadge>
          </div>

          {/* Tabs */}
          <div
            className="flex items-center gap-1 px-4 py-2 border-b border-white/[0.06] bg-secondary/20 overflow-x-auto"
            role="tablist"
            aria-label="GitHub terminal tabs"
          >
            {TABS.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  tab === t.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Panel body */}
          <div className="p-5 md:p-7 font-mono text-sm min-h-[420px]">
            {tab === "overview" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-primary/90">
                  <span className="text-emerald-400 font-bold">
                    simon@github
                  </span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">neofetch</span>
                </div>

                {isLoading && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Loading GitHub data...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-start gap-2 text-red-400">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>
                      API rate limit may have been exceeded. Please try again
                      later.
                    </span>
                  </div>
                )}

                {profile && (
                  <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.login}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-xl grayscale contrast-125 brightness-90 border border-white/[0.06] object-cover"
                    />
                    <div className="space-y-2 border-l-2 border-primary/30 pl-6 w-full">
                      <p>
                        <span className="text-emerald-400">User</span>:{" "}
                        {profile.name || profile.login}
                      </p>
                      <p>
                        <span className="text-emerald-400">Bio</span>:{" "}
                        {profile.bio || "Software Developer"}
                      </p>
                      <p>
                        <span className="text-emerald-400">Repos</span>:{" "}
                        {profile.public_repos}
                      </p>
                      <p>
                        <span className="text-emerald-400">Followers</span>:{" "}
                        {profile.followers}
                      </p>
                      <button
                        onClick={onCopyHandle}
                        className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        github.com/{profile.login}
                        {copiedHandle ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "heatmap" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary/90">
                  <span className="text-emerald-400 font-bold">
                    simon@github
                  </span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">
                    ./contributions.sh --graph
                  </span>
                </div>
                <div className="overflow-x-auto pb-4 rounded-xl border border-white/[0.06] bg-background/40 p-4">
                  <img
                    src={getGitHubContributionChartUrl()}
                    alt="GitHub Contributions Heatmap"
                    className="w-full h-auto min-w-[640px]"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated daily · fetched from GitHub's public contribution API.
                </p>
              </div>
            )}

            {tab === "repos" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-primary/90">
                  <span className="text-emerald-400 font-bold">
                    simon@github
                  </span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">git log --oneline</span>
                </div>

                {reposLoading && (
                  <div className="flex items-center gap-2 text-blue-400">
                    <Loader2 className="animate-spin w-4 h-4" />
                    <span>Loading repositories…</span>
                  </div>
                )}

                {repos && repos.length > 0 && (
                  <ul className="divide-y divide-white/5">
                    {repos.map((repo) => (
                      <li key={repo.id} className="py-3">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold underline decoration-primary/30 hover:text-primary transition-colors"
                          >
                            {repo.name}
                          </a>
                          <div className="flex items-center gap-3 text-xs">
                            <span className="text-muted-foreground">
                              {repo.language || "Markdown"}
                            </span>
                            <span className="text-amber-300 font-mono">
                              ★ {repo.stargazers_count}
                            </span>
                          </div>
                        </div>
                        {repo.description && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            {repo.description}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GitHubTerminal;
