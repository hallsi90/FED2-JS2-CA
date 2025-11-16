// src/ui/renderProfileResults.ts
// render profile search results

export interface ProfileResult {
  name: string;
  email?: string;
  avatar?: {
    url: string;
    alt?: string;
  };
  bio?: string;
}

export function renderProfileResult(profile: ProfileResult): string {
  const avatarHtml = profile.avatar?.url
    ? `<img src="${profile.avatar.url}" 
       alt="${profile.avatar.alt || profile.name}" 
       class="profile-avatar"  
       loading="lazy"/>`
    : "";

  // link to your profile page structure e.g. /profile/?name=USERNAME
  const profileLink = `/profile/?name=${encodeURIComponent(profile.name)}`;

  return `
     <article class="profile-result">
       ${avatarHtml}
       <h2><a href="${profileLink}">${profile.name}</a></h2>
       ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ""} 
     </article>
    `;
}
