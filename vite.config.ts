// vite.config.ts
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // main feed page
        main: "index.html",

        // auth pages
        login: "login/index.html",
        register: "register/index.html",

        // profile pages
        profile: "profile/index.html",
        profileEdit: "profile/edit.html",

        // post pages
        post: "post/index.html",
        postCreate: "post/create.html",
        postEdit: "post/edit.html",
      },
    },
  },
});
