// src/pages/profile.ts
// load profile data + follow/unfollow
// show the logged-in user's profile and their posts

import { requireAuth } from "../utils/authGuard";
import { getProfile } from "../api/profiles";
import { getProfileName } from "../api/storage";
import { renderProfileHeader } from "../ui/renderProfile";
import { renderPostCard } from "../ui/renderPostCard";

requireAuth(); // only logged in users can access this page

const statusEl = document.querySelector<HTMLElement>("#profile-status");
const profileRoot = document.querySelector<HTMLElement>("#profile-root");
const postsRoot = document.querySelector<HTMLElement>("#profile-posts");

loadProfile();

async function loadProfile() {
  if (!statusEl || !profileRoot || !postsRoot) return;

  // get the logged-in user's name from storage
  const myName = getProfileName();

  if (!myName) {
    // no name in storage = not logged in properly -> redirect to login
    window.location.href = "/login/";
    return;
  }

  showStatus("Loading profile...", "info");

  try {
    const profile = await getProfile(myName);

    // render top section
    profileRoot.innerHTML = renderProfileHeader(profile);

    // render posts
    const posts = (profile as any).posts as any[] | undefined;

    if (posts && posts.length > 0) {
      const html = posts.map((post) => renderPostCard(post)).join("");
      postsRoot.innerHTML = html;
    } else {
      postsRoot.innerHTML = "<p>This user has no posts yet.</p>";
    }

    showStatus("");
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load profile.", "error");
    }
  }
}

function showStatus(text: string, type: "error" | "info" | "" = "") {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = type;
}
