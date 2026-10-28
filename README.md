# Gabriel Kawall — AstroPaper private preview

The blog uses AstroPaper 6.1.0 (upstream commit
`35cfa7fbe0b897306d27670d3819e55d5205f3dd`) with its actual layouts,
Tailwind typography, light/dark theme, Pagefind search, code copy buttons and
article image lightbox. Gabriel's portrait, biography, education, three articles,
contact information and labeled social icons replace the theme's example content.
The previous custom layout remains in Git history.

Article bodies, original dates, `/blog/` routes, eight article images and ASCII
heading anchors are preserved. The Atom feed remains `/atom.xml` with full rendered
article content. Original date-only publications are stored at midnight UTC and
displayed in UTC to prevent calendar dates shifting across time zones.
The homepage has no profile tagline or repeated contact section, as requested.
Professional/editorial changes remain separate in `work/hermes-blog-knowledge`.

## Build and edit

Use account-owned Node 24.21.0 through mise and pnpm 11.3.0. Direct dependency
versions and the full graph are pinned; install uses the frozen lockfile.

```sh
make install
make build verify
```

Articles live in `src/content/posts/` with `pubDatetime` frontmatter;
`src/data/profile.json` owns existing biography data. `astro-paper.config.ts`
owns site settings; `src/styles/theme.css` owns the native theme palette.
`src/i18n/lang/pt-BR.ts` translates interface labels. Preserve article bodies
when changing presentation. `migration-baseline.json` records original titles,
dates and routes. `scripts/verify-build.py` checks generated routes, assets,
fragments, full feed, noindex and optimized portrait variants.

The portrait uses Astro-generated WebP (160px mobile / 220px desktop, responsive
high-density variants). The original JPEG remains at its legacy URL; homepage
and favicon requests use optimized assets. GitHub/LinkedIn/Email retain visible
labels, official local brand marks and keyboard focus indicators. See
THIRD-PARTY-NOTICES.md and LICENSE-AstroPaper for upstream attribution.
Theme fonts are downloaded at build time and served locally in the generated
site; browser rendering does not require a font CDN.

## Private preview operation

Checkout: `~/workspace/gabriel-blog-astro` on Coding VM260, account
`gabriel.kawall`, branch `work/astro-blog-preview`.

```sh
make up
make down
```

The existing Compose project `gabriel-blog-astro` serves `dist/` using the pinned
Python image. It is rootless, UID1000, read-only, drops capabilities, sets
no-new-privileges and retains its resource limits/internal network. The image
must already exist locally (`pull_policy: never`). This is a private development
server, not a production serving design. No infrastructure permissions changed.

Service `media_server:80` publishes only `127.0.0.1:18843`; the existing Horai
collector discovers it. Dashboard: https://dashboard.dev.horai.gabrielkawall.net.
Preview: https://f5yipw.dev.horai.gabrielkawall.net. Access requires the existing
Authentik grant. Source builds refresh the bind-mounted static files.

All HTML is noindex/nofollow, robots.txt denies crawling, and canonical/feed URLs
use the private preview origin. Public deployment requires an explicit review of
origin/indexing settings. Do not push this branch: GitHub's Pages integration
could trigger unwanted publication. No Cloudflare, public DNS, firewall or
production changes are included in this task.

## Acceptance

`make build verify` includes Astro type checking, static generation, local search
indexing and link/content checks. Browser review separately checks responsive
layout, local assets, dark mode, search, code copy and authentication. HTTP
loopback success alone does not establish authenticated browser access.
