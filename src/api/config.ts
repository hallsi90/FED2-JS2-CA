// src/api/config.ts

/**
 * Base URL for the Noroff API (version 2).
 * Every endpoint we use in this project starts with this.
 */

export const API_BASE = "https://v2.api.noroff.dev";

/**
 * Base URL for social endpoints (posts, profiles, follow, etc.).
 * Used whenever we work with social content.
 */
export const SOCIAL_BASE = `${API_BASE}/social`;

/**
 * Base URL for authentication endpoints (register, login).
 */
export const AUTH_BASE = `${API_BASE}/auth`;

/**
 * Returns default headers for JSON requests.
 * Used for requests that don't require the user to be logged in.
 */
export function getJsonHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
  };
}

/**
 * Returns headers for requests that require the user to be logged in.
 * The token is passed in and added to the Authorization header.
 *
 * @param token - Access token received from the login endpoint.
 * @returns Headers with both Content-Type and Authorization
 */
export function getAuthHeaders(token: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}
