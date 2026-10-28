# Gabriel Kawall — Astro preview

Private phase-one Astro migration of the current Portuguese blog. It preserves
all three article bodies, dates and paths, the homepage biography/education, the
contact route, feed address and article images. Zola internal references are
converted to public routes, including bundled article image paths; a heading plugin preserves ASCII fragment links.
The old Zola implementation remains available in Git history.

Peithos native Hermes consultation favored preserving Kodamas academic
composition, portrait, readable columns, education and restrained blue links.
This branch applies that visual direction in Astro as requested; it does not
claim Peitho recommended changing generators.

The portrait uses Astro build-time image processing with responsive WebP variants
for 160px mobile and 220px desktop presentation, including high-density screens.
The original JPEG remains at its existing path; homepage and favicon requests use
optimized output. Explicit square dimensions preserve layout space while loading.

The restrained academic layout keeps the circular portrait, profile column,
biography, education and readable articles, with responsive CSS. It is a local
custom layout, not an adopted third-party theme. Final personal identity and
editorial improvements are a later phase owned by the Hermes knowledge branch.
Existing article factual issues are intentionally not corrected in this parity
branch. Source-controlled brief material belongs to `work/hermes-blog-knowledge`.

## Build

Use the account-owned Node 24.21.0 toolchain through mise. Astro and its maintained
Markdown processor are exact-pinned in package.json and package-lock.json. The
Markdown processor supports the retained heading-ID plugin.

```sh
make install
make build verify
```

`src/content/blog/` holds Markdown articles; `src/data/profile.json` holds the
existing profile copy. Layouts and components live under `src/`, shared CSS under
`src/styles/`, static images under `public/`. `migration-baseline.json` records
original post routes, titles and dates. Generated output is excluded from Git.
All preview pages carry noindex/nofollow and robots.txt denies crawling.
Canonical/feed URLs retain the public blog origin; public deployment would need
an explicit review of indexing and publication settings.

## Private preview

The preview runs as gabriel.kawall on Coding VM260 in
`~/workspace/gabriel-blog-astro`, branch `work/astro-blog-preview`.

```sh
make up
make down
```

Compose serves built static files through Python's HTTP server in a rootless
container, with read-only files/rootfs, non-root UID, dropped capabilities,
no-new-privileges and bounded resources. Its existing image is pinned by digest;
`pull_policy: never` makes provisioning an explicit prerequisite on a new host.
Its private network namespace permits unprivileged port 80 binding without
adding capabilities or changing the host port policy. It is a private development server, not a production serving design.

The service name `media_server` and container port 80 match the already enrolled
preview selector. Only 127.0.0.1:18843 is published. The existing Horai dashboard
at https://dashboard.dev.horai.gabrielkawall.net discovers project
`gabriel-blog-astro` under Coding and assigns its authenticated HTTPS address.
Current assigned URL: https://f5yipw.dev.horai.gabrielkawall.net.
No DNS, firewall or Cloudflare changes are needed. The built site uses relative
asset links so its assigned hostname does not require rebuilding.

This branch stays on the coding VM. Do not push it to GitHub: the existing Pages
integration could create an unwanted Cloudflare preview. No Cloudflare command
or production deployment is part of this workflow.

The Atom feed retains its URL, dates, summaries and full rendered article bodies
from the same Astro content collection, with a base URL for relative references.

## Verification limits

The verifier checks built page titles, noindex, local links/assets/fragments and
original article dates. Browser review covers mobile/desktop appearance and
keyboard navigation separately. HTTPS access requires the existing Authentik
preview grant; local HTTP availability alone does not establish browser access.

## Contact icons

GitHub, LinkedIn and Email use visible text labels beside local decorative icons.
GitHub uses its official Octicons SVG, LinkedIn its unchanged official blue PNG,
and email a simple envelope. All marks are 24px high, keep their proportions and
have keyboard focus indicators. Sources and required attribution are recorded in
THIRD-PARTY-NOTICES.md. No icon library, font CDN or tracking is loaded.
