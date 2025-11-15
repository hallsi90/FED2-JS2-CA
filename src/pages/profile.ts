// src/pages/profile.ts
// load profile data + follow/unfollow
// show users profiles and their posts

import { requireAuth } from "../utils/authGuard";
import { getProfile, followProfile, unfollowProfile } from "../api/profiles";
import { getProfileName } from "../api/storage";
import { renderProfileHeader } from "../ui/renderProfile";
import { renderPostCard } from "../ui/renderPostCard";
import { setupAuthButtons, setupPostCardClicks } from "../utils/common";

setupAuthButtons();
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

  // show/hide edit profile link
  const editProfileLink =
    document.querySelector<HTMLAnchorElement>("#edit-profile-link");
  if (editProfileLink) {
    if (isMyProfile) {
      editProfileLink.style.display = "inline-block";
    } else {
      editProfileLink.style.display = "none";
    }
  }

  // tell the user whose profile is being loaded
  showStatus(`Loading profile: ${profileToLoad}...`, "info");

  try {
    const profile = await getProfile(profileToLoad);

    // make sure posts always have author info
    const rawPosts = (profile as any).posts as any[] | undefined;
    const postsWithAuthor = rawPosts
      ? rawPosts.map((post) => ({
          ...post,
          author: post.author ?? { name: profile.name },
        }))
      : [];

    // 1) Render header (avatar, name, counts)
    profileRoot.innerHTML = renderProfileHeader(profile);

    // 2) show follow/unfollow button if not my profile
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
          const updatedRawPosts = (updatedProfile as any).posts as
            | any[]
            | undefined;
          const updatedPostsWithAuthor = updatedRawPosts
            ? updatedRawPosts.map((post) => ({
                ...post,
                author: post.author ?? { name: updatedProfile.name },
              }))
            : [];

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

          // also restore posts view with the updated ones
          renderPostsView(updatedPostsWithAuthor, requestedName, myName);

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

    // 3) followers/following lists toggle
    profileRoot.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (!target.matches(".profile-count-btn")) return;

      const listType = target.dataset.list; // "followers" or "following"
      if (!listType) return;

      const people = (profile as any)[listType] as
        | Array<{
            name: string;
            avatar?: { url: string; alt?: string };
            bio?: string;
          }>
        | undefined;

      if (!postsRoot) return;

      if (!people || people.length === 0) {
        postsRoot.innerHTML =
          listType === "followers"
            ? "<p>No followers yet.</p>"
            : "<p>Not following anyone yet.</p>";
        return;
      }

      const peopleHtml = people
        .map((person) => {
          const avatarHtml = person.avatar?.url
            ? `<img src="${person.avatar.url}" alt="${
                person.avatar.alt || person.name
              }" class="profile-avatar-small" />`
            : "";
          return `
          <article class="profile-result">
          ${avatarHtml}
          <h3><a href="/profile/?name=${encodeURIComponent(person.name)}">${
            person.name
          }</a></h3>
          ${person.bio ? `<p>${person.bio}</p>` : ""}
          </article>
        `;
        })
        .join("");

      // reuse the posts area to show the list
      const heading = listType.charAt(0).toUpperCase() + listType.slice(1); // capitalize Followers/Following list heading

      postsRoot.innerHTML = `
      <div class="profile-list-header">
      <button id="back-to-posts-btn" type="button">&larr; Back to posts</button>
      <h2>${heading}</h2>
     </div>
      ${peopleHtml}
      `;

      // handle back to posts button
      const backBtn = document.querySelector<HTMLElement>("#back-to-posts-btn");
      if (backBtn) {
        backBtn.addEventListener("click", () => {
          // re-render the original posts list
          renderPostsView(postsWithAuthor, requestedName, myName);
        });
      }
    });

    // 4) initial post render
    renderPostsView(postsWithAuthor, requestedName, myName);

    showStatus("");
  } catch (error) {
    if (error instanceof Error) {
      showStatus(error.message, "error");
    } else {
      showStatus("Could not load profile.", "error");
    }
  }
}

function renderPostsView(
  posts: any[],
  requestedName: string | null,
  myName: string
) {
  if (!postsRoot) return;

  if (posts && posts.length > 0) {
    const html = posts.map((post) => renderPostCard(post)).join("");
    postsRoot.innerHTML = html;

    // Make the profile's post cards clickable (same as in feed )
    setupPostCardClicks(postsRoot);
  } else {
    // no posts
    const isOtherUser = Boolean(requestedName && requestedName !== myName);
    postsRoot.innerHTML = isOtherUser
      ? `<p>This user has no posts yet.</p>`
      : "<p>You have no posts yet.</p>";
  }
}

function showStatus(text: string, type: "error" | "info" | "" = "") {
  if (!statusEl) return;
  statusEl.textContent = text;
  statusEl.className = type;
}
