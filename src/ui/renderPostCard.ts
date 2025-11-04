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
  // fallback values
  const title = post.title || "Untitled post";
  const author = post.author?.name || "Unknown author";

  // link to the single post page with ?id=POST_ID
  const postLink = `/post/?id=${post.id}`;

  // only show an image if media.url exists
  const imageHtml = post.media?.url
    ? `<img src="${post.media.url}" alt="${
        post.media.alt || title
      }" class="post-image"/>`
    : "";

  return `
    <article class="post-card">
    ${imageHtml}
    <h2><a href="${postLink}">${title}</a></h2>
    <p class="post-meta">by ${author}</p>
    ${
      post.body
        ? `<p class="post-body">${post.body.substring(0, 120)}...</p>`
        : ""
    }
    <a class="post-read-more" href="${postLink}">View post</a>
   </article>
  `;
}
