// src/pages/register.ts
// Handles register form submission

import { registerUser } from "../api/auth";
import { setupAuthButtons, showMessage } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

setupAuthButtons();
setupScrollToTop();

// Grab the form and the place where we show messages
const form = document.querySelector<HTMLFormElement>("#registerForm");
const message = document.querySelector<HTMLElement>("#registerMessage");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop the page from reloading

    // Read the values from the form
    const formData = new FormData(form);
    const name = (formData.get("name") as string).trim();
    const email = (formData.get("email") as string).trim();
    const password = (formData.get("password") as string).trim();

    // The API has rules, so let's check the basics first
    if (!name || !email || !password) {
      showMessage(message, "Please fill in all fields.", "error");
      return;
    }

    try {
      showMessage(message, "Creating account...", "info");
      await registerUser({ name, email, password });
      showMessage(
        message,
        "Account created! Redirecting to login...",
        "success"
      );
      // Redirect to login page
      window.location.href = "/login/";
    } catch (error) {
      if (error instanceof Error) {
        showMessage(message, error.message, "error");
      } else {
        showMessage(message, "Could not register user.", "error");
      }
    }
  });
}
