import { Terminal, Loader2, AlertCircle } from "lucide-react";
import { useGitHubProfile, useGitHubRepos } from "@/hooks/use-github";
import { getGitHubContributionChartUrl } from "@/lib/github";
import { FadeIn } from "@/components/animations/FadeIn";

const GitHubTerminal = () => {
  const { data: profile, isLoading: profileLoading, error: profileError } = useGitHubProfile();
  const { data: repos, isLoading: reposLoading } = useGitHubRepos();

  const isLoading = profileLoading || reposLoading;
  const error = profileError;

  return (
    <section id="terminal" className="py-24 px-4 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />

      <div className="container max-w-6xl mx-auto relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-4">
          <FadeIn>
            <p className="text-sm font-mono tracking-widest uppercase text-primary/70">
              Open source
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h2 className="text-4xl md:text-5xl font-serif font-medium">
              My GitHub <span className="text-gradient">Terminal</span>
            </h2>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-muted-foreground">
              A live dashboard of my GitHub activity, projects, and contributions.
            </p>
          </FadeIn>
        </div>

        {/* Terminal Wrapper */}
        <FadeIn delay={0.3}>
          <div className="bg-card/80 backdrop-blur-md rounded-2xl border border-border/60 shadow-card overflow-hidden max-w-5xl mx-auto transition-all duration-500 hover:border-primary/30">
            {/* Terminal Title Bar */}
            <div className="bg-secondary/50 border-b border-border/60 px-6 py-4 flex items-center justify-between">
              <div className="flex gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-red-400/80" />
                <span className="w-3.5 h-3.5 rounded-full bg-amber-400/80" />
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/80" />
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
                <Terminal className="w-4 h-4 text-primary" />
                simon@github: ~
              </div>
              <div className="w-14" />
            </div>

            {/* Terminal Body */}
            <div className="p-6 md:p-8 space-y-8 font-mono">
              {/* Heatmap Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm md:text-base text-primary/80">
                  <span className="text-green-400 font-bold">simon@github</span>
                  <span className="text-muted-foreground">:</span>
                  <span className="text-blue-400 font-bold">~</span>
                  <span className="text-muted-foreground">$</span>
                  <span className="text-foreground">./contributions.sh --graph</span>
                </div>
                <div className="overflow-x-auto pb-4">
                  <img
                    src={getGitHubContributionChartUrl()}
                    alt="GitHub Contributions Heatmap"
                    className="w-full h-auto min-w-[700px] rounded-lg border border-border/60 bg-card/50 p-4"
                  />
                </div>
              </div>

              {/* Profile Section */}
              <div className="space-y-4 pt-4 border-t border-border/60">
                <div className="flex items-center gap-2 text-sm md:text-base text-primary/80">
                  <span className="text-green-400 font-bold">simon@github</span>
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
                      Error fetching GitHub data. The API rate limit may have been exceeded. Please try again later.
                    </span>
                  </div>
                )}

                {profile && (
                  <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-sm">
                    <img
                      src={profile.avatar_url}
                      alt={profile.name || profile.login}
                      className="w-48 h-48 rounded-lg grayscale contrast-125 brightness-90 border border-border/60 object-cover"
                    />
                    <div className="space-y-2 border-l-2 border-primary/30 pl-6 w-full">
                      <p>
                        <span className="text-green-400 font-bold">User</span>: {profile.name || profile.login}
                      </p>
                      <p>
                        <span className="text-green-400 font-bold">Bio</span>: {profile.bio || "Software Developer"}
                      </p>
                      <p>
                        <span className="text-green-400 font-bold">Repos</span>: {profile.public_repos}
                      </p>
                      <p>
                        <span className="text-green-400 font-bold">Followers</span>: {profile.followers}
                      </p>

                      {repos && repos.length > 0 && (
                        <div className="mt-6 pt-4 border-t border-border/60">
                          <p className="text-blue-400 mb-3">Recent Projects:</p>
                          <ul className="space-y-3">
                            {repos.map((repo) => (
                              <li key={repo.id} className="text-xs">
                                <a
                                  href={repo.html_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold underline hover:text-primary transition-colors cursor-pointer"
                                >
                                  {repo.name}
                                </a>
                                <span className="text-muted-foreground ml-2">
                                  ({repo.language || "Markdown"}) — ⭐ {repo.stargazers_count}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};

export default GitHubTerminal;
