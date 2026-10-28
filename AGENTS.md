# Blog agent guidance

This branch owns the Astro phase-one preview of Gabriel Kawall's existing blog.
Preserve the published article bodies, dates, URLs, images and ASCII heading anchors.
Professional knowledge and editorial revisions belong to the separate
`work/hermes-blog-knowledge` branch; do not merge them implicitly.

Use the adopted AstroPaper layouts, Tailwind utilities and shared components.
Keep the native light/dark theme, Pagefind search and accessible controls.
Use stable Astro APIs. Keep dependencies
exactly pinned with pnpm-lock.yaml and Node version in mise.toml. Consult official
version-matched Astro documentation before implementation. Framework documentation
is available through https://mcp.docs.astro.build/mcp and Exa.

The authorized release task permits pushing `work/astro-blog-preview` and preparing
production output on that branch. Do not push main without a separate operator
readiness receipt. Do not merge knowledge changes, call Cloudflare APIs, manually
deploy or change infrastructure. This release authorization supersedes the earlier
local-only preparation restriction. Read README.md for the build-time SITE_ENV
contract; preview must remain the safe default.

Run `make build verify` before committing and verify the dashboard after container
changes. Keep source content separate from generated `dist/` output. Do not put
credentials or copied private company data in this repository.
