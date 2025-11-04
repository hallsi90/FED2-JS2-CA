// src/api/posts.ts
// functions for working with Noroff Social posts
// getPosts(), getPostById(), createPost(), editPost(), deletePost(), searchPosts()

import { SOCIAL_BASE, getAuthHeaders, NOROFF_API_KEY } from "./config";
import { getToken } from "./storage";

/**
 * Fetch all posts
 * The social endpoints are authenticated, so we must send the token.
 * We can later add query params like ?_author=true if we want more data.
 */
export async function getAllPosts() {
  const token = getToken();

  // if the user is not logged in, we cannot fetch posts
  if (!token) {
    throw new Error("You must be logged in to view posts.");
  }

  const url = `${SOCIAL_BASE}/posts?_author=true`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(token),
      "X-Noroff-API-Key": NOROFF_API_KEY,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not fetch posts from API.";
    throw new Error(message);
  }

  return data.data;
}
