// src/pages/post.ts
// Loads a single post by ID

import { getPostById, deletePost } from "../api/posts";
import { renderFullPost } from "../ui/renderFullPost";
import { setupAuthButtons, updateStatus } from "../utils/common";
import { getProfileName } from "../api/storage";
import { setupScrollToTop } from "../utils/scrollToTop";

const root = document.querySelector<HTMLElement>("#post-root");
const status = document.querySelector<HTMLElement>("#post-status");

// Run on load
setupAuthButtons();
setupScrollToTop();
loadPost();

async function loadPost() {
  if (!root || !status) return;

  // Get post ID from URL
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");
  const id = idParam ? Number(idParam) : NaN;

  if (!idParam || Number.isNaN(id)) {
    updateStatus(status, "Invalid or missing post id.", "error");
    document.title = "Post not found | Noroff Social App";
    return; // Stop here
  }

  updateStatus(status, "Loading post...", "info");

  try {
    const post = await getPostById(id);

    // Render post HTML
    root.innerHTML = renderFullPost(post);
    updateStatus(status, ""); // Clear message

    // Set browser tab title based on post title
    const safeTitle = post.title?.trim() || "Post";
    document.title = `${safeTitle} - Post | Noroff Social App`;

    // Show edit button only if this is MY post
    const currentUser = getProfileName(); // Stored at login
    const postAuthor = post.author?.name;

    if (currentUser && postAuthor && currentUser === postAuthor) {
      const actionsWrapper = document.createElement("div");
      actionsWrapper.className = "post-actions";

      // EDIT link
      const editPostLink = document.createElement("a");
      editPostLink.href = `/post/edit.html?id=${post.id}`;
      editPostLink.textContent = "Edit Post";
      editPostLink.className = "post-actions-button";

      // DELETE button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Post";
      deleteBtn.type = "button";
      deleteBtn.className = "post-actions-button";

      deleteBtn.addEventListener("click", async () => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this post? This cannot be undone."
        );
        if (!confirmed) return;

        try {
          updateStatus(status, "Deleting post...", "info");
          await deletePost(post.id);
          // redirect to my profile
          const me = getProfileName();
          if (me) {
            window.location.href = `/profile/?name=${encodeURIComponent(me)}`;
          } else {
            window.location.href = "/";
          }
        } catch (error) {
          if (error instanceof Error) {
            updateStatus(status, error.message, "error");
          } else {
            updateStatus(status, "Could not delete post.", "error");
          }
        }
      });

      actionsWrapper.appendChild(editPostLink);
      actionsWrapper.appendChild(deleteBtn);
      root.appendChild(actionsWrapper);
    }
  } catch (error) {
    if (error instanceof Error) {
      updateStatus(status, error.message, "error");
    } else {
      updateStatus(status, "Could not load this post.", "error");
    }
  }
}
