# ADR-0027: Home joins the main nav

- **Status:** Accepted; superseded in part by ADR-0030 (the 960px breakpoint)
- **Date:** 2026-10-04
- **Supersedes:** ADR-0026 in part (the item list, and the rule that the Homepage marks no item)
- **Related issue:** none (the owner's review of the built site)

## Context
ADR-0026 made the main nav list five pages: Tours, Destinations, Private trips, About and Contact. The Homepage was reachable only from the brand name, and no nav item was marked there. Reviewing the built site, the owner asked for a "Home" item. ADR-0026 also says a new main-nav page needs its own decision, because the header was sized for five items next to the brand and "WhatsApp us" from 820px.

Measured on the built site with "[BRAND NAME]": brand, six items and "WhatsApp us" need about 880px with the nav's 24px minimum gap (about 856px once the logo triangle went), and overflow the header at 820px by about 60px. Closing the gap enough to fit at 820px would take it to about 12px, which runs the links together.

## Decision
- **The main nav is Home (`/`), Tours, Destinations, Private trips, About and Contact**, in that order. It stays one list (`mainNav`), shared by the header, the mobile menu and the footer's large links.
- **Home is the active item on the Homepage only**, gold with `aria-current="page"`, by the same rule as the others: it marks its own page and nothing under it. The Homepage no longer marks nothing.
- **The header's nav collapses below 960px** (it was 820px). From 820 to 959px the header shows the WhatsApp icon and the menu button, as on phones. `--nav-gap` stays as it was. Every other 820px switch (sheets for dropdowns, Tours' columns, the season calendar) is unchanged.
- Everything else in ADR-0026 stands: pages only, the active item from the URL alone, no scroll-spy, and a further main-nav page needs its own decision.

## Alternatives considered
- **Tighten `--nav-gap` to keep 820px:** about 12px between links at 820px; the six links read as one run of words.
- **Collapse at 900px:** fits, but with only a few pixels to spare, so the brand, the nav and the button run together, and a longer real brand name would overflow.
- **Collapse at 1024px or 1100px:** more room than six items need; tablets in landscape at 960–1023px would lose the full nav for nothing.
- **Leave Home out and rely on the brand name:** what ADR-0026 did; the owner asked for the item.

## Consequences
- Every page, the Homepage included, shows where you are in the nav.
- Screens from 820 to 959px wide (tablets held upright, small laptop windows) get the menu instead of the full nav.
- The header has about 75px to spare at 960px, with the brand as text (the logo triangle went in the same round of feedback); a seventh item, or a brand name much longer than "[BRAND NAME]", needs the fit measured again.
