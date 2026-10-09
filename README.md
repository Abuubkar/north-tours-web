# Safar e Mubarik

The website of Safar e Mubarik, a Lahore tour operator running group and private tours to northern Pakistan: Hunza, Skardu, Naran-Kaghan, Swat, Fairy Meadows and Murree. Visitors browse tours and destinations, plan a private trip, and book on WhatsApp.

**Live preview:** <https://abuubkar.github.io/north-tours-web/>

The preview isn't the launched site. Some content is still sample text (reviews, ratings, guide photos), so search engines are asked not to index it. `pnpm launch:check` lists everything still to replace.

## Stack

- **[Next.js](https://nextjs.org) static export**, React 19, TypeScript (strict). No server code (ADR-0002).
- **CSS Modules** with design tokens in `styles/tokens.css` (ADR-0004, ADR-0011). No Tailwind or component library.
- **Content as JSON** in `content/`, validated by Zod schemas at build time (ADR-0003, ADR-0013).
- **Images** resized and converted by sharp (`pnpm images`, ADR-0015).
- **Tests:** Storybook stories with `play` tests and axe, run by Vitest in Chromium, plus unit tests for `lib/` (ADR-0012).

## Getting started

You need Node 24 and pnpm.

```sh
pnpm install
pnpm dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Runs the site locally |
| `pnpm build` | Builds the static site into `out/` |
| `pnpm test` | Unit tests and every story's tests |
| `pnpm lint` / `pnpm typecheck` | ESLint, and TypeScript with Next's route types |
| `pnpm storybook` | Component library at http://localhost:6006 |
| `pnpm content:check` | Validates every content file |
| `pnpm images` | Writes each photo's sizes and formats to `public/images` |
| `pnpm audit:site` | Lighthouse and axe on every built page (`--origin <url>` audits a live site) |
| `pnpm launch:check` | Lists the placeholders and sample content left before launch |

A pre-commit hook runs `pnpm content:check` and `pnpm test` (ADR-0014).

## Project layout

```
app/          routes and page composition
components/   ui/ base components; one folder per feature (tour-card, planner, places-map…)
sections/     page sections built from components
content/      site content: settings, pages, tours, destinations, guides, reviews, FAQs
lib/          content loaders and schemas (lib/content), pure functions (lib/utils)
hooks/        client hooks
styles/       tokens, globals, typography
scripts/      content check, images, site audit, launch check
docs/         ADRs, component notes, design export, checklists
```

## Editing content

Wording, prices, departures, reviews and settings live in `content/` and never in components. Global values such as the WhatsApp number, phone and advance percentage live only in `content/settings.json`. Run `pnpm content:check` after editing; the build fails on invalid content.

## Deploying

Every push to `main` builds the site and deploys it to GitHub Pages (`.github/workflows/pages.yml`, ADR-0032). See [docs/github-pages-preview.md](docs/github-pages-preview.md). The real host is still to be chosen.

## Docs

- [CLAUDE.md](CLAUDE.md): project rules and workflow
- [DESIGN.md](DESIGN.md): design system and tokens
- [docs/adr](docs/adr): architecture decisions
- [docs/components.md](docs/components.md): components and sections
- [docs/launch-checklist.md](docs/launch-checklist.md): before launch
