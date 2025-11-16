// src/utils/authGuard.ts
// Ensures a user is authenticated before accessing protected pages.

import { getToken } from "../api/storage";

/**
 * Redirects to the login page if no valid auth token is found.
 * Should be imported and called at the top of any page that requires authentication
 * (e.g., create post, edit post, edit profile, etc.).
 */
export function requireAuth() {
  const token = getToken();

  // If no token, redirect to login page
  if (!token) {
    window.location.href = "/login/";
    return;
  }
}
