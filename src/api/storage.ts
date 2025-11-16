// src/api/storage.ts
// Handles storing and retrieving authentication data in localStorage:
// - Save token and profile name after login
// - Get token
// - Get profile name
// - Check login state
// - Clear auth on logout

// localStorage keys (kept as constants to avoid typos)
const TOKEN_KEY = "accessToken";
const PROFILE_NAME_KEY = "profileName";

/**
 * Save the token and the profile name to localStorage.
 * Called immediately after a successful login.
 *
 * @param token - the accessToken we got from the API
 * @param name - the user's profile name (used to fetch /profiles/{name})
 */
export function saveAuth(token: string, name: string) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PROFILE_NAME_KEY, name);
}

/**
 * Get the token from localStorage.
 * Returns null if not logged in.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the profile name (username) from localStorage.
 * Used to fetch the logged-in user's profile.
 */
export function getProfileName(): string | null {
  return localStorage.getItem(PROFILE_NAME_KEY);
}

/**
 * Simple helper: Check if the user is logged in.
 */
export function isLoggedIn(): boolean {
  return Boolean(getToken());
}

/**
 * Remove all auth info from localStorage.
 * Used by the "Log Out" button.
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_NAME_KEY);
}
