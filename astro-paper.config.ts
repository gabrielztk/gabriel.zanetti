import { defineAstroPaperConfig } from "./src/types/config";
import { siteURL } from "./src/site-env";

export default defineAstroPaperConfig({
  site: {
    url: siteURL,
    title: "Gabriel Kawall",
    description: "Tecnologia, prática e aprendizado.",
    author: "Gabriel Kawall",
    profile: "https://github.com/gabrielztk",
    ogImage: "default-og.jpg",
    lang: "pt-BR",
    timezone: "UTC",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showArchives: true,
    showBackButton: true,
    editPost: {
      enabled: false,
    },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/gabrielztk" },
    { name: "linkedin", url: "https://www.linkedin.com/in/gabriel-kawall-584679220/" },
    { name: "mail", url: "mailto:gabrielzanettitech@gmail.com" },
  ],
  shareLinks: [
    { name: "whatsapp", url: "https://wa.me/?text=" },
    { name: "facebook", url: "https://www.facebook.com/sharer.php?u=" },
    { name: "x",        url: "https://x.com/intent/post?url=" },
    { name: "telegram", url: "https://t.me/share/url?url=" },
    { name: "pinterest", url: "https://pinterest.com/pin/create/button/?url=" },
    { name: "mail",     url: "mailto:?subject=See%20this%20post&body=" },
  ],
});