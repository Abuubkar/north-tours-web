# ADR-0012: Storybook as the component workshop and test runner

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #8, #10

## Context
The base components (#8) need a place to be seen in every state, on both surfaces and at 390, 1366 and 1440 px, before any page uses them. Several of them rely on native browser behaviour: Sheet on `<dialog>` with `showModal()`, Dropdown on `popover`, Accordion on `<details name>`. Their important behaviour (Escape closes, focus returns, one item open at a time) must be tested. CLAUDE.md §10 also asks for accessibility on every component.

jsdom 30.1 has no `showModal()`, no `popover` and no exclusive `<details name>` (checked 2026-10-04), so jsdom tests could only check fakes of that behaviour.

## Decision
- **Storybook 10** (`@storybook/nextjs-vite`) is the component workshop. Stories sit next to each component. A toolbar switches the surface (dark / light) and viewports are set to 390, 1366 and 1440.
- **Stories are the source of truth for component states and interaction behaviour.** `@storybook/addon-vitest` runs every story as a Vitest test in **browser mode on headless Chromium** (`@vitest/browser-playwright`). Behaviour stories carry `play` functions written with Testing Library's API from `storybook/test`. Visual-only stories need no assertions.
- **`@storybook/addon-a11y`** runs axe on every story, with violations failing `pnpm test`.
- **No separate component `.test.tsx` files**, so behaviour is never tested twice.
- Plain Vitest unit tests (Node) for pure functions arrive with the first pure function, as a second Vitest project.
- Everything is a dev dependency. Storybook runs locally only: no Storybook build, hosting or CI (ADR-0007).
- One-time setup on a new machine: `pnpm exec playwright install chromium`.

## Alternatives considered
- **jsdom with Testing Library:** fast, but can't run the native elements the components are built on.
- **Building the behaviour in React so jsdom can test it:** more code and client JS, and accordion content would be hidden if JS fails (CLAUDE.md §9).
- **Faking `showModal` and `popover` in jsdom:** tests would check the fakes, not the browser.
- **Separate Playwright end-to-end tests:** a second way of writing tests next to stories.
- **A dev-only showcase page instead of Storybook:** no dependencies, but no built-in accessibility checks or test runner.

## Consequences
- One file per component covers documentation, visual states, behaviour tests and accessibility checks.
- Tests exercise real browser behaviour, including the native elements.
- About 150 dev packages and a local Chromium download (~150 MB). Nothing ships to visitors; `pnpm build` output is unchanged.
- Test runs take seconds, not milliseconds.
- `tsconfck` (inside Storybook's Vite setup) declares a TypeScript 5 peer; it works with TypeScript 6.0.
- Revisit if Storybook falls behind Next.js majors, or if jsdom gains `showModal`, `popover` and exclusive `<details>`.
