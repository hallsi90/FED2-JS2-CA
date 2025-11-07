// src/ui/renderFullPost.ts
// For full post layout on the single post page

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
  };
  created?: string;
  reactions?: Array<{
    symbol: string;
    count: number;
  }>;
  comments?: Array<{
    id: number;
    body: string;
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
  const authorName = post.author?.name;

  const authorHtml = authorName
    ? `<a href="/profile/?name=${encodeURIComponent(
        authorName
      )}">${authorName}</a>`
    : "Unknown author";

  const imageHtml = post.media?.url
    ? `<img src="${post.media.url}" alt="${
        post.media.alt || title
      }" class="post-image"/>`
    : "";

  const bodyHtml = post.body ? `<p>${post.body}</p>` : "<p>No content.</p>";

  const reactionsHtml = renderReactions(post.reactions);
  const commentsHtml = renderComments(post.comments);

  return `
    <article class="single-post">
    ${imageHtml}
    <h1>${title}</h1>
    <p class="post-meta">by ${authorHtml}</p>
    ${bodyHtml}
    ${reactionsHtml}
    ${commentsHtml}
    </article>
  `;
}

function renderReactions(reactions: FullPost["reactions"]): string {
  if (!reactions || reactions.length === 0) {
    return `<section class="post-reactions"><p>No reactions yet.</p></section>`;
  }

  const items = reactions
    .map(
      (reaction) =>
        `<li>${reaction.symbol} <span>× ${reaction.count}</span></li>`
    )
    .join("");

  return `
   <section class="post-reactions">
    <h2>Reactions</h2>
     <ul>
      ${items}
     </ul>
    </section>
   `;
}

function renderComments(comments: FullPost["comments"]): string {
  if (!comments || comments.length === 0) {
    return `<section class="post-comments"><p>No comments yet.</p></section>`;
  }

  const items = comments
    .map(
      (comment) => `
        <li class="comment">
          <p class="comment-owner">${comment.owner}</p>
          <p class="comment-body">${comment.body}</p>
      </li>
      `
    )
    .join("");

  return `
    <section class="post-comments">
    <h2>Comments</h2>
      <ul>
        ${items}
      </ul>
    </section>
  `;
}
