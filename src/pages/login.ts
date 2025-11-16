// src/pages/login.ts
// Handles login form submission

import { loginUser } from "../api/auth";
import { setupAuthButtons, showMessage } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

setupAuthButtons();
setupScrollToTop();

// Grab the form and the place where we show messages
const form = document.querySelector<HTMLFormElement>("#loginForm");
const message = document.querySelector<HTMLElement>("#loginMessage");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the page from reloading

    // Read the values from the form
    const formData = new FormData(form);
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    // Basic check before calling the API
    if (!email || !password) {
      showMessage(message, "Please enter both email and password.", "error");
      return;
    }

    try {
      showMessage(message, "Logging in...", "info");

      // Call the API function (this will save the token if it works)
      await loginUser({ email, password });
      showMessage(message, "Login successful! Redirecting...", "success");
      // Redirect the user to the feed/posts page
      window.location.href = "/";
    } catch (error) {
      if (error instanceof Error) {
        showMessage(message, error.message, "error");
      } else {
        showMessage(message, "Login failed. Please try again.", "error");
      }
    }
  });
}
