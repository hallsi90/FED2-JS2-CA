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

/** Make each post card clickable to open the single post page.
 * Clicking on links inside the card still works normally.
 */
export function setupPostCardClicks(container: HTMLElement): void {
  if (!container) return;

  const cards = container.querySelectorAll<HTMLElement>(".post-card");

  cards.forEach((card) => {
    const postId = card.dataset.postId;
    if (!postId) return;

    card.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // If the user clicked the author link, let the browser follow that link instead.
      if (target.closest("a")) {
        return;
      }

      // Otherwise, clicking anywhere on the card goes to the single post page
      window.location.href = `/post/?id=${postId}`;
    });
  });
}

/**
 * Update a status message element with text and style.
 * info, error, success
 */
export function updateStatus(
  el: HTMLElement | null,
  text: string,
  type: "error" | "success" | "info" | "" = ""
): void {
  if (!el) return;
  el.textContent = text;
  el.className = type;
}

/**
 * Show a message inside a target element (used for forms).
 */
export function showMessage(
  element: HTMLElement | null,
  text: string,
  type: "error" | "success" | "info" = "info"
) {
  if (!element) return;
  element.textContent = text;
  element.className = type; // Set class to style the message (error, success, info)
}
