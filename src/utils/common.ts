// src/utils/common.ts
// Handles login state and logout button visibility

import { getToken, clearAuth } from "../api/storage";

function handleLogoutClick(event: Event) {
  event.preventDefault(); // prevent default link behavior
  clearAuth(); // removes accessToken and profileName from localStorage
  window.location.href = "/"; // redirect to feed after logout
}

export function setupAuthButtons() {
  const loginLink =
    document.querySelector<HTMLAnchorElement>('a[href="/login/"]');
  if (!loginLink) return;

  const token = getToken();

  if (token) {
    // User is logged in -> show logout button
    loginLink.textContent = "Log Out";
    // clicking the link logs the user out
    loginLink.addEventListener("click", handleLogoutClick);
  } else {
    // User is not logged in -> show log in button
    loginLink.textContent = "Log In";
  }
}
