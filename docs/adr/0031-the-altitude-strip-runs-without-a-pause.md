# ADR-0031: The altitude strip runs without a pause

- **Status:** Accepted
- **Date:** 2026-10-05
- **Supersedes:** ADR-0030 in part (the altitude strip's pausing, its pause button, its speed and its inert copy)
- **Related issue:** none (the owner's review of the built site)

## Context
ADR-0030 made the Homepage's altitude strip:
- pause on hover and while focus is inside;
- carry a pause button at its end;
- run at about 40px a second;
- draw the loop's copy `inert`.

The owner reviewed the built site and asked for three changes:
- the strip shouldn't stop on hover;
- it should run very slightly faster;
- the pause button should go.

The owner also found that the places sliding in from the right couldn't be clicked. Those are the loop's copy, which `inert` makes unclickable as well as unfocusable.

## Decision
- **The strip doesn't pause for the pointer,** and has no pause button.
- **A place with keyboard focus still stops it** and is brought fully into view, so keyboard users can see what they're about to open.
- **It runs at 45px a second** (`--ticker-speed`).
- **The loop's copy is clickable.** It stays `aria-hidden` and its links are `tabindex="-1"`, so screen readers read each place once and Tab reaches each place once. A click on either drawing opens that place's destination page.
- **Reduced motion is unchanged:** with `prefers-reduced-motion: reduce`, or without JavaScript, the strip stands still and scrolls sideways.
- Everything else in ADR-0030 stands.

## Alternatives considered
- **Keep the pause button:** WCAG 2.2.2 (Pause, Stop, Hide) asks for one on content that moves automatically for more than five seconds. The owner chose to drop it. Visitors who ask their device for reduced motion still get a still strip.
- **Pause on hover only for the place under the pointer:** still a stop on hover, which the owner doesn't want.
- **Keep the copy inert and make the first drawing wider instead:** the places sliding in would still be dead to clicks for part of every loop.

## Consequences
- **Accessibility:** the strip no longer meets WCAG 2.2.2 for visitors who haven't turned on reduced motion. That's a known gap, accepted by the owner. Axe doesn't detect it, so `pnpm audit:site` stays clean.
- **Clicking moving places:** they have to be clicked as they pass. They stay links 44px tall, so the target is easy to hit at 45px a second.
