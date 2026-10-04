# ADR-0015: Build-time image variants with sharp

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #39, #40

## Context
The Homepage PRD (#39) brings the first real photos: places from Unsplash or Wikimedia Commons (ADR-0009). Most visitors are on mid-range Android phones on mobile data (CLAUDE.md §1), and the hero photo is the page's Largest Contentful Paint (target ≤ 2.5s). A full-size camera JPEG would be far too heavy, so each photo needs smaller copies in modern formats, and the page has to let the browser pick the right one.

The site is a static export (ADR-0002) and hosting is undecided (ADR-0007), so nothing can resize images on request.

## Decision
- **`sharp`, as a dev dependency only,** resizes photos at development time. Nothing from it ships to visitors.
- **`pnpm images`** (`scripts/images.ts`) reads every photo in content and writes AVIF, WebP and JPEG copies at a fixed list of widths (480, 800, 1200, 1600, 2400; never wider than the photo). For each page hero it also writes a 1200×630 share crop for link previews. Files that are already up to date are skipped, so a second run changes nothing.
- **Source photos live in `content/images`** (CLAUDE.md §7); the copies go to `public/images` under the same path. **Both are committed**, so building the site needs no image step.
- **Variant names are derived, not stored:** `/images/hunza/attabad.jpg` gives `/images/hunza/attabad-800.webp` and `/images/hunza/attabad-share.jpg`. One width list in `lib/utils/images.ts` is shared by the script and `MediaFrame`.
- A photo's content gains only an optional `focus` (x and y in percent), used for crops in fixed-ratio frames and in the share crop.
- **`MediaFrame`** renders `<picture>` with AVIF and WebP sources and a JPEG `<img>`, with `srcset`, `sizes`, width and height. It lazy-loads unless told it's the page's main image.
- **`pnpm content:check` (and so the build) fails** when a photo's source or generated files are missing.

## Alternatives considered
- **`next/image`:** its optimiser needs a server, or a custom loader pointing at an image service; neither fits a static export with hosting deferred.
- **An image CDN (Cloudinary, Cloudflare Images):** a service and an account before hosting is chosen (ADR-0007), and the site would depend on it at runtime.
- **Exporting the sizes by hand:** slow, easy to get wrong, and nothing checks that every size exists.
- **Generating at build time instead of committing:** every build, and every machine that builds, would need `sharp` and minutes of encoding; committed files keep `pnpm build` fast and unchanged.

## Consequences
- Adding a photo is one command, and the build refuses a photo whose copies are missing.
- Visitors get small AVIF or WebP files sized for their screen, with JPEG for older browsers.
- The repository grows by roughly 0.5–1.5 MB per photo (source plus copies); fine for a few dozen place photos.
- `sharp` brings a native binary as a dev dependency, installed per platform by pnpm.
- Revisit when hosting is chosen (an image service may then make sense), or if the photo count grows into the hundreds.
