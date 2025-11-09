// src/pages/editProfile.ts
// Handles editing a users profile

import { requireAuth } from "../utils/authGuard";
import { getProfile, updateProfile } from "../api/profiles";
import { getProfileName } from "../api/storage";
import { setupAuthButtons } from "../utils/common";

requireAuth();
setupAuthButtons();

const form = document.querySelector<HTMLFormElement>("#editProfileForm");
const statusEl = document.querySelector<HTMLElement>("#edit-profile-status");
const avatarInput = document.querySelector<HTMLInputElement>("#avatarUrl");
const avatarAltInput = document.querySelector<HTMLInputElement>("#avatarAlt");
const bioInput = document.querySelector<HTMLTextAreaElement>("#bio");

loadMyProfile();

async function loadMyProfile() {
  const myName = getProfileName();
  if (!myName) {
    window.location.href = "/login/";
    return;
  }

  showStatus("Loading profile...", "info");

  try {
    const profile = await getProfile(myName);

    if (avatarInput) avatarInput.value = profile.avatar?.url || "";
    if (avatarAltInput) avatarAltInput.value = profile.avatar?.alt || "";
    if (bioInput) bioInput.value = profile.bio || "";

    showStatus("");
  } catch (error) {
    showStatus("Error loading profile", "error");
  }
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const myName = getProfileName();
    if (!myName) {
      showStatus("You must be logged in to edit your profile.", "error");
      return;
    }

    const avatarUrl = avatarInput?.value.trim() || "";
    const avatarAlt = avatarAltInput?.value.trim() || "";
    const bio = bioInput?.value.trim() || "";

    const payload: {
      bio?: string;
      avatar?: { url: string; alt?: string };
    } = {};

    if (bio !== "") {
      payload.bio = bio;
    }

    if (avatarUrl !== "") {
      payload.avatar = {
        url: avatarUrl,
        ...(avatarAlt ? { alt: avatarAlt } : {}),
      };
    }

    try {
      showStatus("Saving profile...", "info");
      await updateProfile(myName, payload);
      showStatus("Profile updated! Redirecting...", "success");
      window.location.href = `/profile/?name=${encodeURIComponent(myName)}`;
    } catch (error) {
      if (error instanceof Error) {
        showStatus(error.message, "error");
      } else {
        showStatus("Could not update profile.", "error");
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
