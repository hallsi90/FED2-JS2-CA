// src/pages/post.ts
// loads a single post by ID

import { getPostById } from "../api/posts";
import { renderFullPost } from "../ui/renderFullPost";

const root = document.querySelector<HTMLElement>("#post-root");
const status = document.querySelector<HTMLElement>("#post-status");

// run on load
loadPost();

async function loadPost() {
  if (!root || !status) return;

  // get post ID from URL
  const params = new URLSearchParams(window.location.search);
  const idParam = params.get("id");

  if (!idParam) {
    status.textContent = "No post id provided.";
    status.className = "error";
    return; // stop here
  }

  const id = Number(idParam);
  if (Number.isNaN(id)) {
    status.textContent = "Invalid post id";
    status.className = "error";
    return;
  }

  showStatus("Loading post...", "info");

  try {
    const post = await getPostById(id);

    // render post
    root.innerHTML = renderFullPost(post);
    showStatus(""); // clear message
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
