# ADR-0030: The header is a solid bar and nothing slides under it

- **Status:** Accepted; superseded in part by ADR-0031 (the altitude strip's pausing, pause button, speed and inert copy)
- **Date:** 2026-10-05
- **Supersedes:** ADR-0027 in part (the header's 960px breakpoint)
- **Related issue:** #135 (PRD), #136, #137, #138

## Context
The header was a frosted, translucent bar, 72px tall (`--header-bg`, Ink 900 at 86%, with a backdrop blur). Every photo hero slid under it with a negative top margin: the Homepage hero, the tour and destination heroes, About's cover and the planner's photo band. So the bar covered the top of each photo.

The owner tried 20 nav bar designs on the live site (`Nav Variants.dc.html`) and chose **2f, "Altitude ticker"**. It's a solid Ink bar with a heavy wordmark, six bold links and a bordered WhatsApp button. Under it, on the Homepage, runs a light strip of valley altitudes. The owner also asked that the nav no longer cut any hero image (2026-10-05).

2f's bar is wider than the old one. Measured on the built site with "[BRAND NAME]▲" (30px/800), the six links (18px/700, 36px apart), the 52px "WhatsApp" button, 48px margins and 24px between groups, it needs about 1,154px. At ADR-0027's 960px breakpoint it would overflow by about 200px.

## Decision
- **The header is a solid bar**: `--ink-900`, `data-surface="dark"`, with no translucency, no backdrop blur and no bottom hairline. `--header-h` is 76px from the full-bar breakpoint and 64px below it, so every sticky offset and the scroll padding follow it. `--header-bg` and `--header-backdrop` stay only for the frosted bars that still use them (Tour Detail's booking bar, the Tours filter bars, the planner's bars).
- **No section slides under the header.** Every hero starts at the header's bottom edge, so each photo shows in full. The Homepage hero's height is the first screen, clamped to 700–980px as before, less the header (and, on the Homepage, the altitude strip), so it still ends at the fold. The other heroes keep their heights, measured from below the header.
- **The full bar shows from 1200px.** Below 1200px the header shows the brand, a 48px WhatsApp square and a bordered "Menu" button, which opens the existing mobile menu. This replaces ADR-0027's 960px. Every 820px switch (sheets, Tours' columns, the season calendar) is unchanged. The main nav's items and active rule (ADR-0026, ADR-0027) are unchanged.
- **The altitude strip is on the Homepage only.** It sits directly under the header, in the page flow, not sticky: it scrolls away and the header stays. It has one place per destination, from destination content, each linking to its destination page. Its motion follows ADR-0016:
  - a native CSS animation, slow (`--ticker-speed`, about 40px a second), with no library;
  - the list is drawn twice for a seamless loop, and the copy is `aria-hidden` and `inert`, so each place is read and tabbed once;
  - it pauses on hover and while focus is inside;
  - a place with keyboard focus stops the strip and is brought fully into view;
  - a pause button (`aria-pressed`) sits at its end, with a hit area of at least `--tap`;
  - with `prefers-reduced-motion: reduce`, or without JavaScript, there's no animation and no button, and the strip stands still and scrolls sideways.

## Alternatives considered
- **Keep the frosted bar over the heroes:** the owner chose 2f, and asked that the nav not cover the photos.
- **Keep 960px and shrink the bar to fit:** the links would need about 12px gaps or a smaller type than 2f's 18px/700, which is no longer 2f.
- **Collapse at 1280px or 1366px:** more room than the bar needs. Common 1280px laptop windows would lose the full nav for nothing.
- **A sticky strip under the header:** it takes 44px of every screen on every scroll. The owner chose to keep the bar and let the strip scroll away.
- **The strip on every page:** the owner wants it on the Homepage only. Other pages keep the bar alone.

## Consequences
- Every hero photo is seen in full. Pages start 64–76px lower than before, under the bar.
- Screens from 820 to 1199px wide (tablets, small laptop windows) get the Menu instead of the full nav.
- The bar has about 46px to spare at 1200px with "[BRAND NAME]". A longer real brand name, a logo or a seventh item needs the fit measured again.
- The strip's altitudes are each destination's own `altitude`, so they stay sample figures, listed by `launch:check`, until the owner confirms them.
