// src/utils/scrollToTop.ts
// Creates and controls a floating "Scroll to Top" button used on all pages.

/**
 * Add a floating "scroll to top" button to the page.
 * The button appears after scrolling and scrolls smoothly to the top when clicked.
 */
export function setupScrollToTop() {
  // Avoid creating multiple buttons if this is called more than once
  if (document.getElementById("scroll-to-top-btn")) return;

  // Create the button element
  const btn = document.createElement("button");
  btn.id = "scroll-to-top-btn";
  btn.setAttribute("aria-label", "Scroll back to top");
  btn.textContent = "↑";

  // Hidden by default; CSS will position it
  btn.style.display = "none";

  // Add to page
  document.body.appendChild(btn);

  // Show/hide on scroll
  window.addEventListener("scroll", () => {
    btn.style.display = window.scrollY > 100 ? "flex" : "none";
  });

  // Smooth scroll on click (with fallback)
  btn.addEventListener("click", () => {
    if ("scrollBehavior" in document.documentElement.style) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo(0, 0);
    }
  });
}
