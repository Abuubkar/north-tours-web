# ADR-0001: Record architecture decisions

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
The site is built with Claude Code across many sessions. Decisions made in one session must be visible in the next, and reviewable by the owner.

## Decision
Record significant decisions as ADRs in `docs/adr/`, using `0000-template.md`. Accepted ADRs are never edited; a new ADR supersedes an old one.

## Consequences
- Claude Code and humans share one written history of why things are the way they are.
- Small overhead per significant decision.
