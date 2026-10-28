import { unified } from '@astrojs/markdown-remark';
import { defineConfig } from 'astro/config';
import legacyHeadingIds from './scripts/legacy-heading-ids.mjs';
export default defineConfig({
  site: process.env.SITE_URL || 'https://blog.gabrielkawall.net',
  output: 'static',
  trailingSlash: 'always',
  markdown: { processor: unified({ rehypePlugins: [legacyHeadingIds] }), shikiConfig: { theme: 'github-dark' } },
});
