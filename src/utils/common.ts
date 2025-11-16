// src/utils/common.ts
// Shared UI helpers:
// - Login/Logout button handling
// - Create Post link visibility
// - Clickable post cards
// - Reusable status/message helpers

import { getToken, clearAuth } from "../api/storage";

/**
 * Handles clicking the "Log Out" button:
 * - Prevents default link navigation
 * - Clears all auth data
 * - Redirects to the feed page
 */
function handleLogoutClick(event: Event) {
  event.preventDefault();
  clearAuth();
  window.location.href = "/";
}

/**
 * Update the header's login/logout state and toggle the Create Post link.
 * - If logged in: "Log Out" is shown and Create Post link is visible.
 * - If logged out: "Log In" is shown and Create Post link is hidden.
 */
export function setupAuthButtons() {
  const loginLink =
    document.querySelector<HTMLAnchorElement>('a[href="/login/"]');
  const createPostLink =
    document.querySelector<HTMLAnchorElement>("#create-post-link");

  if (!loginLink) return;

  const token = getToken();

  if (token) {
    // Logged in -> show "Log Out"
    loginLink.textContent = "Log Out";
    loginLink.onclick = handleLogoutClick;

    if (createPostLink) {
      createPostLink.classList.remove("hidden");
    }
  } else {
    // Logged out -> show "Log In"
    loginLink.textContent = "Log In";
    loginLink.onclick = null;

    if (createPostLink) {
      createPostLink.classList.add("hidden");
    }
  }
}

/**
 * Makes each post card clickable to open the single post page,
 * while still allowing internal links (like the author link) to work normally.
 */
export function setupPostCardClicks(container: HTMLElement): void {
  if (!container) return;

  const cards = container.querySelectorAll<HTMLElement>(".post-card");

  cards.forEach((card) => {
    const postId = card.dataset.postId;
    if (!postId) return;

    card.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;

      // If clicking a link inside the card, do not override its behavior
      if (target.closest("a")) {
        return;
      }

      window.location.href = `/post/?id=${postId}`;
    });
  });
}

/**
 * Update a message/status element by:
 * - Setting the text
 * - Replacing its class with the given type
 * Used for inline status messages (loading, errors, success).
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
 * Show a message inside a specific element.
 * Used in forms like login, register, etc.
 */
export function showMessage(
  element: HTMLElement | null,
  text: string,
  type: "error" | "success" | "info" = "info"
) {
  if (!element) return;
  element.textContent = text;
  element.className = type;
}
