# ADR-0029: The office map is a Google Maps embed

- **Status:** Accepted
- **Date:** 2026-10-05
- **Related issue:** #128 (PRD #124)
- **Narrows:** CLAUDE.md §8's "no third-party basemap", for the office's location only

## Context
"Plan your trip over chai at our Lahore office" shows on About and Contact. It had a placeholder for the owner's photo of the office front, and the address was a `[placeholder]`. The owner has now supplied the office's Google Maps listing, which gives the address and phone number, and asked to see where the office is on a map, with directions.

Two rules stood in the way:
- CLAUDE.md §8 says the route, itinerary and places maps are schematic, with no third-party basemap. Those maps draw the trips, need Survey of Pakistan vetting and must not show borders. An office's street location is a different job: a schematic drawing can't show a street in DHA Phase 8.
- The site makes no request to another host (ADR-0020's Privacy Policy says so). A map that shows itself on the page would be the first.

## Decision
- **"Visit the office" shows a Google Maps embed** of the office in the photo's place, on About and Contact: an `<iframe>` of `https://www.google.com/maps?q=<query>&output=embed`. It needs no API key, account or script of ours.
- **The map finds the office by `contact.officeMapQuery`**, the address as Google knows it: "Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000". Google doesn't know the plot ("16-R") or the floor; with them in the query it shows a scatter of search results across Lahore and no place, without them it outlines Block R. The full address stays in `contact.officeAddress`, shown on the page as written.
  - It loads lazily (`loading="lazy"`), so it waits until the visitor scrolls near it and never competes with a page's LCP. It has a `title` naming it for screen readers ("Map of our office in DHA Phase 8, Lahore", from settings). It keeps the photo's 4:3 frame and 8px radius, so nothing moves when it loads.
  - The page loaders build it (`officeMap` in `lib/utils/contact.ts`) and pass it to the section, so stories can pass a stand-in page instead. The map, its link and "Get directions" come from one helper (`officeOnMaps`), which gives none of them while the address or the query has a placeholder.
  - A link under it opens the full map in Google Maps.
  - It shows only once the address and the query are real: with a `[placeholder]` in either there is no map, as there is no "Get directions" (ADR-0010).
- **"Get directions" opens Google Maps directions** to the same query (`https://www.google.com/maps/dir/?api=1&destination=<query>`), not the owner's share link, which opens Google Search.
- **The schematic maps rule stands:** the route, itinerary and places maps keep no basemap. This embed is the one exception, for the office's location only. CLAUDE.md §8 says so.
- **The Privacy Policy says it** (ADR-0020): About and Contact load a Google map, which may set Google cookies and receives the visitor's IP address, and it names Google's privacy policy with its address (legal paragraphs are plain text, so it isn't a link). The text stays `sample: true`.
- **The frame keeps the browser's default referrer policy**, so Google is told which site the map is on, not the page's full address.

## Alternatives considered
- **A static map image** (a screenshot or the Static Maps API): a screenshot of Google's map can't be redistributed, and the Static Maps API needs an API key and billing account.
- **The owner's listing itself** (its name in the query, or its place id): would pin the exact building, but the listing's name would then show on the map card while the brand name is still a placeholder, and a keyless embed can't take a place id. Revisit once the brand name is real.
- **A schematic drawing of the neighbourhood:** can't show the street well enough to find the door, and would need its own vetting.
- **OpenStreetMap's embed:** no key either, but the owner's listing and the directions are on Google Maps, which most visitors in Pakistan already use; one provider keeps the Privacy Policy simpler.
- **A click-to-load map** (a button that loads the iframe): avoids the request until asked, but adds a step and a client component for a map the owner wants seen. The lazy load already keeps it off pages' first paint; revisit if a cookie banner or consent rule ever arrives (CLAUDE.md §11).
- **Keeping the photo placeholder:** the owner hasn't supplied an office photo, and asked for the map.

## Consequences
- Visitors see where the office is and get directions in one tap; the address is real everywhere it shows.
- About and Contact now contact Google when the map scrolls into view: Google may set cookies and sees the visitor's IP address. The Privacy Policy says so.
- The map's look and availability are Google's; if the embed URL stops working, the frame shows Google's error, and the address, directions and link still work.
- Stories and tests use a stand-in for the iframe, so they never call Google; the built site and `pnpm audit:site` load the real one.
- Revisit if the owner supplies a photo of the office, if a cookie banner is added, or if Google changes or charges for the keyless embed.
