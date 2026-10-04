# ADR-0017: Room prices per tour, a per-departure override, and a derived "from" price

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #47, #49

## Context
Until now a tour had one price, `priceFrom`, and a departure could replace it with its own `price`. The Tour Detail design (#47) sells rooms: twin, triple and quad sharing, each at its own price per person, and families save by sharing a room. Some dates also cost more (Eid), and on those dates every room type costs more, not just one.

The "from" price shows on tour cards, in the Tour Detail hero, the booking panel and the sticky bar. Stored by hand it can drift from the real prices: a cheap date that has passed, or a date that costs more, would leave it wrong.

## Decision
- **A tour has three room prices,** `prices: { twin, triple, quad }`, per person in whole PKR. They replace `priceFrom`.
- **A departure may have its own `prices`,** the same shape, which replace the tour's whole set for that date (e.g. an Eid departure). They replace the departure's optional `price`. A partial override (only twin) isn't allowed: one set is easier to read and check.
- **The schema checks each set runs twin ≥ triple ≥ quad:** sharing a room never costs more per person.
- **"From" is worked out, never stored:** the lowest twin price across the tour's upcoming departures, or the tour's own twin price when none is left. The build and the browser apply the same rule with the same `today`, as they do for departures.
- Pure, tested functions in `lib/utils` give a departure's prices, the "from" price, the total and the advance, so the cards, the hero, the panel and the WhatsApp message always agree.
- A tour card shows the twin price of the departure it shows.

## Alternatives considered
- **One price plus fixed room discounts** (e.g. triple 7% less, quad 12% less): less to type, but real hotel rates don't follow a fixed percentage, and an Eid date would still need its own rule.
- **Prices on each departure only:** every new date would need three prices typed again, and a tour with no dates left would have no price to show.
- **Keep `priceFrom` alongside room prices:** two places to change one price, and nothing stops them disagreeing.

## Consequences
- The owner changes a tour's prices in one place, and prices an Eid date by adding `prices` to that departure. `/add-departure` takes room prices for a date and adds them only when they differ from the tour's.
- Every place that showed a price reads it through the same functions, so "from" can't drift from the dates on sale.
- Room types are fixed at twin, triple and quad. Another type (a single room supplement, say) would need a schema change and a new ADR.
