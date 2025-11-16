// src/pages/createPost.ts
// Handles the create post form

import { requireAuth } from "../utils/authGuard";
import { createPost } from "../api/posts";
import { setupAuthButtons, showMessage } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

setupAuthButtons();
requireAuth();
setupScrollToTop();

const form = document.querySelector<HTMLFormElement>("#createPostForm");
const message = document.querySelector<HTMLElement>("#create-message");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    // Trim all values once
    const title = (formData.get("title") as string).trim();
    const body = ((formData.get("body") as string) || "").trim();
    const mediaUrl = ((formData.get("mediaUrl") as string) || "").trim();

    // Basic validation first
    if (!title) {
      showMessage(message, "Title is required.", "error");
      return;
    }

    // Build payload for API
    const payload: {
      title: string;
      body?: string;
      media?: { url: string; alt?: string };
    } = { title };

    if (body !== "") {
      payload.body = body;
    }

    // Only add media if user entered a URL
    if (mediaUrl !== "") {
      payload.media = {
        url: mediaUrl,
        alt: title, // Trimmed title
      };
    }

    try {
      showMessage(message, "Creating post...", "info");

      const newPost = await createPost(payload);

      showMessage(message, "Post created! Redirecting...", "success");

      // Redirect to the single post page so user can see their new post
      window.location.href = `/post/?id=${newPost.id}`;
    } catch (error) {
      if (error instanceof Error) {
        showMessage(message, error.message, "error");
      } else {
        showMessage(
          message,
          "Something went wrong while creating the post.",
          "error"
        );
      }
    }
  });
}
