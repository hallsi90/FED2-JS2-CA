// src/api/profiles.ts
// getProfile(), getUserPosts(), followUser(), unfollowUser()

import { SOCIAL_BASE, getAuthHeaders, NOROFF_API_KEY } from "./config";
import { getToken } from "./storage";

/**
 * Search profiles by name or bio.
 * GET /social/profiles/search?q=<query>
 */
export async function searchProfiles(query: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to search profiles.");
  }

  const url = `${SOCIAL_BASE}/profiles/search?q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(token),
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || "Could not search profiles.";
    throw new Error(message);
  }

  return data.data; // return array of profiles
}
