// src/ui/renderPostCard.ts
// For small post preview (used in feed, profile)

// small UI helper to turn a post object into HTML
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
 * Create HTML for a single post in the feed.
 * We return a string so the feed page can join many of these.
 */
export function renderPostCard(post: Post): string {
  const title = post.title || "Untitled post";

  const authorName = post.author?.name;
  const authorHtml = authorName
    ? `<a href="/profile/?name=${encodeURIComponent(
        authorName
      )}">${authorName}</a>`
    : "Unknown author";

  // only show an image if media.url exists
  const imageHtml = post.media?.url
    ? `<img src="${post.media.url}" alt="${
        post.media.alt || title
      }" class="post-image"/>`
    : "";

  const bodyPreview = post.body
    ? `${post.body.substring(0, 120)}${post.body.length > 120 ? "..." : ""}`
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
