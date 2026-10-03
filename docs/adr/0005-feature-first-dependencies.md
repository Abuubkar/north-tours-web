# ADR-0005: Feature-first growth of dependencies, files and folders

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
Scaffolding everything up front bloats `package.json`, creates dead code, and makes reviews harder to follow.

## Decision
A dependency, file, folder, config or script is added only inside the issue for the feature that needs it. Each new dependency is justified in the PR (feature, why native/existing code is not enough, size impact). Significant ones also get an ADR. Code made unused by a PR is removed in the same PR.

## Consequences
- `package.json` and the folder tree always reflect what the site actually uses.
- Reviews are small and follow one path at a time.
- Slightly more decisions per issue instead of one large setup step.
