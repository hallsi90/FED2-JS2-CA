// src/ui/renderProfileResults.ts
// Renders a small profile card used in followers/following lists.

export interface ProfileResult {
  name: string;
  email?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  bio?: string;
}

/**
 * Renders a small profile result card.
 * Used when displaying followers/following on the profile page.
 */
export function renderProfileResult(profile: ProfileResult): string {
  const name = profile.name?.trim() || "Unknown user";
  const bio = profile.bio?.trim() || "";
  const avatarUrl = profile.avatar?.url;
  const avatarAlt = profile.avatar?.alt?.trim() || name;

  // Avatar (image or placeholder)
  const avatarHtml = avatarUrl
    ? `<img src="${avatarUrl}" 
       alt="${avatarAlt}" 
       class="profile-avatar"  
       loading="lazy"/>`
    : `<div class="profile-avatar profile-avatar-placeholder" aria-hidden="true"></div>`;

  const profileLink = `/profile/?name=${encodeURIComponent(name)}`;

  return `
     <article class="profile-result">
       ${avatarHtml}
       <h2><a href="${profileLink}">${name}</a></h2>
       ${bio ? `<p class="profile-bio">${bio}</p>` : ""} 
     </article>
    `;
}
