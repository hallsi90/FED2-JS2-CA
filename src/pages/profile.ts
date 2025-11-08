// src/pages/profile.ts
// load profile data + follow/unfollow
// show the logged-in user's profile and their posts

import { requireAuth } from "../utils/authGuard";
import { getProfile, followProfile, unfollowProfile } from "../api/profiles";
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

  // 1) Check URL for ?name=someone
  const params = new URLSearchParams(window.location.search);
  const requestedName = params.get("name");

  // 2) If no ?name=, use logged-in user's name
  const myName = getProfileName();

  if (!myName) {
    // somehow no name in storage = not logged in properly -> redirect to login
    window.location.href = "/login/";
    return;
  }

  // this is the profile to load
  const profileToLoad = requestedName || myName;
  const isMyProfile = profileToLoad === myName;

  // tell the user whose profile is being loaded
  showStatus(`Loading profile: ${profileToLoad}...`, "info");

  try {
    const profile = await getProfile(profileToLoad);

    // 1) Render header (avatar, name, counts)
    profileRoot.innerHTML = renderProfileHeader(profile);

    // 2) If this is NOT my profile -> show follow/unfollow button
    if (!isMyProfile) {
      const btn = document.createElement("button");
      btn.id = "follow-toggle-btn";
      btn.type = "button";

      // check if I already follow this profile
      const isFollowing =
        Array.isArray((profile as any).followers) &&
        (profile as any).followers.some(
          (f: { name: string }) => f.name === myName
        );

      btn.textContent = isFollowing ? "Unfollow" : "Follow";

      // small disabled helper
      const setBusy = (busy: boolean) => {
        btn.disabled = busy;
      };

      btn.addEventListener("click", async () => {
        try {
          setBusy(true);

          if (btn.textContent === "Follow") {
            // 1) tell API
            await followProfile(profileToLoad);
          } else {
            await unfollowProfile(profileToLoad);
          }

          // 2) fetch the full updated profile to get new counts
          const updatedProfile = await getProfile(profileToLoad);

          // 3) re-render header with updated counts
          profileRoot.innerHTML = renderProfileHeader(updatedProfile);

          // 4) re-attach the button (because we just overwrote the header)
          profileRoot.appendChild(btn);

          // 5) update button text based on the new follow status
          const nowFollowing =
            Array.isArray((updatedProfile as any).followers) &&
            (updatedProfile as any).followers.some(
              (f: { name: string }) => f.name === myName
            );

          btn.textContent = nowFollowing ? "Unfollow" : "Follow";

          showStatus(
            nowFollowing
              ? `You are now following ${profileToLoad}.`
              : `You unfollowed ${profileToLoad}.`,
            "info"
          );
        } catch (error) {
          if (error instanceof Error) {
            showStatus(error.message, "error");
          } else {
            showStatus("Could not update follow status.", "error");
          }
        } finally {
          setBusy(false);
        }
      });
      profileRoot.appendChild(btn);
    }

    // 3) Render posts
    const posts = (profile as any).posts as any[] | undefined;

    if (posts && posts.length > 0) {
      const html = posts.map((post) => renderPostCard(post)).join("");
      postsRoot.innerHTML = html;
    } else {
      // message depending on whose profile it is
      const isOtherUser = Boolean(requestedName && requestedName !== myName);
      postsRoot.innerHTML = isOtherUser
        ? "<p>This user has no posts yet.</p>"
        : "<p>You have no posts yet.</p>";
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
