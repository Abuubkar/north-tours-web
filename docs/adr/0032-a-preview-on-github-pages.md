# ADR-0032: A preview on GitHub Pages

- **Status:** Accepted
- **Date:** 2026-10-05
- **Related issue:** #141
- **Supersedes in part:** ADR-0007 (no deploy pipeline during development)

## Context
ADR-0007 and CLAUDE.md §11 keep hosting code out until it's asked for. On 2026-10-05 the owner asked for it: "make the repo public and deploy the site on github pages and re-run audits there". The real host is still the owner's decision (Cloudflare is likely); what's wanted now is a preview anyone can open, and a way to run `pnpm audit:site` against it.

GitHub Pages serves a project site from a sub-path, `https://abuubkar.github.io/north-tours-web/`. The site links with plain root-relative URLs (`/tours`, `/images/…`), which would point outside it. And the preview isn't the real site: it has a placeholder brand and sample content (ADR-0010, ADR-0019, ADR-0022), so search engines must not index it.

## Decision
- **A base path, set at build.** `BASE_PATH=/north-tours-web pnpm build` builds the site for that sub-path. Unset, nothing changes: local builds, Storybook and tests serve from `/` as before.
  - **One helper, `sitePath`** (`lib/utils/basePath.ts`), puts a path under the base path. Every route in `lib/routes.ts` and every image URL (`srcset`, `src`, the share image) goes through it, so the canonical URL, `og:url`, JSON-LD, the sitemap and robots.txt follow. File names in `public/` don't change.
  - `next.config.ts` passes the base path to Next (`basePath`, for its own scripts, CSS and fonts) and into every bundle (`env`), so server and browser agree. Next's `usePathname` has no base path, so the nav adds it before marking the current page.
- **Each page is a folder in a base-path build** (`trailingSlash`): `tours/index.html`, linked as `/north-tours-web/tours/`. The default export has both `tours.html` and a `tours/` folder (for the tour pages), and how GitHub Pages picks between the two for `/tours` isn't documented. With folders there's only one answer: `/tours/` serves its `index.html`, and `/tours` redirects to it. Links already end in `/`, so none redirect. The default build keeps `tours.html`; the issue asks for its page paths to stay as they are.
- **`NOINDEX=1` keeps the preview out of search engines:** every page gets `<meta name="robots" content="noindex">` and robots.txt disallows everything. The meta tag does the work: a crawler reads robots.txt only at the host's root (`abuubkar.github.io/robots.txt`), not at a project's sub-path.
- **A deploy workflow,** `.github/workflows/pages.yml`, on push to `main` and by hand: install with the frozen lockfile, `pnpm content:check`, `pnpm build` with `BASE_PATH=/north-tours-web NOINDEX=1`, then upload `out/` and deploy with GitHub's official Pages actions. Photos are committed (ADR-0015), so it doesn't run `pnpm images`. It has only `contents: read`, `pages: write` and `id-token: write`, and one deploy runs at a time.
- **`pnpm audit:site --origin <address>`** runs the same checks against a live site: it builds for the address's path, takes the page list from that build, and loads every page from the address instead of the local server. Without `--origin` it's as before.
- **The rest of ADR-0007 stands:** no host-specific code for the real site. The real host gets its own ADR; at launch it builds without `BASE_PATH` and `NOINDEX`, with the real site URL in settings.

## Alternatives considered
- **Keep `.html` pages under the base path:** relies on GitHub Pages serving `tours.html` for `/tours` while a `tours/` folder exists, which isn't documented and can't be tried before Pages is turned on.
- **Folders in every build:** changes every page path in the default export, which the issue rules out.
- **A `<base href>` tag or relative links:** a `<base>` changes how every anchor (`#main`, `#refunds`) resolves; relative links would need each page's depth.
- **Next's `<Link>` and `<Image>`, which add the base path themselves:** the site uses plain `<a>` and its own `<picture>` (ADR-0015); switching is a far larger change.
- **Robots.txt alone:** not read at a project's sub-path.

## Consequences
- Anyone with the link can see the preview; no search engine should list it.
- A link or image URL that skips `sitePath` breaks only on the preview. Routes and the image helpers are the only places that write a root-relative path.
- GitHub, as the preview's host, sees visitors' IP addresses. The Privacy Policy (sample text, ADR-0020) describes the site, not the preview host; the real host's ADR updates it if needed.
- The repo must be public with Pages set to deploy from GitHub Actions; the owner turns that on.
- Revisit when the real host is chosen, or if the preview moves to a custom domain at the root (then `BASE_PATH` is empty and pages need no folders).
