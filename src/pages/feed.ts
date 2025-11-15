// src/pages/feed.ts
// fetch posts and render them on the feed page

import { getAllPosts, searchPosts } from "../api/posts";
import { searchProfiles } from "../api/profiles";
import { renderPostCard, type Post } from "../ui/renderPostCard";
import {
  renderProfileResult,
  type ProfileResult,
} from "../ui/renderProfileResults";
import {
  setupAuthButtons,
  setupPostCardClicks,
  updateStatus,
} from "../utils/common";

// container where all posts will be inserted
const feedRoot = document.querySelector<HTMLElement>("#feed-root");
// place to show loading / error messages
const feedStatus = document.querySelector<HTMLElement>("#feed-status");
// search bar
const feedSearch = document.querySelector<HTMLInputElement>("#feed-search");

// original list of posts
let allPosts: Post[] = [];

// run immediately
setupAuthButtons();
loadPosts();

async function loadPosts() {
  if (!feedRoot) return;

  updateStatus(feedStatus, "Loading posts...", "info");

  try {
    const posts: Post[] = await getAllPosts();
    allPosts = posts; // save for filtering
    renderPosts(posts);
    updateStatus(feedStatus, ""); // clear message
  } catch (error) {
    if (error instanceof Error) {
      updateStatus(feedStatus, error.message, "error");
    } else {
      updateStatus(feedStatus, "Could not load posts.", "error");
    }
  }
}

if (feedSearch) {
  feedSearch.addEventListener("input", async (event) => {
    const value = (event.target as HTMLInputElement).value.trim();

    // empty search -> show all posts
    if (value === "") {
      renderPosts(allPosts);
      updateStatus(feedStatus, "");
      return;
    }

    // if user types @name -> search profiles directly
    if (value.startsWith("@")) {
      const name = value.slice(1); // remove @
      if (name === "") {
        updateStatus(
          feedStatus,
          "Type a profile name after @ to search profiles.",
          "info"
        );
        return;
      }
      await handleProfileSearch(name, true);
      return;
    }

    updateStatus(feedStatus, "Searching posts and profiles...", "info");

    try {
      // 1) API search posts (title/body) with _author=true
      const remoteResults: Post[] = await searchPosts(value);

      // 2) local author-name search on the feed posts (not possible via API)
      const valueLower = value.toLowerCase();
      const localAuthorMatches: Post[] = allPosts.filter((post) =>
        post.author?.name?.toLowerCase().includes(valueLower)
      );

      // 3) merge local + remote results, avoiding duplicates
      const mergedById = new Map<number, Post>();
      for (const p of localAuthorMatches) {
        mergedById.set(p.id, p);
      }
      for (const p of remoteResults) {
        mergedById.set(p.id, p);
      }
      const combinedPosts = Array.from(mergedById.values());

      // 4) search for profiles too
      const profiles: ProfileResult[] = await searchProfiles(value);

      // render results
      let html = "";

      if (combinedPosts.length > 0) {
        html += combinedPosts.map((post) => renderPostCard(post)).join("");
      }

      if (profiles.length > 0) {
        const profilesHtml = profiles
          .map((profile: ProfileResult) => renderProfileResult(profile))
          .join("");

        // add small heading if both are shown
        if (combinedPosts.length > 0) {
          html += `<h2 class="search-section-title">Profiles</h2>`;
        }

        html += profilesHtml;
      }

      if (html === "") {
        updateStatus(feedStatus, "No posts or profiles found.", "info");
        renderHtml("");
      } else {
        renderHtml(html);
        updateStatus(feedStatus, "");
      }
    } catch (error) {
      updateStatus(feedStatus, "Search failed. Please try again.", "error");
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
        updateStatus(feedStatus, "No profiles found.", "info");
      } else {
        updateStatus(feedStatus, "No posts or profiles found.", "info");
      }
    } else {
      const html = profiles
        .map((profile: ProfileResult) => renderProfileResult(profile))
        .join("");
      renderHtml(html);
      updateStatus(feedStatus, ""); // clear message
    }
  } catch (error) {
    updateStatus(feedStatus, "Could not search profiles.", "error");
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

  // Makes the whole card clickable (except links)
  setupPostCardClicks(feedRoot);
}

/** Render raw HTML to the feed (used for profile search results)
 */
function renderHtml(html: string) {
  if (!feedRoot) return;
  feedRoot.innerHTML = html;

  // If the HTML contains post cards, make them clickable
  setupPostCardClicks(feedRoot);
}
