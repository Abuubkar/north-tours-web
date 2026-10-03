# ADR-0010: Invented sample content is allowed

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
CLAUDE.md originally banned invented content: every unknown review, price, rating, guide, statistic or fact had to be a `[placeholder]`. Most of the content is not available yet, and a site full of brackets is hard to review. The owner has allowed invented content.

## Decision
- Content files may contain invented tours, departures, prices, itineraries, reviews, ratings, guide names and bios, statistics, distances, altitudes and other facts.
- Invented content must still pass the content schemas (for example, reviews and guides still carry `consent: true`, and `seatsLeft ≤ seatsTotal`).
- **Exception:** contact details and legal identifiers stay as `[placeholders]` until real values are supplied: WhatsApp number, phone, email, office address, DTS licence number and company registration. A plausible fake value here would send real customers to the wrong person or misstate a licence.
- People photos follow ADR-0009 and stay as placeholders until supplied.

## Alternatives considered
- Placeholders only (the original rule): accurate, but harder to review layouts and copy.

## Consequences
- Pages look complete during development.
- Invented reviews, ratings and credentials are indistinguishable from real ones in the files, so the owner decides before launch which to replace.
- The pre-launch placeholder sweep still covers the excepted fields above.
