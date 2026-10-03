# ADR-0002: Next.js with static export, pnpm, TypeScript strict

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
Marketing and booking-enquiry site. Audience mostly on mid-range Android phones on mobile data. Goal: fast pages and zero hosting cost at launch. No online payments in phase 1. Astro was rejected by the owner.

## Decision
Use Next.js (App Router) with `output: 'export'` to produce a fully static site. TypeScript in strict mode. pnpm as package manager.

## Alternatives considered
- Server-rendered Next.js (with or without Payload CMS) — needs a paid hosting plan; not required for phase 1.
- Astro — rejected by owner.

## Consequences
- No API routes, server actions, ISR or server-only features. Interactivity is client-side only.
- Content changes require a rebuild.
- Moving to server rendering later is possible but needs a new ADR.
