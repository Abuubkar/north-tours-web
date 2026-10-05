# ADR-0033: Portrait crops of hero photos for phones

- **Status:** Accepted
- **Date:** 2026-10-05
- **Related issue:** #142
- **Extends:** ADR-0015 (build-time image variants)

## Context
The full-bleed heroes use landscape photos (about 3:2) with `sizes="100vw"`. On an upright phone a hero's box is about 2:3: 390×600 for a tour, 390×620 for a destination, 454×768 for the Homepage (its photo bleeds 32px past the sides and foot). The photo is cropped to the box's height and drawn about three times wider than the screen. At DPR 1.75 the phone picks the 800 file and shows its middle third: 271 file pixels across 390 CSS px on the Homepage, 346 on a tour. It looks soft.

Asking for wider files (#140) made 9 pages miss the 2.5s LCP budget (ADR-0021): the phone downloads the whole wide photo to show a third of it. The Homepage has almost no headroom: 2.48s on the live preview (ADR-0032).

## Decision
- **Every full-bleed hero photo gets a 2:3 portrait crop** around its `focus`: the Homepage hero, the tour and destination photos, and About's cover. `contentPhotos` marks them (`portrait`) from where content sets them, so a new tour or destination gets one without a list to update. The planner's band is left out: on a phone it's about square (390×360), where a 2:3 crop would zoom in to about 40% of what it shows now, and it already carries 1.45 file pixels per CSS px.
- **2:3** sits between the heroes' phone boxes (0.59 for the Homepage to about 0.69 for a tour at 412px), so each shows 89–98% of the crop.
- **The crop is the largest 2:3 box in the photo**, placed like `object-fit: cover` at the focus (`coverCrop`), so the focus sits at the same percentage across the crop as across the photo and one `object-position` frames both.
- **Widths 800 and 1200, each capped at the crop's own width; never enlarged.** The 2560px Homepage and About photos give 800 and 1138; the 1200×800 tour and destination photos give one file at the crop's full width (445–533). Files are named `-portrait-800.avif`; `content:check` fails when one is missing, as for the other variants.
- **`MediaFrame`'s `portrait` option** puts AVIF, WebP and JPEG sources of the crop first, for `(max-width: 479px) and (orientation: portrait)`, with `sizes="100vw"`. Wider or landscape screens skip them and get the landscape photo as before. Under 480px a tour box is at most 479×600 (0.8), so the crop still shows most of what the landscape photo would.
- **The density rule, a deliberate trade of quality for bytes:**
  - Phones up to 800 device pixels wide pick the 800: a 390px screen up to DPR 2, and Lighthouse's 412px at DPR 1.75. Sharper screens (DPR 2.6, 3) pick the 1200 (1138 on the Homepage).
  - The portrait AVIF is encoded at quality 34, below the landscape files' 50. That keeps the Homepage's phone file no heavier than the landscape file it replaces (49 KB against 55 KB) while it carries 2.25 times the detail (609 file pixels across 390 CSS px, up from 271). At quality 50 the same file was 122 KB, and a file that size (the landscape 1200, 127 KB) put the Homepage's LCP at 2.64s in #140. Side by side at DPR 1.75, quality 34 at 800 is visibly sharper than quality 50 at 800 landscape, with mild smoothing in fine foliage.
  - WebP and JPEG keep ADR-0015's qualities. Only browsers without AVIF load them, and they're rare on today's phones.

## Alternatives considered
- **3:5:** fits the Homepage's box (0.59) better but tours (0.65–0.69) worse, and its files are 10% bigger for the same width.
- **A `sizes` that asks for the width the landscape photo is drawn at** (#140, reverted): the phone downloads a 1200–2400 file to show a third of it; 9 pages missed the budget.
- **The portrait crop at ADR-0015's quality:** the Homepage's file would more than double (122 KB), with no LCP headroom.
- **Widths from the standard list only (480, 800, 1200):** the tour photos' crops (445–533 wide) would get a 480 file or none at all; the crop's own width gives them every pixel the source has.
- **A portrait crop for the planner's band:** see above; it would change the band's framing on phones for little gain.

## Consequences
- On the Homepage at DPR 1.75 the phone's hero file goes from 55 KB to 49 KB and its detail per CSS px from 0.69 to 1.56. LCP measures no worse (2.26s before, 2.25s after, local) and the slowest tour improves (2.48s to 2.25s).
- Tour and destination heroes reach their sources' limit: about 1.33 file pixels per CSS px (1.5 times today) for a 1200×800 photo. Going further needs bigger source photos.
- `pnpm images` writes 3 to 6 more files per hero photo; the repository grows by about 3.3 MB.
- A hero photo's focus now also moves its portrait crop, so changing a focus regenerates the crop.
- Revisit if the heroes' phone heights change, if an image service arrives with the real host (ADR-0007, ADR-0032), or if AVIF at quality 34 shows artefacts the owner doesn't accept.
