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

Do not deploy to Cloudflare or change public DNS as part of this preview task.
Pushing `work/astro-blog-preview` is explicitly authorized; this does not authorize
merging it or manually deploying the public site. The production branch and public site are outside this branch's
execution scope. Read README.md for preview operation and current limits.

Run `make build verify` before committing and verify the dashboard after container
changes. Keep source content separate from generated `dist/` output. Do not put
credentials or copied private company data in this repository.
