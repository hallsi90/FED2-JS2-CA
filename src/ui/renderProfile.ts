// src/ui/renderProfile.ts
// Renders the profile header (avatar, name, bio, follower counts),

export interface Profile {
  name: string;
  email?: string;
  bio?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  banner?: {
    url: string;
    alt?: string;
  };
  _count?: {
    posts?: number;
    followers?: number;
    following?: number;
  };
}

/**
 * Render top part of the profile: avatar, name, bio, counts.
 */
export function renderProfileHeader(profile: Profile): string {
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

  return `
  <header class="profile-header"> 
   ${avatarHtml}

   <div class="profile-header-main">
    <h1 class="profile-name">${name}</h1>

     ${bio ? `<p class="profile-bio">${bio}</p>` : ""}

     <ul class="profile-counts">
       <li>Posts: ${profile._count?.posts ?? 0}</li>

       <li>
         <button type="button" class="profile-count-btn"     data-list="followers">
           Followers: ${profile._count?.followers ?? 0}
         </button>
       </li>

       <li>
         <button type="button" class="profile-count-btn" data-list="following">
           Following: ${profile._count?.following ?? 0}
         </button>
       </li>
     </ul>
   </div>
  </header>
`;
}
