# FED2-JS2-CA - JavaScript 2 Course Assignment

**HTML**, **CSS**, **TypeScript**, **Vite**

Front-end client for a social media application built using **HTML**, **CSS**, **TypeScript**, and **Vite**.  
The application connects to the **Noroff Social API (v2)** and implements all required features from the course assignment brief.

> **Deadline:** 16 November 2025, 23:59 (Oslo)

---

## About the Assignment

This project is the **JavaScript 2 Course Assignment**, where students must build the front-end of a social media application.  
The main goal is to demonstrate:

- ES Modules
- Async/Await and structured API requests
- Authenticated endpoints
- Modular, reusable code
- Semantic HTML + basic UI styling
- GitHub Projects for planning
- Deployment to a live URL
- At least 3 functions with JSDoc comments

All required **pages and features** have been implemented (see below).

---

## Required Features (All Implemented)

| Feature                      | Status |
| ---------------------------- | ------ |
| Register new user            | ✔      |
| Log in user                  | ✔      |
| View all posts (feed)        | ✔      |
| View a single post           | ✔      |
| Create a post                | ✔      |
| Edit own posts               | ✔      |
| Delete own posts             | ✔      |
| View posts from another user | ✔      |
| Follow / Unfollow users      | ✔      |
| Search posts                 | ✔      |
| View own profile             | ✔      |

---

## Required Pages (All Included)

- **Login page**
- **Register page**
- **Posts/Feed page**
- **Single post page**
- **User profile page**

The project also includes additional optional pages such as:

- Edit Profile

(These are not required by the brief but help complete the user flow.)

---

## Tech Stack

- **HTML** – semantic structure
- **CSS** – basic UI styling
- **TypeScript** – typed modern JS
- **Vite** – dev server + bundler
- **Noroff API v2** – Auth + Social endpoints
  - `/auth/register`, `/auth/login`
  - `/social/posts`, `/social/profiles`

Frameworks such as React or Vue were not used, as required.

---

## Project structure

src/
api/ # API requests modules
pages/ # Page-level TypeScript
ui/ # Small reusable render helpers
utils/ # Helpers (auth guard, formatting, etc.)
styles/ # CSS files (global + components)

---

## Getting Started (Local Development)

1. **Clone the repository**
   git clone https://github.com/hallsi90/FED2-JS2-CA.git
   cd FED2-JS2-CA

2. **Install dependencies**
   npm install

3. **Run the dev server**
   npm run dev
   Open the URL shown in the terminal (usually http://localhost:5173/).

4. **Build for production**
   npm run build
   npm run preview

---

## Deployment

This project is deployed on Netlify:
https://hallsi90-fed2-js2-ca.netlify.app/

---

## Note about console image errors when using the search bar on feed page

Some posts returned by the Noroff API contain invalid external image URLs.

This causes browser messages like:
GET https://example.com/image.png net::ERR_NAME_NOT_RESOLVED

These messages are normal behavior in the browser when an external image cannot be fetched.
These errors are not caused by this project’s code, and are safely handled (media is only rendered if it exists).
This has no negative effect on the functionality of the site.

## Testing & Quality

- **HTML validation**  
  All pages were validated using the W3C HTML validator.

  - Initial warnings about `<section>` without headings were fixed by adding semantic headings or using `div` where appropriate.

- **Accessibility**

  - Checked using WAVE browser extension.
  - Lighthouse accessibility score: **98–100** on all pages (desktop & mobile).
  - Fixed a contrast issue on muted text by adjusting the color to `#555`.

- **Lighthouse (Chrome DevTools)**

  - Best Practices: ~**78–100**
    - Lower scores on some pages are caused by external media URLs returned by the Noroff API, not by this project’s code.
  - SEO: **90–91** across all pages.

- **Lighthouse Performance Summary**

#### **Form pages** (Login, Register, Create/Edit)

- Desktop: **~100**
- Mobile: **~95–98**

#### **Feed / Profile pages**

- Desktop: **~70–80**
- Mobile: **~50–70**
  - Lower scores due to API image loading + lazy-loading behavior in Lighthouse’s simulation.

#### **Single Post page**

- Desktop: **~90–96**
- Mobile: **~70–75**

---

### Why Mobile Scores Are Lower

Lighthouse simulates:

- A **slow phone CPU**
- A **very throttled 3G network**

Because this app loads multiple images from the API, simulated loading appears slower — especially on mobile.  
However:

- **Real-world performance is fast**
- **Lazy-loading improves UX**, even if Lighthouse shows reduced LCP scores

This behavior is normal and expected.

---

### Browsers Tested

- Chrome
- Safari
- Firefox
- iPhone 13 Safari

---

## Important Links

- **GitHub Repository:** https://github.com/hallsi90/FED2-JS2-CA
- **Live Deployment:** https://hallsi90-fed2-js2-ca.netlify.app/
- **API Documentation:** https://docs.noroff.dev/docs/v2

---

## License

This project is for educational purposes only.

---

## Acknowledgments

- Thank you to **Noroff** for the assignment brief and API.
- Special thanks to **OpenAI ChatGPT** for assistance with debugging, restructuring, accessibility improvements, and code-quality guidance.
