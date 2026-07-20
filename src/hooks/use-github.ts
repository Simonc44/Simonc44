import { useQuery } from "@tanstack/react-query";
import { fetchGitHubProfile, fetchGitHubRepos } from "@/lib/github";

export function useGitHubProfile() {
  return useQuery({
    queryKey: ["github", "profile"],
    queryFn: fetchGitHubProfile,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}

export function useGitHubRepos() {
  return useQuery({
    queryKey: ["github", "repos"],
    queryFn: fetchGitHubRepos,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: 1,
  });
}
