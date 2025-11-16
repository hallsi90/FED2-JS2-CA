// src/api/profiles.ts
// Provides all API operations for profiles:
// - Fetch a profile (with posts, followers, following)
// - Fetch only a profile's posts
// - Search profiles
// - Follow / unfollow profiles
// - Edit own profile

import { SOCIAL_BASE, getAuthHeaders } from "./config";
import { getToken } from "./storage";

/**
 * Get a single profile by name.
 * Include posts, followers, following.
 * GET /social/profiles/{name}?_posts=true&_followers=true&_following=true
 */
export async function getProfile(name: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to view a profile.");
  }

  const url = `${SOCIAL_BASE}/profiles/${encodeURIComponent(
    name
  )}?_posts=true&_followers=true&_following=true`;

  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not load this profile.";
    throw new Error(message);
  }

  return data.data; // Return profile object
}

/**
 * Get only posts for a profile
 * GET /social/profiles/{name}/posts?_author=true
 */
export async function getProfilePosts(name: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to view posts.");
  }

  const url = `${SOCIAL_BASE}/profiles/${encodeURIComponent(
    name
  )}/posts?_author=true`;

  const response = await fetch(url, {
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not load profile posts.";
    throw new Error(message);
  }

  return data.data; // Return array of posts
}

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
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || "Could not search profiles.";
    throw new Error(message);
  }

  return data.data; // Return array of profiles
}

/**
 * Follow a profile
 * PUT /social/profiles/{name}/follow
 */
export async function followProfile(name: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to follow a profile.");
  }

  const url = `${SOCIAL_BASE}/profiles/${encodeURIComponent(name)}/follow`;

  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not follow this profile.";
    throw new Error(message);
  }

  return data.data; // Return updated profile object
}

/**
 * Unfollow a profile
 * PUT /social/profiles/{name}/unfollow
 */
export async function unfollowProfile(name: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to unfollow a profile.");
  }

  const url = `${SOCIAL_BASE}/profiles/${encodeURIComponent(name)}/unfollow`;

  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(token),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not unfollow this profile.";
    throw new Error(message);
  }

  return data.data; // Return updated profile
}

/**
 * Edit own profile
 * PUT /social/profiles/{name}
 */
export async function updateProfile(
  name: string,
  payload: {
    bio?: string;
    avatar?: { url: string; alt?: string };
    banner?: { url: string; alt?: string };
  }
) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to edit your profile.");
  }

  const url = `${SOCIAL_BASE}/profiles/${encodeURIComponent(name)}`;

  const response = await fetch(url, {
    method: "PUT",
    headers: getAuthHeaders(token),
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not edit this profile.";
    throw new Error(message);
  }

  return data.data; // Return updated profile
}
