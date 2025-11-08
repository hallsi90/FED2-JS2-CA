// src/utils/common.ts
// Handles login state and logout button visibility
// Handles create post link visibility

import { getToken, clearAuth } from "../api/storage";

function handleLogoutClick(event: Event) {
  event.preventDefault(); // prevent default link behavior
  clearAuth(); // removes accessToken and profileName from localStorage
  window.location.href = "/"; // redirect to feed after logout
}

export function setupAuthButtons() {
  // login/logout link
  const loginLink =
    document.querySelector<HTMLAnchorElement>('a[href="/login/"]');
  // create post link
  const createPostLink =
    document.querySelector<HTMLAnchorElement>("#create-post-link");

  if (!loginLink) return;

  const token = getToken();

  if (token) {
    // User is logged in -> show logout button
    loginLink.textContent = "Log Out";
    // clicking the link logs the user out
    loginLink.onclick = handleLogoutClick;

    if (createPostLink) {
      createPostLink.classList.remove("hidden");
    }
  } else {
    // User is not logged in -> show log in button
    loginLink.textContent = "Log In";
    loginLink.onclick = null;

    if (createPostLink) {
      createPostLink.classList.add("hidden");
    }
  }
}
