# ADR-0021: Lighthouse for the site audit

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #94, #96

## Context
CLAUDE.md §10 sets the quality bar: LCP ≤ 2.5s, INP ≤ 200ms and CLS ≤ 0.1 on the phones and mobile data most visitors use, no accessibility violations, and on every page exactly one `<h1>`, its own `<title>`, a meta description and a share image. Each ticket measures its own page by hand while it's open. Nothing measures the whole built site again after later tickets change shared parts, or covers all eight tours and six destinations.

Axe already runs on every story (ADR-0012), but not on assembled pages, where duplicate ids, landmarks, heading order and the contrast of sections side by side show up.

Hosting is deferred (ADR-0007), so there's no public URL to measure.

## Decision
- **`pnpm audit:site`** builds the site, serves the static export with a small server inside the script (no dependency; `/path` serves `path.html`, anything unknown the 404 page with status 404, text gzipped as a host would), and checks every built page: each route, each tour and destination, and the 404.
- **Lighthouse** is a dev-only, pinned dependency, run with its default mobile settings (a mid-range phone screen, simulated slow 4G, 4x CPU slowdown) and the performance category only. It reads LCP, CLS and TBT. A page over a limit runs twice more and is judged on the median of three.
- **Axe:** `axe-core` becomes a direct dev dependency, pinned at the version already locked through `@storybook/addon-a11y`, since pnpm doesn't let a script import a package that's only another package's dependency. It runs at 390 and 1440 with reduced motion, once the page settles, with its default rules, as the story tests do.
- **One browser:** both run in the Chromium Playwright installed for the story tests (ADR-0012). Nobody downloads a second browser.
- **INP can't be measured by a tool that loads a page:** it needs real taps. The audit reports TBT as the lab stand-in and warns above 200ms without failing. INP is checked by hand on the interactive flows (`docs/launch-checklist.md`).
- Never shipped, never in `pnpm test`, the pre-commit hook or the build. It runs on demand, before launch and after large changes.

## Alternatives considered
- **PageSpeed Insights:** needs a public URL, and hosting is deferred.
- **Lighthouse CI:** its server, upload and assertion features go unused; the audit needs one table, run locally.
- **`web-vitals` in Playwright with our own throttling:** no simulated slow-4G LCP, so the numbers wouldn't match what Lighthouse and search engines report.
- **Lighthouse's own accessibility score:** a subset of axe's rules, at one width.

## Consequences
- The whole built site is checked against the bar in one command, and its table goes into PRs.
- A full run takes about 7 minutes, so it stays out of commits and tests.
- Size: Lighthouse 13.5.0 is about 21 MB unpacked and adds about 100 dev packages (the lockfile's growth); `axe-core` 4.13.0 was already installed through `@storybook/addon-a11y`. Neither reaches the client bundle.
- Lab numbers aren't field numbers: simulated throttling estimates a mid-range phone, and TBT only hints at INP.
- Revisit when the site has a public URL and real-user data (analytics are out of scope, CLAUDE.md §11), or if Lighthouse drops its programmatic API.
