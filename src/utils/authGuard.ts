// authGuard.ts
// check if logged in, maybe redirect if not

import { getToken } from "../api/storage";

/**
 * Check if the user is logged in.
 * If there is no token in localStorage, redirect to login page.
 * Import this function to any page that require login (like create/edit/delete post)
 */
export function requireAuth() {
  const token = getToken();

  // If no token, redirect to login page
  if (!token) {
    window.location.href = "/login/";
    return;
  }
}
