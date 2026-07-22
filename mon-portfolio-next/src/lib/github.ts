import type {
  GithubProfile,
  GithubRepo,
  GithubLanguageMap,
  GithubData,
} from "@/types/github";

const GITHUB_USERNAME = "Simonc44";
const BASE = "https://api.github.com";

function getHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    ...(process.env.GITHUB_TOKEN
      ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
      : {}),
  };
}

/** Top N repos to fetch language breakdowns for (API-quota aware). */
const LANG_FETCH_TOP_N = 8;

async function ghFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`GitHub API ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

/**
 * Fetch GitHub profile, repos, and aggregated language data.
 * Used by both the server-rendered page and the API route.
 */
export async function getGithubData(): Promise<GithubData> {
  const [profile, allRepos] = await Promise.all([
    ghFetch<GithubProfile>(`/users/${GITHUB_USERNAME}`),
    ghFetch<GithubRepo[]>(
      `/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`
    ),
  ]);

  // Filter out forks and archived repos, keep most interesting ones.
  const ownRepos = allRepos
    .filter((r) => !r.fork && !r.archived)
    .sort((a, b) => b.stargazers_count - a.stargazers_count);

  // Fetch language breakdowns for top N repos in parallel.
  const topForLang = ownRepos.slice(0, LANG_FETCH_TOP_N);
  const langMaps = await Promise.allSettled(
    topForLang.map((repo) =>
      ghFetch<GithubLanguageMap>(`/repos/${GITHUB_USERNAME}/${repo.name}/languages`)
    )
  );

  // Aggregate language bytes across all fetched repos.
  const aggregatedLanguages: GithubLanguageMap = {};
  for (const result of langMaps) {
    if (result.status === "fulfilled") {
      for (const [lang, bytes] of Object.entries(result.value)) {
        aggregatedLanguages[lang] = (aggregatedLanguages[lang] ?? 0) + bytes;
      }
    }
  }

  return {
    profile,
    repos: ownRepos,
    aggregatedLanguages,
    fetchedAt: new Date().toISOString(),
  };
}
