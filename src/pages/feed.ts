// src/pages/feed.ts
// fetch posts and render them on the feed page

import { getAllPosts, searchPosts } from "../api/posts";
import { searchProfiles } from "../api/profiles";
import { renderPostCard, type Post } from "../ui/renderPostCard";
import {
  renderProfileResult,
  type ProfileResult,
} from "../ui/renderProfileResults";

// container where all posts will be inserted
const feedRoot = document.querySelector<HTMLElement>("#feed-root");
// place to show loading / error messages
const feedStatus = document.querySelector<HTMLElement>("#feed-status");
// search bar
const feedSearch = document.querySelector<HTMLInputElement>("#feed-search");

// original list of posts
let allPosts: Post[] = [];

// run immediately
loadPosts();

async function loadPosts() {
  if (!feedRoot) return;

  showStatus("Loading posts...", "info");

  try {
    const posts: Post[] = await getAllPosts();
    allPosts = posts; // save for filtering
    renderPosts(posts);
    showStatus(""); // clear message
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load posts.", "error");
    }
  }
}

if (feedSearch) {
  feedSearch.addEventListener("input", async (event) => {
    const value = (event.target as HTMLInputElement).value.trim();

    // 1) empty search -> show all posts
    if (value === "") {
      renderPosts(allPosts);
      showStatus("");
      return;
    }

    // 2) if user types @name -> search profiles directly
    if (value.startsWith("@")) {
      const name = value.slice(1); // remove @
      if (name === "") {
        showStatus("Type a profile name after @ to search profiles.", "info");
        return;
      }
      await handleProfileSearch(name, true);
      return;
    }

    // 3) otherwise -> search posts first
    showStatus("Searching posts...", "info");
    try {
      const results = await searchPosts(value);

      if (!results.length) {
        // no posts found? ok, try searching profiles
        showStatus("No posts found. Searching profiles...", "info");
        await handleProfileSearch(value);
      } else {
        renderPosts(results);
        showStatus(""); // clear message
      }
    } catch (error) {
      showStatus("Search failed. Please try again.", "error");
    }
  });
}

/**
 * Helper to search profiles (used for @name and as fallback)
 */
async function handleProfileSearch(query: string, fromAtSearch = false) {
  try {
    const profiles = await searchProfiles(query);

    if (!profiles.length) {
      renderHtml("");

      // show different message if from @name search
      if (fromAtSearch) {
        showStatus("No profiles found.", "info");
      } else {
        showStatus("No posts or profiles found.", "info");
      }
    } else {
      const html = profiles
        .map((profile: ProfileResult) => renderProfileResult(profile))
        .join("");
      renderHtml(html);
      showStatus(""); // clear message
    }
  } catch (error) {
    showStatus("Could not search profiles.", "error");
  }
}

/**
 * Render a list of posts to the feed
 */
function renderPosts(posts: Post[]) {
  if (!feedRoot) return;
  // turn each post into HTML and join them
  const html = posts.map((post) => renderPostCard(post)).join("");
  feedRoot.innerHTML = html;
}

/** Render raw HTML to the feed (used for profile search results)
 */
function renderHtml(html: string) {
  if (!feedRoot) return;
  feedRoot.innerHTML = html;
}

/**
 * Show a message above the feed
 */
function showStatus(text: string, type: "error" | "info" | "" = ""): void {
  if (!feedStatus) return;
  feedStatus.textContent = text;
  feedStatus.className = type;
}
