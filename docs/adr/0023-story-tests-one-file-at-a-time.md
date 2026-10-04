# ADR-0023: Story tests run one file at a time, and set reduced motion per story

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #39, #45

## Context
The Homepage's motion (ADR-0016) must do nothing when a visitor prefers reduced motion, and the stories have to test both cases (ADR-0012). CSS `@media (prefers-reduced-motion)` can only be switched by the browser itself: Chromium's DevTools protocol (`Emulation.setEmulatedMedia`), which Vitest's browser mode exposes as `cdp()`.

That setting applies to the whole test page, and Vitest runs story files in parallel inside that one page. A story that turns reduced motion on would then change what a story in another file sees halfway through its test, and the motion tests failed at random.

## Decision
- **Each story that depends on the motion setting sets it** in its `beforeEach`, with `emulateReducedMotion` or `emulateFullMotion` from `.storybook/reducedMotion.ts`. Stories that don't depend on it don't touch it. In the Storybook UI there's no driver, so these do nothing and the story follows the OS setting.
- **Story files run one at a time** (`fileParallelism: false` for the Storybook project in `vitest.config.mts`). Stories within a file already run in order. Unit tests still run in parallel.

## Alternatives considered
- **Stubbing `matchMedia` per story:** reaches script (the cards-rise hook) but not CSS media queries, which drive the hero and statement motion.
- **Leaving motion out of story tests and checking it only by hand:** the PRD asks for reduced-motion `play` tests, and they guard against regressions.
- **A separate Vitest project for motion stories:** two story runners to keep in step, for the same result.

## Consequences
- Reduced-motion behaviour is tested in real Chromium, in CSS and in script.
- `pnpm test` (and so the pre-commit hook, ADR-0014) takes longer: about 20 seconds instead of 10.
- Revisit if Vitest gives each file its own page, or if the test run grows slow enough to matter.
