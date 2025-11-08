// src/pages/register.ts
// handles register form submission

import { registerUser } from "../api/auth";
import { setupAuthButtons } from "../utils/common";

setupAuthButtons();

// Grab the form and the place where we show messages
const form = document.querySelector<HTMLFormElement>("#registerForm");
const message = document.querySelector<HTMLElement>("#registerMessage");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading

    // Read the values from the form
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // The API has rules, so let's check the basics first
    if (!name || !email || !password) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    try {
      showMessage("Creating account...", "info");
      await registerUser({ name, email, password });
      showMessage("Account created! Redirecting to login...", "success");
      // Redirect to login page
      window.location.href = "/login/";
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, "error");
      } else {
        showMessage("Could not register user.", "error");
      }
    }
  });
}

function showMessage(
  text: string,
  type: "error" | "success" | "info" = "info"
) {
  if (!message) return;
  message.textContent = text;
  message.className = type; // set class to style the message (error, success, info)
}
