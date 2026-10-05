# The preview on GitHub Pages

A preview of the site at <https://abuubkar.github.io/north-tours-web/> (ADR-0032). It isn't the real site: it has a placeholder brand and sample content, and every page asks search engines not to index it.

## Deploying

`.github/workflows/pages.yml` deploys on every push to `main`. To deploy by hand: Actions › "Deploy the preview to GitHub Pages" › Run workflow.

It installs with the frozen lockfile, runs `pnpm content:check`, builds with `BASE_PATH=/north-tours-web NOINDEX=1`, and deploys `out/`. Photos are committed, so run `pnpm images` and commit before pushing a new photo.

Once, in the repo's settings: the repo is public, and Settings › Pages › Build and deployment › Source is "GitHub Actions".

## Building it locally

```sh
BASE_PATH=/north-tours-web NOINDEX=1 pnpm build
```

- **`BASE_PATH`** builds the site for a sub-path. Every link, image and share image is under it, and each page is a folder with its own `index.html` (`out/tours/index.html`, linked as `/north-tours-web/tours/`).
- **`NOINDEX=1`** adds `<meta name="robots" content="noindex">` to every page and makes robots.txt disallow everything.

Without them, `pnpm build` is the normal build: pages at the root, `tours.html`, indexable. Run `pnpm build` again afterwards so `out/` isn't left as the preview build.

To view it, serve `out/` under `/north-tours-web/`. Any static server that serves a folder's `index.html` will do if you copy `out/` into a `north-tours-web` folder first.

## Auditing it

```sh
pnpm audit:site --origin https://abuubkar.github.io/north-tours-web
```

The same checks as `pnpm audit:site` (Lighthouse, axe at 390 and 1440, the page checks, the sitemap and the 404), run against the live preview instead of a local server. It builds for the address's path first, so the page list matches what's deployed, which leaves `out/` as a base-path build. Make sure `main` has deployed before auditing. A live 404 page counts as the built one when their titles match: each build has its own id, so the files never match byte for byte.

Lab numbers from GitHub Pages also depend on its servers and your connection.
