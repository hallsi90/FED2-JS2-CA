// src/pages/login.ts
// handles login form submission

import { loginUser } from "../api/auth";
import { setupAuthButtons } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

setupAuthButtons();
setupScrollToTop();

// Grab the form and the place where we show messages
const form = document.querySelector<HTMLFormElement>("#loginForm");
const message = document.querySelector<HTMLElement>("#loginMessage");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading

    // Read the values from the form
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Basic check before calling the API
    if (!email || !password) {
      showMessage("Please enter both email and password.", "error");
      return;
    }

    try {
      showMessage("Logging in...", "info");

      // Call the API function (this will save the token if it works)
      await loginUser({ email, password });
      showMessage("Login successful! Redirecting...", "success");

      // Redirect the user to the feed/posts page
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, "error");
      } else {
        showMessage("Login failed. Please try again.", "error");
      }
    }
  });
}

/**
 * Helper to show a message under the form.
 */

function showMessage(
  text: string,
  type: "error" | "success" | "info" = "info"
) {
  if (!message) return;
  message.textContent = text;
  message.className = type; // set class to style the message (error, success, info)
}
