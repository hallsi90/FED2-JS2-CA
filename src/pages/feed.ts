// src/pages/feed.ts
// fetch posts and render them on the feed page
// code for the main feed page

import { getAllPosts } from "../api/posts";
import { renderPostCard } from "../ui/renderPostCard";

// Import the Post type from renderPostCard.ts
import type { Post } from "../ui/renderPostCard";

// container where all posts will be inserted
const feedRoot = document.querySelector<HTMLElement>("#feed-root");
// place to show loading / error messages
const feedStatus = document.querySelector<HTMLElement>("#feed-status");

// run immediately
loadPosts();

async function loadPosts() {
  if (!feedRoot) return;

  showStatus("Loading posts...", "info");

  try {
    const posts: Post[] = await getAllPosts();

    if (!posts || posts.length === 0) {
      showStatus("No posts found.", "info");
      return;
    }

    // turn each post into HTML and join them
    const html = posts.map((post) => renderPostCard(post)).join("");

    feedRoot.innerHTML = html;
    showStatus(""); // clear message
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load posts.", "error");
    }
  }
}

function showStatus(text: string, type: "error" | "info" | "" = ""): void {
  if (!feedStatus) return;
  feedStatus.textContent = text;
  feedStatus.className = type;
}
