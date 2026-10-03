---
description: Add a new departure date to a tour
argument-hint: <tour>, <start date>, [seats total], [price]
---

Add a departure: $ARGUMENTS

This is a content-only task (CLAUDE.md §7). Change only files in `content/`. If the request seems to need anything else, stop and ask.

1. **Find the tour** in `content/tours/` by `title` or `slug`. If no tour matches, or more than one could, list the candidates and ask.
2. **Start date:** turn it into `YYYY-MM-DD`. If the year is missing, use the next occurrence on or after today (Asia/Karachi). Refuse dates in the past.
3. **End date** is `start + (days − 1)`, using the tour's `days`. Never ask for it.
4. **Seats total:** use the number given; otherwise copy it from the tour's latest departure and say so. A new departure starts full: `seatsLeft = seatsTotal`.
5. **Price:** add `price` only when the request gives one that differs from the tour's `priceFrom`, in whole rupees.
6. **Refuse duplicates:** if a departure already starts on that date, say so and stop.
7. **Insert it** into `departures` in date order. Keep the JSON formatting as it is.
8. **Check:** run `pnpm content:check`. If it fails, undo the edit and report the problem.
9. **Show the change:** run `git diff -- content/` and summarise it in one line, e.g. "Swat Family Escape: added 14–18 Aug 2027, 18 seats."
10. Don't commit or push unless asked.
