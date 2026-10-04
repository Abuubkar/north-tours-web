# ADR-0026: The main nav links only to pages

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #118, #120

## Context
The Layout shell PRD (#32) copied the design's nav before the later pages existed: Tours, How it works, Destinations, Guides and Reviews. Only Tours opened a page. How it works, Destinations and Reviews jumped to Homepage sections, and Guides to a section of About. On the Homepage a scroll-spy (#46) marked the section in view; elsewhere the URL marked the page, so the highlight meant two different things. The footer listed a different set of links, and named the same About page "About us" where the header said "Guides". The Trip Planner and Contact weren't in the header at all. The owner asked for a nav that "only caters pages".

## Decision
- **The main nav links only to pages in the route map, never to a section of a page:** Tours, Destinations (a new `/destinations` page, #119), Private trips (`/plan`), About and Contact, in that order.
- **One list** (`mainNav`, `lib/utils/nav.ts`) drives the header nav, the mobile menu's large links and the footer's large links, so they can't drift apart.
- **The active item comes from the URL alone** (`activeNavItem`): an item marks its own page, and Tours and Destinations also every page under them. It's gold with `aria-current="page"`, by the same rule in all three places. Pages outside the nav (the Homepage, Help, the legal pages, Photo credits, the 404) mark nothing.
- **No scroll-spy in the nav.** The Homepage's sections stay on the Homepage. The section-in-view hook stays for the itinerary's current day, which isn't nav.
- **A new page in the main nav needs its own decision.** The header is sized for five items next to the brand and "WhatsApp us" from 820px; a sixth may not fit.
- **Links inside content may still point to a section of another page** (e.g. "Meet the team →" to `/about#guides`, guide profiles, Help answers). The rule is for the nav only.

## Alternatives considered
- **Keep the section anchors and fix the highlight:** keeps "Destinations" leaving a destination page for the Homepage, and the three different highlight behaviours.
- **Drop Destinations from the nav instead of adding a page:** the six destination pages would have no list to return to.
- **Put Help in the header as a sixth item:** doesn't fit at 820px; Help stays a footer link, and Contact's quick links point to it.
- **Keep scroll-spy on the Homepage only:** a highlight that marks a place on one page and the page elsewhere is the inconsistency this replaces.

## Consequences
- Every nav tap opens a page; the header, menu and footer always agree; the highlight always means "the page you're on".
- How it works and Reviews are no longer reachable from the nav, only by scrolling the Homepage.
- `routes.how` and `routes.reviews` and the Homepage section ids only they targeted are gone.
- Revisit if the site gains a page that belongs in the nav, or if the header's width changes.
