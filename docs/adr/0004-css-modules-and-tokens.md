# ADR-0004: CSS Modules with design tokens, no utility framework or component library

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
The design system comes from Claude Design. Research on "AI slop" design flagged default component-library and Tailwind looks as the most common tell. We want zero styling dependencies and full control.

## Decision
Global design tokens as CSS custom properties in `/styles/tokens.css`. Component styles in co-located CSS Modules. All values come from tokens.

## Alternatives considered
- Tailwind — acceptable only with fully replaced defaults; adds a dependency and a second styling language.
- shadcn/ui or similar — brings its own defaults, which conflict with our design system.

## Consequences
- No styling dependencies; CSS Modules are built into Next.js.
- Discipline required: no hard-coded values in component CSS.
