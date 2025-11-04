// src/api/auth.ts
// register, login and (optionally) create API key

import { AUTH_BASE, getJsonHeaders } from "./config";
import { saveAuth } from "./storage";

/**
 * The data we send to the register endpoint.
 * Only name, email and password are required.
 * The rest is optional and can be added later.
 */

interface RegisterBody {
  name: string;
  email: string;
  password: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
}

/**
 * The data we send to the login endpoint.
 */
interface LoginBody {
  email: string;
  password: string;
}

/**
 * Register a new user at POST https://v2.api.noroff.dev/auth/register
 * Note from docs:
 * - email must be a stud.noroff.no address
 * - password must be at least 8 characters
 * - name must not contain punctuation except underscore
 *
 * Registering does not log the user in, just creates the account.
 */
export async function registerUser(body: RegisterBody) {
  const response = await fetch(`${AUTH_BASE}/register`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message ||
      "Could not register user. Please try again.";
    throw new Error(message);
  }

  // registration succeeded
  return data;
}

/**
 * Log in an existing user at POST https://v2.api.noroff.dev/auth/login
 * On success we store the token + name in localStorage.
 */
export async function loginUser(body: LoginBody) {
  const response = await fetch(`${AUTH_BASE}/login`, {
    method: "POST",
    headers: getJsonHeaders(),
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message || "Login failed. Please try again.";
    throw new Error(message);
  }

  const accessToken = data?.data?.accessToken;
  const name = data?.data?.name;

  // Only save if we have both token and name
  if (accessToken && name) {
    saveAuth(accessToken, name);
  }

  return data;
}

/**
 * (Optional) - not sure if I need api key yet!
 * Create an API key for the logged-in user.
 * Endpoint: POST /auth/create-api-key
 * This requires that the user is already logged in, because we have to send the Authorization header.
 */
/*
export async function createAPIKey(
  token: string,
  name = "Course Assignment Key"
) {
  const response = await fetch(`${AUTH_BASE}/create-api-key`, {
    method: "POST",
    headers: {
      ...getJsonHeaders(),
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message ||
      "Could not create API key. Please try again.";
    throw new Error(message);
  }

  return data;
}
*/
