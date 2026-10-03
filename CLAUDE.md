# CLAUDE.md — Project rules

Read this file before every task. If a request conflicts with these rules, stop and ask.

## 1. Project

Website for a Lahore-based tour operator running group and private tours to northern Pakistan
(Hunza, Skardu, Naran-Kaghan, Swat, Fairy Meadows, Murree).

- **Audience:** Pakistani families, couples, friend groups and corporate teams, mostly on
  mid-range Android phones on mobile data.
- **Primary conversion:** WhatsApp enquiry. Online payments are out of scope for now; the
  advance is paid in cash or by bank transfer only (ADR-0008).
- **Design source of truth:** `DESIGN.md`, plus the Claude Design export in `docs/design/`
  (read-only reference; see its README for precedence and known stale details). Never invent new styles, colours, fonts or components that are not in the
  design system.

## 2. Stack (see `docs/adr/`)

- Next.js with **static export** (`output: 'export'`). No server code, API routes or
  server-only features.
- TypeScript, strict mode.
- Styling: **CSS Modules + global design tokens** (CSS custom properties). No Tailwind, no
  component library.
- Content: files in `/content`, validated at build time (ADR-0003).
- Package manager: pnpm.

## 3. Working agreement: feature-first

This is the most important rule in the project.

- **Nothing is added before a feature needs it.** A dependency, file, folder, config or
  script is only created inside the issue that requires it.
  - Example: GSAP is installed in the issue that builds the first animation, not at setup.
  - Example: the content validation library is installed in the issue that builds the
    content system.
- **Every new dependency must be justified in the PR description:** which feature needs it,
  why native APIs or existing code are not enough, and its size impact.
  If it is a significant architectural choice, write an ADR first.
- **No speculative code:** no "we might need this later" helpers, props, variants, config
  flags or empty folders.
- **No dead code:** remove unused exports, files, styles and dependencies in the same PR
  that makes them unused.
- **One issue = one focused PR.** Small, reviewable, does one thing. Do not touch files
  outside the issue's scope. If you notice something else, open a new issue instead.
- Stay on the path of the current issue. Do not refactor, rename or "improve" unrelated code.

## 4. Specs and workflow (Matt Pocock skills + GitHub)

- **Specs live in GitHub Issues.** PRDs are created with `/to-spec`, then broken into
  vertical-slice issues with `/to-tickets`. Use `/triage` to keep issues agent-ready.
- **Work one issue at a time.** Read the issue fully before writing code. If anything is
  ambiguous, ask (or use `/grill-me`) before starting.
- **Before opening a PR,** run `/code-review` against the issue and these standards.
- **Commits:** small, descriptive, and reference the issue number (e.g. `feat(tour-card): …
  (#12)`).
- **The pre-commit hook** runs `pnpm content:check` and `pnpm test` (ADR-0014). Fix what it reports;
  never skip it with `--no-verify` unless the owner says so.
- **Pushing:** Claude may push its own feature branches by name (`git push -u origin <branch>`)
  and open PRs. Never push to `main`, force-push, push without naming the branch, delete
  branches, or `reset --hard`.
- **Merging:** Claude may merge its own PRs into `main` with `gh pr merge <number> --merge`, but
  only once the `/code-review` findings are addressed, lint, typecheck, `pnpm test`,
  `pnpm content:check` and the build pass, and the PR has no conflicts. Never merge with
  `--admin`, never delete the branch on merge, and never merge a PR the owner has asked to
  review first. Then update local `main` with `git pull --ff-only`.
- The git-guardrails hook enforces the pushing and merging rules.

## 5. Architecture Decision Records

- ADRs live in `docs/adr/`, numbered `NNNN-short-title.md`, using `docs/adr/0000-template.md`.
- **Write an ADR before implementing** when a decision:
  - adds a significant dependency (animation, validation, testing, maps);
  - changes architecture, data flow or the content model;
  - sets a project-wide convention;
  - is hard to reverse.
- ADRs are never edited after acceptance. To change a decision, write a new ADR that
  supersedes the old one, and mark the old one "Superseded by ADR-XXXX".
- Link the ADR from the related issue and PR.

## 6. Code structure

Folders are created only when the first file for them is needed (section 3).

```
/app                    routes and page composition only, no business logic
/components
  /ui                   base components: Button, Tag, Input, Stepper, Accordion, Sheet, Dropdown…
  /<feature>            composed components for one feature: tour-card, booking-panel, route-map…
/sections               page sections built from components (Hero, DeparturesGrid…)
/content                site content files (ADR-0003)
/lib
  /content              content loading + schemas
  /utils                small pure functions, grouped by domain (dates.ts, price.ts, whatsapp.ts)
/hooks                  reusable client hooks
/styles                 tokens.css, globals.css, typography, reset
/types                  shared types that are not derived from content schemas
/docs/adr               architecture decision records
/docs/design            Claude Design export, read-only reference
```

### Component rules

- **One component per file.** A file exports one component. Small private subcomponents
  only if they are used nowhere else and stay short.
- **Types in their own file.** A component's props and related types live in
  `Component.types.ts` next to it (e.g. `Button.types.ts`); the component file imports them.
- **Keep components lean.** If a component file grows beyond about 150 lines, or mixes
  rendering, data shaping and side effects, split it.
- **Separate concerns:**
  - formatting and logic go in `/lib/utils` as pure, tested functions;
  - stateful client behaviour goes in `/hooks`;
  - components render.
- **Reuse before creating.** Check `/components/ui` and existing feature components first.
  Build a base component only when the design shows it used in at least two places, or it is
  a true primitive (button, input).
