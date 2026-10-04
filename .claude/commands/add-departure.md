---
description: Add a new departure date to a tour
argument-hint: <tour>, <start date>, [seats total], [twin, triple and quad prices]
---

Add a departure: $ARGUMENTS

This is a content-only task (CLAUDE.md §7). Change only files in `content/`. If the request seems to need anything else, stop and ask.

1. **Find the tour** in `content/tours/` by `title` or `slug`. If no tour matches, or more than one could, list the candidates and ask.
2. **Start date:** turn it into `YYYY-MM-DD`. If the year is missing, use the next occurrence on or after today (Asia/Karachi). Refuse dates in the past.
3. **End date** is `start + (days − 1)`, using the tour's `days`. Never ask for it.
4. **Seats total:** use the number given; otherwise copy it from the tour's latest departure and say so. If the tour has no departures, ask. A new departure starts full: `seatsLeft = seatsTotal`.
5. **Room prices (ADR-0017):** a date normally uses the tour's `prices` (twin, triple and quad, per person). Only when the request gives prices for this date (e.g. Eid) that differ from the tour's set, add `prices` with all three, in whole rupees: `"prices": { "twin": 160000, "triple": 150000, "quad": 140000 }`. If only some are given, ask for the rest; never add a partial set. They must run twin ≥ triple ≥ quad. If they match the tour's set, leave `prices` out and say so.
6. **Refuse duplicates:** if a departure already starts on that date, say so and stop.
7. **Insert it** into `departures` in date order. Keep the JSON formatting as it is, and leave any `"sample": true` on the tour or its rating as it is (ADR-0022): only the owner removes it.
8. **Check:** run `pnpm content:check`. If it fails, undo the edit and report the problem.
9. **Show the change:** run `git diff -- content/` and summarise it in one line, e.g. "Swat Family Escape: added 14–18 Aug 2027, 18 seats." or "…, 18 seats, its own prices: twin PKR 56,000, triple PKR 52,000, quad PKR 49,000."
10. Don't commit or push unless asked. The change goes live after the next build (ADR-0003).
