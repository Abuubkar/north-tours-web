# ADR-0003: Content as files in /content, updated via Claude Code

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
Content (tours, departures and seats, destinations, guides, reviews, FAQs, policies, settings) must be editable without a paid CMS. The owner will update content through Claude Code, including from the Claude mobile app.

## Decision
Store all content as JSON/MDX files in `/content`. Every content type has a schema validated at build time; invalid content fails the build. Global values live only in `content/settings.json`. Content-only tasks may only modify `/content`. Repeatable content tasks (update seats, add departure, add review, add guide) become project commands once the content system exists.

## Alternatives considered
- Sanity Free — good editor, but adds a service and has admin-only roles on the free plan.
- Payload — best long-term CMS, but needs paid hosting.
- Supabase for live seats — possible later addition if seats change faster than rebuilds allow.

## Consequences
- $0 cost, full version history in Git, every change reviewable and reversible.
- Only people with Claude Code access can update content.
- Updates go live after a rebuild (minutes, not seconds).
