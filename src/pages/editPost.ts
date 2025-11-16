// src/pages/editPost.ts
// Edit/delete an existing post:
// - Load a post by ID
// - Prefill the form
// - Allow editing/saving or deleting the post

import { requireAuth } from "../utils/authGuard";
import { getPostById, updatePost, deletePost } from "../api/posts";
import { getProfileName } from "../api/storage";
import { setupAuthButtons, updateStatus } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

setupAuthButtons();
requireAuth();
setupScrollToTop();

const form = document.querySelector<HTMLFormElement>("#editPostForm");
const statusEl = document.querySelector<HTMLElement>("#edit-status");

const titleInput = document.querySelector<HTMLInputElement>("#title");
const bodyInput = document.querySelector<HTMLTextAreaElement>("#body");
const mediaInput = document.querySelector<HTMLInputElement>("#mediaUrl");

// Get ID from URL
const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");
const postId = idParam ? Number(idParam) : NaN;

if (!idParam || Number.isNaN(postId)) {
  updateStatus(statusEl, "Invalid or missing post ID.", "error");
  if (form) {
    form.style.display = "none";
  }
} else {
  // Load the post to prefill the form
  loadPost(postId);
}

async function loadPost(id: number) {
  updateStatus(statusEl, "Loading post...", "info");

  try {
    const post = await getPostById(id);

    // Check ownership (extra safety in UI)
    const currentUser = getProfileName();
    if (currentUser && post.author?.name && post.author.name !== currentUser) {
      updateStatus(statusEl, "You can only edit your own posts.", "error");
      if (form) {
        form.style.display = "none";
      }
      return;
    }

    // Prefill form
    if (titleInput) titleInput.value = post.title || "";
    if (bodyInput) bodyInput.value = post.body || "";
    if (mediaInput) mediaInput.value = post.media?.url || "";

    updateStatus(statusEl, ""); // Clear status
  } catch (error) {
    if (error instanceof Error) {
      updateStatus(statusEl, error.message, "error");
    } else {
      updateStatus(statusEl, "Could not load post.", "error");
    }
  }
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!idParam || Number.isNaN(postId)) {
      updateStatus(statusEl, "Missing or invalid post ID.", "error");
      return;
    }

    const title = titleInput?.value.trim() || "";
    const body = bodyInput?.value.trim() || "";
    const mediaUrl = mediaInput?.value.trim() || "";

    if (!title) {
      updateStatus(statusEl, "Title is required.", "error");
      return;
    }

    // Build payload
    const payload: {
      title: string;
      body?: string;
      media?: { url: string; alt?: string };
    } = { title };

    if (body !== "") {
      payload.body = body;
    }

    if (mediaUrl !== "") {
      payload.media = {
        url: mediaUrl,
        alt: title,
      };
    }

    try {
      updateStatus(statusEl, "Updating post...", "info");
      const updated = await updatePost(postId, payload);

      updateStatus(statusEl, "Post updated! Redirecting...", "success");

      // Redirect to the single post view
      window.location.href = `/post/?id=${updated.id}`;
    } catch (error) {
      if (error instanceof Error) {
        updateStatus(statusEl, error.message, "error");
      } else {
        updateStatus(statusEl, "Could not update post.", "error");
      }
    }
  });
}

/**
 * Delete post button
 */
const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-post-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    if (!idParam || Number.isNaN(postId)) {
      updateStatus(statusEl, "Missing or invalid post ID.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      updateStatus(statusEl, "Deleting post...", "info");
      await deletePost(postId);

      const me = getProfileName();
      if (me) {
        window.location.href = `/profile/?name=${encodeURIComponent(me)}`;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error instanceof Error) {
        updateStatus(statusEl, error.message, "error");
      } else {
        updateStatus(statusEl, "Could not delete post.", "error");
      }
    }
  });
}
