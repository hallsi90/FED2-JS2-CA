# FED2-JS2-CA - JavaScript 2 Course Assignment

Front-end client for a social media application built with **HTML**, **CSS**, **TypeScript**, and **Vite**.
The application connects to the **Noroff API** and allows users to register, log in, view posts, create/edit/delete their own posts, view profiles, and follow/unfollow other users.

> **Deadline:** 16 November 2025, 23:59 (Oslo).

---

## About the assignment

This repository is for the individual JavaScript 2 Course Assignment.
The goal is to demonstrate the use of modern JavaScript features such as ES modules and async/await, build modular and reusable code, work with authenticated API endpoints, and plan the project using GitHub Projects.

The project must include the following pages:

- Login page
- Register page
- Feed/posts page
- Individual post page
- User profile page

All required features from the brief will be implemented using the Noroff API:

- Register new user
- Log in user
- Get all posts
- Get single post
- Create post
- Edit post
- Delete post
- Get posts of a user
- Follow/unfollow user
- Search posts
- View own profile

---

## Tech stack

- **HTML** - semantic page structure
- **CSS** - basic UI styling (global + page level)
- **TypeScript** - typed JavaScript for safer code
- **Vite** - dev server and build tool
- **Noroff API** - `https://docs.noroff.dev/docs/v2`
  - Auth endpoints (`/auth/register`, `/auth/login`)
  - Social endpoints (`/social/posts`, `/social/profiles`)

---

## Project structure

src/
api/ # API requests (auth, posts, profiles, storage)
pages/ # page-specific logic (login, register, feed, post, profile)
ui/ # small render helpers for HTML
utils/ # dom helpers, auth guard, date formatting
styles/ # global.css + page-specific css

---

## Getting started (local development)

1. Clone the repo
   git clone https://github.com/hallsi90/FED2-JS2-CA.git
   cd FED2-JS2-CA

2. Install dependencies
   npm install

3. Run the dev server
   npm run dev
   Open the URL shown in the terminal (usually http://localhost:5173/).

4. Build for production (later)
   npm run build
   npm run preview

---

## Deployment

This project wil be deployed to Netlify or GitHub Pages (final URL will be added here before submission).

Deployment is required by the assignment so the marker can view the running application.

---

## Requirements checklist

- Public GitHub Repository
- Vite + TypeScript setup
- Basic HTML pages created (login, register, feed, post, profile)
- Project planned in GitHub Projects (Kanban)
- API integration (auth, posts, profiles)
- Deploy to Netlify/GitHub Pages
- Update README with live URL

---

## Notes

- This is an individual submission.
- All commits must be pushed before the deadline: 16 Novemner 2025, 23:59.
- Code will follow the Noroff Code of Conduct when interacting with the API.
