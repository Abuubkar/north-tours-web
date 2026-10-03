---
description: Update seats left on one departure after a booking or a cancellation
argument-hint: <tour>, <departure date>, <N seats booked | N seats freed>
---

Update seats for: $ARGUMENTS

This is a content-only task (CLAUDE.md §7). Change only files in `content/`; never code, config or other files. If the request seems to need anything else, stop and ask.

1. **Find the tour.** Match the tour name to a file in `content/tours/` by its `title` or `slug`. If no tour matches, or more than one could, list the candidates and ask.
2. **Find the departure** by its `start` date. Dates may be given without a year ("12 May"): use the departure with that day and month. If more than one matches, or none does, list the tour's departures and ask.
3. **Work out the new number.**
   - "N booked": `seatsLeft - N`. If that's below 0, refuse and say how many seats are actually left.
   - "N freed" or "N cancelled": `seatsLeft + N`. If that's above `seatsTotal`, refuse and say only K seats are booked (`seatsTotal − seatsLeft`).
   - If the request doesn't say booked or freed, ask.
4. **Change only that departure's `seatsLeft`.** Keep the JSON formatting as it is.
5. **Check:** run `pnpm content:check`. If it fails, undo the edit and report the problem.
6. **Show the change:** run `git diff -- content/` and summarise it in one line, e.g. "Hunza & Skardu Grand, 12–20 May 2027: 3 → 1 seats left (urgent tag now 'Only 1 seat left')." Say whether the departure's label changes (urgent, sold out or open), using the rules and wording in `lib/utils/departures.ts` (`seatStatus`, `urgencyText`, `seatsLeftText`); don't restate them from memory.
7. Don't commit or push unless asked. The change goes live after the next build (ADR-0003).
