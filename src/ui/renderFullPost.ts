// src/ui/renderFullPost.ts
// For full post layout on the single post page

import { formatDate } from "../utils/formatDate";

export interface FullPost {
  id: number;
  title: string;
  body?: string;
  media?: {
    url: string;
    alt?: string;
  };
  author?: {
    name: string;
    avatar?: {
      url: string;
      alt?: string;
    };
  };
  created?: string;
  reactions?: Array<{
    symbol: string;
    count: number;
  }>;
  comments?: Array<{
    id: number;
    body?: string;
    owner: string;
    created: string;
  }>;
  _count?: {
    comments?: number;
    reactions?: number;
  };
}

/**
 * Render full post details
 */
export function renderFullPost(post: FullPost): string {
  const title = post.title || "Untitled post";

  // Author name + profile link
  const authorName = post.author?.name;

  const authorLinkHtml = authorName
    ? `<a href="/profile/?name=${encodeURIComponent(
        authorName
      )}">${authorName}</a>`
    : "Unknown author";

  // Author avatar
  const avatarUrl = post.author?.avatar?.url;
  const avatarAlt =
    post.author?.avatar?.alt || authorName || "Author profile picture";

  const avatarHtml = avatarUrl
    ? `<img src="${avatarUrl}" alt="${avatarAlt}" class="post-author-avatar"/>`
    : "";

  // Created date
  const createdLabel = formatDate(post.created);
  const metaHtml = createdLabel
    ? `<span class="single-post-meta">Posted ${createdLabel}</span>`
    : "";

  // Header combining avatar + author + meta
  const headerHtml = `
    <header class="single-post-header">
      ${avatarHtml}
      <div class="single-post-header-main">
        <span class="single-post-author-name">${authorLinkHtml}</span>
        ${metaHtml}
      </div>
    </header>
  `;

  // Main image
  const imageHtml = post.media?.url
    ? `<img src="${post.media.url}" alt="${
        post.media.alt || title
      }" class="post-main-image"/>`
    : "";

  // Body content
  const bodyText = post.body?.trim();
  const bodyHtml = bodyText
    ? `<p class="single-post-body">${bodyText}</p>`
    : `<p class="single-post-body">No content.</p>`;

  // Reactions and comments
  const reactionsHtml = renderReactions(post.reactions);
  const commentsHtml = renderComments(post.comments);

  return `
    <article class="single-post">
    ${headerHtml}
    <h1 class="single-post-title">${title}</h1>
    ${imageHtml}
    ${bodyHtml}
    ${reactionsHtml}
    ${commentsHtml}
    </article>
  `;
}

/**
 * Show reactions in a compact row
 */
function renderReactions(reactions: FullPost["reactions"]): string {
  if (!reactions || reactions.length === 0) {
    return `<div class="post-reactions"><span>No reactions yet.</span></div>`;
  }

  const items = reactions
    .map(
      (reaction) =>
        `
        <div class="post-reaction">
          <span>${reaction.symbol}</span>
          <span>${reaction.count}</span>
        </div>
      `
    )
    .join("");

  return `<div class="post-reactions">${items}</div>`;
}

/**
 * Show comments list under the post
 */
function renderComments(comments: FullPost["comments"]): string {
  if (!comments || comments.length === 0) {
    return `
    <section class="post-comments" aria-label="Comments">
      <p>No comments yet.</p>
    </section>
    `;
  }

  const items = comments
    .map((comment) => {
      const commentDate = formatDate(comment.created);
      const dateHtml = commentDate
        ? `<span class="post-comment-date">${commentDate}</span>`
        : "";

      // Trim comment text and handle missing/empty values safely
      const commentBody = comment.body?.trim() || "";

      return `
        <article class="post-comment">
          <div class="post-comment-header">
            <span class="post-comment-author">${comment.owner}</span>
            ${dateHtml}
          </div>
          <div>${commentBody}</div>
        </article>
      `;
    })
    .join("");

  return `
    <section class="post-comments" aria-label="Comments">
      <h2 class="post-comments-title">Comments</h2>
      ${items}
    </section>
  `;
}
