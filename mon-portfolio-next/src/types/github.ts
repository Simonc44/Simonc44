/** GitHub API — strict TypeScript contracts for the portfolio data layer. */

export interface GithubProfile {
  login: string;
  name: string | null;
  avatar_url: string;
  html_url: string;
  blog: string | null;
  bio: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  watchers_count: number;
  forks_count: number;
  open_issues_count: number;
  topics: string[];
  pushed_at: string;
  created_at: string;
  updated_at: string;
  visibility: "public" | "private";
  fork: boolean;
  archived: boolean;
  size: number;
}

/** Language name → byte count, returned by `/repos/{owner}/{repo}/languages`. */
export type GithubLanguageMap = Record<string, number>;

export interface GithubData {
  profile: GithubProfile;
  repos: GithubRepo[];
  /**
   * Aggregated language byte-counts across the top repos, sorted descending
   * by usage. Used to generate the WavyTicker skill pills.
   */
  aggregatedLanguages: GithubLanguageMap;
  fetchedAt: string;
}

/** Minimal subset surfaced to client components (omits heavy repo arrays). */
export type GithubSummary = Pick<
  GithubData,
  "profile" | "aggregatedLanguages" | "fetchedAt"
> & {
  topRepos: GithubRepo[];
};

/** Language colour map — covers all languages present in Simonc44's repos. */
export const LANGUAGE_COLORS: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f7df1e",
  Rust: "#ce422b",
  Python: "#3572a5",
  HTML: "#e34c26",
  CSS: "#563d7c",
  "C++": "#f34b7d",
  Go: "#00add8",
  Shell: "#89e051",
  Kotlin: "#a97bff",
  Swift: "#f05138",
};
