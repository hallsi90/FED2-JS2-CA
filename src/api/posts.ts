// src/api/posts.ts
// Provides all API operations for social posts:
// - Fetching posts (all, by ID, search)
// - Creating, editing, and deleting posts
// Uses authenticated requests and always returns `data.data`for consistency.

import { SOCIAL_BASE, getAuthHeaders } from "./config";
import { getToken } from "./storage";

/**
 * Fetch all posts for the currently logged in user.
 *
 * Sends a GET request to `/posts?_author=true`and returns an array of posts,
 * including each post's author information.
 *
 * @returns {Promise<any[]>} - Resolves with an array of post objects from the API.
 * @throws {Error} - Throws an error if the user is not logged in or if the API request fails.
 */
export async function getAllPosts() {
  const token = getToken();

  // If the user is not logged in, we cannot fetch posts
  if (!token) {
    throw new Error("You must be logged in to view posts.");
  }

  // Include author info
  const url = `${SOCIAL_BASE}/posts?_author=true`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(token),
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

/**
 * Fetch single post by ID
 */
export async function getPostById(id: number) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to view this post.");
  }

  const url = `${SOCIAL_BASE}/posts/${id}?_author=true&_comments=true&_reactions=true`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(token),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    // If id is wrong, API will return 404
    const message = data?.errors?.[0]?.message || "Could not load this post.";
    throw new Error(message);
  }
  return data.data;
}

/**
 * Search for posts by title or body/content
 */
export async function searchPosts(query: string) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to search posts.");
  }

  const url = `${SOCIAL_BASE}/posts/search?q=${encodeURIComponent(
    query
  )}&_author=true`;

  const response = await fetch(url, {
    headers: {
      ...getAuthHeaders(token),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    const message = data?.errors?.[0]?.message || "Could not search posts.";
    throw new Error(message);
  }
  return data.data;
}

/**
 * Create a new post for the currently logged in user.
 *
 * Sends a POST request to `/posts` with the given payload, and returns
 * the created post from the API.
 *
 * @param {{
 *  title: string;
 *  body?: string;
 *  media?: { url: string; alt?: string };
 *  tags?: string[];
 * }} payload - The post data to create, where `title` is required and
 * `body`, `media`, and `tags` are optional.
 * @returns {Promise<any>} - Resolves with the created post object from the API.
 * @throws {Error} - Throws an error if the user is not logged in or if the API request fails.
 */
export async function createPost(payload: {
  title: string;
  body?: string;
  media?: {
    url: string;
    alt?: string;
  };
  tags?: string[];
}) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to create a post.");
  }

  const response = await fetch(`${SOCIAL_BASE}/posts`, {
    method: "POST",
    headers: {
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not create post. Please try again.";
    throw new Error(message);
  }

  // API returns the created post
  return data.data;
}

/**
 * Edit an existing post
 */
export async function updatePost(
  id: number,
  payload: {
    title: string;
    body?: string;
    media?: { url: string; alt?: string };
    tags?: string[];
  }
) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to edit a post.");
  }

  const response = await fetch(`${SOCIAL_BASE}/posts/${id}`, {
    method: "PUT",
    headers: {
      ...getAuthHeaders(token),
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Could not update post. Please try again.";
    throw new Error(message);
  }

  return data.data; // Updated post
}

/**
 * Delete a post
 */
export async function deletePost(id: number) {
  const token = getToken();
  if (!token) {
    throw new Error("You must be logged in to delete a post.");
  }

  const response = await fetch(`${SOCIAL_BASE}/posts/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeaders(token),
    },
  });

  // DELETE returns 204 No Content on success
  if (!response.ok) {
    // Try to read error body if it exists
    let message = "Could not delete post.";
    try {
      const data = await response.json();
      message = data?.errors?.[0]?.message || message;
    } catch {
      // Ignore JSON parse errors, keep default message
    }
    throw new Error(message);
  }
}
