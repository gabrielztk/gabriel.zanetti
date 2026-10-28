# Blog agent guidance

This branch owns the Astro phase-one preview of Gabriel Kawall's existing blog.
Preserve the published article bodies, dates, URLs, images and ASCII heading anchors.
Professional knowledge and editorial revisions belong to the separate
`work/hermes-blog-knowledge` branch; do not merge them implicitly.

Use stable Astro APIs, ordinary CSS and the shared components. Keep dependencies
exactly pinned with the lockfile and Node version in mise.toml. Consult official
version-matched Astro documentation before implementation. Framework documentation
is available through https://mcp.docs.astro.build/mcp and Exa.

Never deploy to Cloudflare, push branches or change public DNS as part of this
preview task. The production branch and public site are outside this branch's
execution scope. Read README.md for preview operation and current limits.

Run `make build verify` before committing and verify the dashboard after container
changes. Keep source content separate from generated `dist/` output. Do not put
credentials or copied private company data in this repository.
