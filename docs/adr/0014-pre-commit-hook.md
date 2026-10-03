# ADR-0014: A pre-commit hook runs the content check and the tests

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #24 (PR #31)

## Context
Content changes are frequent and often made through the content commands, including from the Claude mobile app. The build refuses invalid content (ADR-0003, ADR-0013), but that only shows up when the site is built, after the change has been committed and pushed. Tests (ADR-0012) likewise only run when someone remembers to run them.

## Decision
- A Git pre-commit hook in `.githooks/pre-commit` runs `pnpm content:check` and then `pnpm test`. Either one failing stops the commit.
- It uses Git's own `core.hooksPath`, set by the `prepare` script on `pnpm install`, so there's no hook-manager dependency.
- The hook is never skipped (`--no-verify`) without the owner's say-so.

## Alternatives considered
- **Husky (with lint-staged):** the common choice, but a dependency for something Git does natively (ADR-0005).
- **Checks in CI only:** there's no CI yet (ADR-0007).
- **Relying on the build:** catches problems too late, after the commit is pushed.

## Consequences
- Invalid content and failing tests can't be committed by accident.
- Each commit takes longer: the story tests start a real Chromium (ADR-0012), roughly 10–20 seconds in total. A machine that commits needs `pnpm install` and `pnpm exec playwright install chromium` once.
- Lint and typecheck aren't in the hook yet; add them if they start slipping through.
