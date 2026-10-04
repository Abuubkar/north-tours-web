# ADR-0022: Flag sample tours, destinations, guides, reviews and settings figures

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #94, #95

## Context
ADR-0010 lets invented content stand in until the owner supplies real content: tours, prices, itineraries, guides, reviews, ratings and figures. Its consequence: invented reviews, ratings and credentials "are indistinguishable from real ones in the files". ADR-0019 and ADR-0020 marked invented claims about the company and sample legal text with `sample: true`, but left the sample tours, destinations, guides and reviews unmarked, and the settings figures families rely on (the advance, the reply time, years operating, trips completed, the refund rules) carry no marker at all.

PRD 12 needs to tell sample from real in two places:
- `pnpm launch:check` lists everything that must be real before launch, by file and field;
- structured data (JSON-LD) marks up a tour's rating and its reviews for search engines, and must never publish invented praise as if it were real.

While the owner swaps sample content for real, the two sit side by side: real reviews next to sample ones, a real tour with a rating that's still invented.

## Decision
- **ADR-0019's `sample: true` extends to ADR-0010's sample content.** It carries the same rules: only `true` is allowed, the owner confirms an item by removing the field, and it never shows on the site.
- **Where it goes:**
  - each tour, destination, guide and review file, at its top level;
  - each tour's `rating` on its own, so a real tour can still carry a sample rating;
  - the settings sections whose figures were invented: `booking` (the advance and reply time), `trust` (operating since, trips completed) and `policies` (the refund schedule and timing, the balance, the children's age).
- **All current sample content is flagged.**
- **New content is real.** Reviews and guides added with `/add-review` and `/add-guide` never get `sample`; `/add-departure` and `/update-seats` leave flags as they are.
- `launch:check` lists every flagged object; structured data leaves out a tour's rating while the tour or its rating is flagged, and leaves out each flagged review.

## Alternatives considered
- **One `sampleContent` switch in settings:** all or nothing. It can't express a mix of real and sample reviews while the owner swaps them, or leave out one review's markup.
- **A separate list of sample files:** drifts from the files as content is added, renamed or removed.
- **Deleting sample content before launch:** leaves empty pages, and layouts can't be reviewed until real content arrives.
- **Flags on reviews only:** leaves invented trips, people and figures unmarked, so they could reach launch unnoticed.

## Consequences
- The owner can see, file by file, which tours, places, people, reviews, ratings and figures are still invented, and confirm each one separately.
- `launch:check` keeps one rule across content: list every `sample: true`.
- Search engines only ever see ratings and reviews the owner has confirmed.
- Every new content type with invented values needs the field in its schema; one that forgets it lets sample content through unmarked.
- Revisit if the owner wants sample content shown as such on the site, or the content model changes how ratings are stored.
