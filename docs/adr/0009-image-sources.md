# ADR-0009: Image sources: free-licence photos for places, owner-supplied photos for people

- **Status:** Accepted
- **Date:** 2026-10-03

## Context
Every image in the design is a placeholder naming the exact shot. The site needs real photography of real places before it looks finished, and the owner does not have a full photo library yet. Photos of people (guides, drivers, team, customers) must be genuine, or they misrepresent the company.

## Decision
- **Places:** location photos may come from Unsplash or Wikimedia Commons, matching the shot named in the design placeholder as closely as possible.
- **People:** no stock photos of people anywhere on the site. All photos of guides, drivers, the team and travellers are supplied by the owner. Until then, the design's striped placeholder stays.
- **Credits:** every image in `/content` records `source`, `author`, `licence` and `sourceUrl`. Wikimedia Commons images with an attribution licence (e.g. CC BY, CC BY-SA) show a credit on the site. Owner-supplied photos record `source: "owner"`.
- **AI-generated media:** none of real places or people. Allowed only for abstract atmosphere, marked as AI-generated in the content files. No AI image tool is in use for now.
- Images are downloaded into the repository and served locally (with width and height set), not hot-linked.

## Alternatives considered
- AI-generated images of destinations: rejected; misleading for a travel company, and ruled out by the design system.
- Stock photos of people as "our guides": rejected; misrepresents the team.
- Hot-linking from Unsplash or Wikimedia: rejected; slower, outside our control, and breaks static performance targets.

## Consequences
- The site can show real places early without waiting for a photo shoot.
- The image schema gains credit fields, and pages need a place to show credits (caption or a credits list).
- Each Wikimedia image needs its licence checked before use.
- Pages with people stay on placeholders until the owner supplies photos.
