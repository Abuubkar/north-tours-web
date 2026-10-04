# ADR-0019: Mark invented claims about the company

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #78, #79

## Context
ADR-0010 lets sample content stand in until the owner supplies real content: invented tours, prices, reviews, guides and facts. Until now that content described trips. The About page (PRD #78) is about to make claims about the company itself: who founded it and how, how it runs every trip, the vehicles it owns and how old they are, how it keeps travellers safe, how many travellers it has taken, and which associations it belongs to.

A family reads those claims to decide whether to trust the company with their parents and children. An invented one that reaches launch misstates the company. In the files, an invented claim looks exactly like a real one (ADR-0010's consequence), so nothing tells the owner which of them to replace or confirm.

The About page also needs photos of the fleet. ADR-0009 covers places (free-licence photos allowed) and people (the owner's only), but not vehicles.

## Decision
- **Any object in content that holds an invented claim about the company carries `sample: true`.** On About that is the story and founder, each principle, each vehicle and the fleet age, the safety list, each stat beyond the `trust` settings, and the memberships.
- **The field accepts only `true`.** The owner confirms a claim, or replaces it with the real one, by removing the field. Any other value fails `content:check` and the build.
- **It never shows on the site.** It is a note for the owner and for the pre-launch check: PRD 12's `launch:check` lists every flagged object, by file and field.
- **Not flagged:** headlines, labels and leads (page copy, not claims), the sample tours, guides and reviews ADR-0010 already covers, and the `trust` values that settings hold for every page.
- **Contact details and legal identifiers stay `[placeholders]`** (ADR-0010): an invented licence number or address is never sample content, flagged or not.
- **Vehicle photos:** until the owner supplies photos of the real fleet, a vehicle may show a free-licence stock photo of its type, from Unsplash or Wikimedia Commons, credited as ADR-0009 asks, on these conditions: vehicles only, no person visible, and no other company's name readable. The vehicle carrying the photo is flagged, so the photo is replaced with the claim. This extends ADR-0009; photos of people are still the owner's only.

## Alternatives considered
- **`[X]` placeholders for every claim:** what the design does. ADR-0010 moved away from brackets because a page full of them can't be reviewed, and they say nothing about what the real value might be.
- **A separate list of sample items** (a file naming each invented claim): it drifts from the content as claims are edited, added or removed.
- **Flagging whole files** (`content/pages/about.json` is sample): too coarse to act on. The owner can't confirm the founder without also confirming the fleet.
- **A free-text note per claim** (`"note": "invented"`): any value would pass, and the check couldn't tell a note from a confirmation.

## Consequences
- The owner can see, file by file, which claims about the company are invented, and confirm each one separately.
- PRD 12's `launch:check` has one rule to apply across content: list every `sample: true`.
- Every new kind of company claim needs the field in its schema; a schema that forgets it lets an invented claim through unmarked.
- Revisit if the owner wants sample claims shown as such on the site, or if other content (tours, guides, reviews) should be flagged the same way before launch.
