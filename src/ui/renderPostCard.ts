// src/ui/renderPostCard.ts
// Renders a small post preview card (used in feed and profile pages).

/**
 * Shape of a post object used by the UI.
 * This matches what we use on the feed and profile pages.
 */
export interface Post {
  id: number;
  title: string;
  body: string;
  media?: {
    url: string;
    alt?: string;
  };
  author?: {
    name: string;
  };
  created?: string;
}

/**
 * Create HTML for a single post card.
 * Returns a string so the caller can map/join a list of posts into markup.
 */
export function renderPostCard(post: Post): string {
  const title = post.title?.trim() || "Untitled post";
  const body = post.body?.trim() || "";

  const authorName = post.author?.name?.trim();
  const authorHtml = authorName
    ? `<a href="/profile/?name=${encodeURIComponent(
        authorName
      )}">${authorName}</a>`
    : "Unknown author";

  // Only show an image if media.url exists
  const imageHtml = post.media?.url
    ? `<img src="${post.media.url}" 
       alt="${post.media.alt || title}" 
       class="post-image"
       loading="lazy" 
      />`
    : "";

  // Short preview of the body text
  const maxLength = 120;
  const bodyPreview =
    body.length > 0
      ? `${body.substring(0, maxLength)}${body.length > maxLength ? "..." : ""}`
      : "";

  return `
    <article class="post-card" data-post-id="${post.id}">
      ${imageHtml}
      <h2 class="post-card-title">${title}</h2>
      <p class="post-meta">by ${authorHtml}</p>
      ${bodyPreview ? `<p class="post-body">${bodyPreview}</p>` : ""}
    </article>
  `;
}
