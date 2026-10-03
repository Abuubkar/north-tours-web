# ADR-0013: Zod for content validation

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #24, #25

## Context
ADR-0003 keeps all content as files in `/content`, and CLAUDE.md §7 requires the build to fail on invalid content: seats out of range, missing alt text, reviews or guides without consent, wrong dates. Pages also need TypeScript types that match the content, so a schema change can't silently break a page. ADR-0005 held back the validation library until this PRD.

## Decision
- **Zod 4** defines one schema per content type. TypeScript types are inferred from the schemas, so there is one source of truth.
- Validation runs only at build time and in tests: in the loaders (`lib/content`), in `next.config.ts` (so `next build` fails), and through `pnpm content:check`. No schema code ships to visitors.
- Errors name the file and the field, and every problem is reported at once.
- `pnpm content:check` runs with Node's built-in TypeScript support (Node 24), so it needs no extra tool. Files it loads use only erasable TypeScript syntax (`erasableSyntaxOnly`) and import each other with `.ts` extensions. The package is marked `"type": "module"`.

## Alternatives considered
- **Valibot:** smaller, but size doesn't matter for build-time-only code, and it's less widely known.
- **Hand-written checks:** no dependency, but no inferred types and far more code to keep correct.
- **JSON Schema with a validator:** two sources of truth (schema and TypeScript types).

## Consequences
- Content types and checks live in one place per type.
- One runtime dependency, used at build time only.
- Content edits go live after a rebuild (ADR-0003). Validation runs on every build and on demand.
- Revisit if build-time validation becomes slow as content grows, or if a CMS replaces files (new ADR).
