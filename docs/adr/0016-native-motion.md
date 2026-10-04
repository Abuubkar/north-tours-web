# ADR-0016: Native motion: CSS scroll-driven animations and one small hook, no GSAP

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #39, #45

## Context
The Homepage design has three kinds of motion (DESIGN.md §10): the hero photo blurs, zooms and darkens as it scrolls away (M1); the brand statement lights up word by word as it comes into view (M2); and the tour cards rise once when first seen (M4). KICKOFF planned to add GSAP with ScrollTrigger in the Tour Detail PRD for this kind of work (CLAUDE.md §3, §9).

Visitors are mostly on mid-range Android phones (CLAUDE.md §1), so motion must not add main-thread work on every scroll or much JavaScript. CLAUDE.md §9 also says content is visible by default, animations only enhance, reduced motion means none, and prices, dates, seats and buttons are never hidden.

## Decision
- **Scroll-linked motion is pure CSS:** scroll-driven animations (`animation-timeline: view()`, named view timelines and `animation-range`). M1 and M2 are written this way. They run off the main thread, with no script.
- **Entrance motion uses one small IntersectionObserver hook** in `/hooks` (`useRiseOnView`). It adds the offset only to cards that are still below the fold when the page loads, then lets them rise once when they come into view. If the script fails, the cards are simply in place.
- **No GSAP**, and no other animation library. This replaces the plan to add GSAP in Tour Detail; later pages use the same native technique.
- **Rules for every animation:**
  - only `transform`, `opacity` and `filter` animate;
  - every scroll-driven rule sits inside `@supports (animation-timeline: view())`, so browsers without it show everything in its final state;
  - every rule sits inside `@media (prefers-reduced-motion: no-preference)`, or the hook checks it, so reduced motion means no motion;
  - content is visible by default, and prices, dates, seats and buttons are never hidden or faded (on a rising card only the photo fades);
  - one entrance animation per page (CLAUDE.md §9). Scroll-linked motion (M1, M2) follows the reader's scroll, so it isn't an entrance.

## Alternatives considered
- **GSAP with ScrollTrigger:** a dependency of about 40 KB (gzip, with ScrollTrigger) for what CSS now does natively, and its scroll handling runs on the main thread.
- **A scroll listener with `requestAnimationFrame`** (as the design files do): main-thread work on every scroll, and hand-written maths for what `animation-range` expresses directly.
- **No motion:** simplest, but the PRD and design ask for these three effects, and they can be added without cost to content or performance.

## Consequences
- No new dependency; the motion costs a few lines of CSS and one small hook.
- Browsers without scroll-driven animations (older Safari and Firefox at the time of writing) show the page without M1 and M2. That's acceptable: the page is complete without them.
- Scroll-driven ranges are written in CSS, so tuning them means editing the section's stylesheet rather than script.
- Revisit if a design needs sequencing CSS can't express (e.g. timelines across many elements with complex easing), in a new ADR.
