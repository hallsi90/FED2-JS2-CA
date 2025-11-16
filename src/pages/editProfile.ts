// src/pages/editProfile.ts
// Handles editing a users profile

import { requireAuth } from "../utils/authGuard";
import { getProfile, updateProfile } from "../api/profiles";
import { getProfileName } from "../api/storage";
import { setupAuthButtons, updateStatus } from "../utils/common";
import { setupScrollToTop } from "../utils/scrollToTop";

// Run on load
setupAuthButtons();
requireAuth();
setupScrollToTop();

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

  updateStatus(statusEl, "Loading profile...", "info");

  try {
    const profile = await getProfile(myName);

    if (avatarInput) avatarInput.value = profile.avatar?.url || "";
    if (avatarAltInput) avatarAltInput.value = profile.avatar?.alt || "";
    if (bioInput) bioInput.value = profile.bio || "";

    updateStatus(statusEl, "");
  } catch (error) {
    if (error instanceof Error) {
      updateStatus(statusEl, error.message, "error");
    } else {
      updateStatus(statusEl, "Error loading profile.", "error");
    }
  }
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const myName = getProfileName();
    if (!myName) {
      updateStatus(
        statusEl,
        "You must be logged in to edit your profile.",
        "error"
      );
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
      updateStatus(statusEl, "Saving profile...", "info");
      await updateProfile(myName, payload);
      updateStatus(statusEl, "Profile updated! Redirecting...", "success");
      window.location.href = `/profile/?name=${encodeURIComponent(myName)}`;
    } catch (error) {
      if (error instanceof Error) {
        updateStatus(statusEl, error.message, "error");
      } else {
        updateStatus(statusEl, "Could not update profile.", "error");
      }
    }
  });
}
