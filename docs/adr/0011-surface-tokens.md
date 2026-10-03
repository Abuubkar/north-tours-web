# ADR-0011: Surface tokens for dark and light sections

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #1, #3

## Context
The design uses two surfaces: Ink 900 for imagery and Mist 50 for reading. The same components (buttons, inputs, accordions, links) appear on both. With only the raw palette, each component would need an "on light" variant, which CLAUDE.md §6 rules out ("no one-off variants", "prefer composition over boolean prop explosions").

## Decision
Two layers of colour tokens in `styles/tokens.css`:
- **Raw palette**, named exactly as DESIGN.md §13. Used only inside the tokens file.
- **Surface tokens** (`--bg`, `--fg`, `--fg-2`, `--fg-3`, `--hairline`, `--control-border`, `--link`, `--link-hover`, `--error`) with dark values on `:root`, redefined inside `[data-surface="light"]`, together with `color-scheme`.

Components use surface tokens plus the gold tokens (the same on both surfaces), never the raw palette. A section switches surface by carrying `data-surface="light"`.

## Alternatives considered
- Raw palette only, with "on light" variants per component: doubles variants and invites mismatches.
- A `light` prop on each component: the boolean prop explosion CLAUDE.md §6 warns against.

## Consequences
- One component works on both surfaces with no extra code.
- Errors reuse gold on dark and deep gold on light (no separate error colour).
- Nesting a dark block inside a light one needs a `[data-surface="dark"]` block that repeats the dark values; it is added when the first such block exists (layout shell PRD).
