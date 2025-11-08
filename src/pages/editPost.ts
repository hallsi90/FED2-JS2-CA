// src/pages/editPost.ts
// edit/delete an existing post
// load a post by id, prefill the form, allow editing and saving changes or deleting the post

import { requireAuth } from "../utils/authGuard";
import { getPostById, updatePost, deletePost } from "../api/posts";
import { getProfileName } from "../api/storage";
import { setupAuthButtons } from "../utils/common";

setupAuthButtons();
requireAuth(); // only logged in users can access this page

const form = document.querySelector<HTMLFormElement>("#editPostForm");
const statusEl = document.querySelector<HTMLElement>("#edit-status");

const titleInput = document.querySelector<HTMLInputElement>("#title");
const bodyInput = document.querySelector<HTMLTextAreaElement>("#body");
const mediaInput = document.querySelector<HTMLInputElement>("#mediaUrl");

// get id from URL
const params = new URLSearchParams(window.location.search);
const idParam = params.get("id");

if (!idParam) {
  showStatus("No post ID provided.", "error");
} else {
  // load the post to prefill the form
  loadPost(Number(idParam));
}

async function loadPost(id: number) {
  showStatus("Loading post...", "info");

  try {
    const post = await getPostById(id);

    // check ownership (extra safety in UI)
    const currentUser = getProfileName();
    if (currentUser && post.author?.name && post.author.name !== currentUser) {
      showStatus("You can only edit your own posts.", "error");
      // could also disable the form here
      if (form) {
        form.style.display = "none";
      }
      return;
    }

    // prefill form
    if (titleInput) titleInput.value = post.title || "";
    if (bodyInput) bodyInput.value = post.body || "";
    if (mediaInput) mediaInput.value = post.media?.url || "";

    showStatus(""); // clear status
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load post.", "error");
    }
  }
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!idParam) {
      showStatus("Missing post ID.", "error");
      return;
    }

    const postId = Number(idParam);

    const title = titleInput?.value.trim() || "";
    const body = bodyInput?.value.trim() || "";
    const mediaUrl = mediaInput?.value.trim() || "";

    if (!title) {
      showStatus("Title is required.", "error");
      return;
    }

    // build payload
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
      showStatus("Updating post...", "info");
      const updated = await updatePost(postId, payload);

      showStatus("Post updated! Redirecting...", "success");

      // redirect to the single post view
      window.location.href = `/post/?id=${updated.id}`;
    } catch (error) {
      if (error instanceof Error) {
        showStatus(error.message, "error");
      } else {
        showStatus("Could not update post.", "error");
      }
    }
  });
}

function showStatus(
  text: string,
  type: "error" | "success" | "info" | "" = ""
) {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = type;
}

/**
 * Delete post button
 */
const deleteBtn = document.querySelector<HTMLButtonElement>("#delete-post-btn");

if (deleteBtn) {
  deleteBtn.addEventListener("click", async () => {
    if (!idParam) {
      showStatus("Missing post ID.", "error");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    try {
      showStatus("Deleting post...", "info");
      await deletePost(Number(idParam));

      const me = getProfileName();
      if (me) {
        window.location.href = `/profile/?name=${encodeURIComponent(me)}`;
      } else {
        window.location.href = "/";
      }
    } catch (error) {
      if (error instanceof Error) {
        showStatus(error.message, "error");
      } else {
        showStatus("Could not delete post.", "error");
      }
    }
  });
}
