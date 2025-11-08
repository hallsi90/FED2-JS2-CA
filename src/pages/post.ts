// src/pages/post.ts
// loads a single post by ID

import { getPostById, deletePost } from "../api/posts";
import { renderFullPost } from "../ui/renderFullPost";
import { setupAuthButtons } from "../utils/common";
import { getProfileName } from "../api/storage";

const root = document.querySelector<HTMLElement>("#post-root");
const status = document.querySelector<HTMLElement>("#post-status");

// run on load
setupAuthButtons();
loadPost();

async function loadPost() {
  if (!root || !status) return;

  // get post ID from URL
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  if (!idParam) {
    showStatus("No post id provided.", "error");
    return; // stop here
  }

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    showStatus("Invalid post id", "error");
    return;
  }

  showStatus("Loading post...", "info");

  try {
    const post = await getPostById(id);

    // render post HTML
    root.innerHTML = renderFullPost(post);
    showStatus(""); // clear message

    // show edit button only if this is MY post
    const currentUser = getProfileName(); // stored at login
    const postAuthor = post.author?.name;

    if (currentUser && postAuthor && currentUser === postAuthor) {
      // EDIT link
      const editPostLink = document.createElement("a");
      editPostLink.href = `/post/edit.html?id=${post.id}`;
      editPostLink.textContent = "Edit Post";
      editPostLink.className = "edit-post-link";
      // stick it at the bottom of the post
      root.appendChild(editPostLink);

      // DELETE button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete Post";
      deleteBtn.className = "delete-post-button";
      deleteBtn.type = "button";

      deleteBtn.addEventListener("click", async () => {
        const confirmed = window.confirm(
          "Are you sure you want to delete this post? This cannot be undone."
        );
        if (!confirmed) return;

        try {
          showStatus("Deleting post...", "info");
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
            showStatus(error.message, "error");
          } else {
            showStatus("Could not delete post.", "error");
          }
        }
      });

      root.appendChild(deleteBtn);
    }
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load this post.", "error");
    }
  }
}

function showStatus(text: string, type: "error" | "info" | "" = "") {
  if (!status) return;
  status.textContent = text;
  status.className = type;
}