- Base components follow the design system variants exactly (e.g. Button: primary, secondary;
  sizes from tokens). No one-off variants.
- Props are typed explicitly. No `any`. Prefer composition (`children`) over boolean prop
  explosions.
- **Client components only where interaction requires it** (filters, booking panel, planner,
  drawer, map). Everything else stays a server-rendered static component.

### Styling rules

- **Every value comes from tokens:** colour, spacing, radius, type scale, shadows, motion
  durations. No hard-coded hex values or magic numbers in component CSS.
- **Co-locate:** `Component.tsx`, `Component.module.css` and `Component.stories.tsx` in the same
  folder.
- Keep selector specificity flat (one class per rule where possible); avoid styling by
  element type inside components.
- Radius scale from the design system:
  - 2px for inputs;
  - 6px for buttons;
  - 8px for cards and panels;
  - 999px only for filter chips and tags.

## 7. Content system

- All user-visible content lives in `/content`: settings, tours, departures, destinations,
  guides, reviews, FAQs, policies, images.
- **Global values live only in `content/settings.json`** and are never duplicated: WhatsApp
  number, phone, office hours, DTS licence, advance %, reply time, payment methods.
- Every content type has a schema. **The build must fail on invalid content:**
  - `seatsLeft` greater than `seatsTotal`;
  - missing image alt text;
  - a review without `consent: true`;
  - a guide without `consent: true`;
  - wrong date formats.
- **Content-only tasks may only modify `/content`.** If a content task appears to need a code
  change, stop and ask.
- **Content commands** for routine edits: `/update-seats`, `/add-departure`, `/add-review`,
  `/add-guide` (`.claude/commands/`). Each edits only `/content`, runs `pnpm content:check` and
  shows the change. Run `pnpm content:check` after any other content edit too.
- Pages read content only through the loaders in `lib/content` (`getSettings`, `getTours`,
  `getDestinations`, `getGuides`, `getReviews`…), never the files directly. Derived values
  (urgent, sold out, seats wording, upcoming departures) come from `lib/utils`, never stored.
- **Sample content is allowed (ADR-0010):** invented tours, prices, reviews, ratings, guides,
  statistics and facts are fine, as long as they pass the schemas. Exception: WhatsApp
  number, phone, email, office address, DTS licence and company registration stay as
  `[placeholders]` until real values are supplied.

## 8. Design rules

- Follow the design system exactly. Font: Geist. Accent: gold `#D9B44A` on dark, `#7A5A12` on
  light. Primary buttons use the gold background with `#10161A` text.
- **Don'ts:**
  - no orange accent;
  - no pill-shaped main buttons;
  - no labels repeating headlines;
  - no decorative numbering (numbers only for real sequences);
  - no word-by-word reveals except the homepage brand statement;
  - no new gradients, glows or glassmorphism;
  - no emoji as icons.
- **Images (ADR-0009):**
  - places: real photos from Unsplash or Wikimedia Commons are allowed, downloaded into the
    repo, with `source`, `author`, `licence` and `sourceUrl` recorded; credit shown where the
    licence requires it;
  - people: no stock photos of people, ever. The owner supplies all photos of guides,
    drivers, team and travellers; keep the placeholder until then;
  - no AI-generated images of real destinations, guides or customers. AI-generated media is
    allowed only for abstract atmosphere, and must be marked as such in the content files.
- **Map:** the route map is a schematic SVG with no country borders. Do not add a third-party
  basemap. The final map needs Survey of Pakistan vetting before launch.

## 9. Motion rules

- GSAP is added only in the first animation issue (section 3).
- One entrance animation per page at most. Prices, dates, seats and buttons are never hidden
  by animation.
- **Content is visible by default.** Animations enhance; if JS fails, everything still shows.
- Respect `prefers-reduced-motion`: everything simply appears.
- **Never hijack scrolling.** No smooth-scroll libraries; pinned sections must not trap the scroll.

## 10. Quality bar (every PR)

- **Mobile-first.** Check at 390px, at 1366×768 and at 1440px.
- **Core Web Vitals targets:** LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Do not lazy-load the LCP
  image. Always set image width and height.
- **Accessibility:**
  - WCAG AA contrast on dark and light surfaces;
  - visible focus;
  - keyboard operable;
  - Escape closes overlays and returns focus;
  - tap targets ≥ 44px;
  - exactly one `<h1>` per page, and correct heading order (no skipped levels). Type roles
    are visual only: a role named "H1" or "Display" does not make an element a heading.
- Every page has its own `<title>`, meta description and social share image.
- No console errors. Type-check, lint and `pnpm test` pass.
- **Components have stories** covering their variants and states. Behaviour is tested in story
  `play` functions only; no separate component `.test.tsx` files (ADR-0012).
- **Placeholder check:** list any `[placeholder]` text touched in the PR description.

## 11. Out of scope until explicitly requested

- **Hosting and deployment code:** no Cloudflare configs, adapters, Wrangler files, workers,
  CI deploy steps or hosting-specific code. The project runs locally; hosting is done
  manually by the owner later.
- Online payments, CMS integration, databases, analytics, cookie banners.
- Do not add these "to prepare" for later. They arrive with their own issue and ADR.

## Agent skills

### Issue tracker

Issues and specs live in GitHub Issues (Abuubkar/north-tours-web), managed with `gh`. See `docs/agents/issue-tracker.md`.

### Triage labels

Default five labels: needs-triage, needs-info, ready-for-agent, ready-for-human, wontfix. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.
