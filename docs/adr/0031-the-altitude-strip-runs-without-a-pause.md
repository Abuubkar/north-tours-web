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
- **It runs at 43px a second** (`--ticker-speed`), very slightly faster than 40.
- **The loop's copy is clickable.** It stays `aria-hidden` and its links are `tabindex="-1"`, so screen readers read each place once and Tab reaches each place once. A click on either drawing opens that place's destination page.
- **The strip runs to the screen's right edge.** The end padding that made room for the pause button is gone, so places enter from the edge.
- **Reduced motion is unchanged:** with `prefers-reduced-motion: reduce`, or without JavaScript, the strip stands still and scrolls sideways.
- Everything else in ADR-0030 stands.

## Alternatives considered
- **Keep the pause button:** WCAG 2.2.2 (Pause, Stop, Hide) asks for one on content that moves automatically for more than five seconds. The owner chose to drop it. Visitors who ask their device for reduced motion still get a still strip.
- **Pause on hover only for the place under the pointer:** still a stop on hover, which the owner doesn't want.
- **Keep the copy inert and make the first drawing wider instead:** the places sliding in would still be dead to clicks for part of every loop.

## Consequences
- **Accessibility:**
  - Without the button, the strip no longer meets WCAG 2.2.2 for visitors who haven't turned on reduced motion. The owner asked for the button's removal (2026-10-05) and was told of the gap. Axe doesn't detect it, so `pnpm audit:site` stays clean; it's listed in the launch checklist's manual pass so it's looked at again before launch.
  - The loop's copy is hidden from screen readers, so touch exploration (VoiceOver, TalkBack) over it finds nothing; each place is still reached once in the first drawing, and swiping moves through them.
  - A click on the copy focuses a link inside hidden content for the moment before the page changes.
- **Clicking moving places:** they have to be clicked as they pass. They stay links 44px tall, so the target is easy to hit at 43px a second. A press held across the loop's restart (once every half minute or so) can miss.
