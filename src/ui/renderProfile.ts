// src/ui/renderProfile.ts
// For showing a profile header (avatar, name, follow button)
// turn a profile object into HTML for the profile page

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
 * Render top part of the profile (avatar, name, counts)
 */
export function renderProfileHeader(profile: Profile): string {
  const avatarHtml = profile.avatar?.url
    ? `<img src="${profile.avatar.url}" alt="${
        profile.avatar.alt || profile.name
      }" class="profile-avatar" />`
    : "";

  return `
  <header class="profile-header"> 
   ${avatarHtml}
   <h1>${profile.name}</h1>
   ${profile.bio ? `<p>${profile.bio}</p>` : ""}
   <ul class="profile-counts">
     <li>Posts: ${profile._count?.posts ?? 0}</li>
     <li>Followers: ${profile._count?.followers ?? 0}</li>
     <li>Following: ${profile._count?.following ?? 0}</li>
   </ul>
  </header>
`;
}
