// src/api/storage.ts

// We keep the keys in variables so we don't accidentally mistype them.
const TOKEN_KEY = "accessToken";
const PROFILE_NAME_KEY = "profileName";

/**
 * Save the token and the profile name to localStorage.
 * We call this right after a successful login.
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
 * If the user is not logged in, this will return null.
 */
export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get the profile name (username) from localStorage.
 * We'll use this when we load "my profile" later.
 */
export function getProfileName(): string | null {
  return localStorage.getItem(PROFILE_NAME_KEY);
}

/**
 * Remove all auth info from localStorage.
 * We will use this for a "Log out" button
 */
export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PROFILE_NAME_KEY);
}
