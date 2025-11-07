// src/pages/createPost.ts
// handles the create post form

import { requireAuth } from "../utils/authGuard";
import { createPost } from "../api/posts";

requireAuth(); // make sure only logged-in users can access this page

const form = document.querySelector<HTMLFormElement>("#createPostForm");
const message = document.querySelector<HTMLElement>("#create-message");

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const title = formData.get("title") as string;
    const body = (formData.get("body") as string) || "";
    const mediaUrl = (formData.get("mediaUrl") as string) || "";

    // basic validation first
    if (!title) {
      showMessage("Title is required.", "error");
      return;
    }

    // build payload for API
    const payload: {
      title: string;
      body?: string;
      media?: { url: string; alt?: string };
    } = { title };

    if (body.trim() !== "") {
      payload.body = body.trim();
    }

    // only add media if user entered a URL
    if (mediaUrl.trim() !== "") {
      payload.media = {
        url: mediaUrl.trim(),
        alt: title,
      };
    }

    try {
      showMessage("Creating post...", "info");

      const newPost = await createPost(payload);

      showMessage("Post created! Redirecting...", "success");

      // redirect to the single post page so user can see their new post
      window.location.href = `/post/?id=${newPost.id}`;
    } catch (error) {
      if (error instanceof Error) {
        showMessage(error.message, "error");
      } else {
        showMessage("Something went wrong while creating the post.", "error");
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
  message.className = type;
}
