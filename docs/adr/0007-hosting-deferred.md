# ADR-0007: Hosting deferred; no hosting-specific code during development

- **Status:** Accepted; superseded in part by ADR-0032 (a noindexed preview on GitHub Pages, deployed by a workflow)
- **Date:** 2026-10-03

## Context
The owner will set up hosting manually after the site is complete locally. Cloudflare is the likely host (data centers in Karachi, Lahore and Islamabad; static assets served free).

## Decision
During development, the project only needs to run and build locally. Do not add hosting configs, adapters, Wrangler files, workers or deploy pipelines.

## Consequences
- The codebase stays host-agnostic; the static export output can be uploaded anywhere.
- Hosting decisions get their own ADR when the owner starts that work.
