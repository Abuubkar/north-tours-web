# ADR-0028: Note every change to a credited photo

- **Status:** Accepted
- **Date:** 2026-10-05
- **Extends:** ADR-0009 (the credit fields and where credits show)
- **Related issue:** none (a licence-compliance fix)

## Context
ADR-0009 lets place and vehicle photos come from Wikimedia Commons and Unsplash, and records each one's `source`, `author`, `licence` and `sourceUrl`. Almost all of ours are CC BY-SA, which requires indicating that a photo was modified (CC BY-SA 4.0 §3(a)(1)(B); 3.0 asks the same of an adaptation).

Several photos were edited before they went into content: cropped to drop tiny distant figures, litter or a signature, and in the jeep's case cropped, its number plate pixelated and half its windscreen softened. The credit had no field for this. `/credits` only said, for all photos at once, that "some" were cropped, which names neither the photo nor any edit beyond cropping.

## Decision
- **A credit from Unsplash or Wikimedia Commons gains an optional `changes`:** plain text listing every edit made to the photo, e.g. "Cropped; number plate pixelated, windscreen softened". It must not be empty when present; it's left out when the photo is unchanged. Owner photos never have it.
- **What counts as a change:** anything that alters what the photo shows: cropping, removing or covering something (a signature, a figure, a plate), blurring, softening or retouching part of it. Resizing and format conversion by `pnpm images` (ADR-0015), and the CSS crops `MediaFrame` makes at a photo's `focus`, are not changes.
- **The note says what changed, not why:** "Cropped", not "Cropped to drop a figure". The one exception is the photographer's own mark: a crop or edit that removes a signature or watermark names it ("Cropped; signature removed"), because the credit is the author's attribution.
- **`/credits` shows it after the licence:** "Sadiqrizwan · CC BY-SA 4.0 · Cropped; number plate pixelated, windscreen softened · Wikimedia Commons".
- **Whoever edits a photo writes its note in the same PR.** To check existing photos, compare the source file's aspect ratio with the original's on Commons (a different ratio means it was cropped) and read the PR notes for anything beyond cropping.

## Alternatives considered
- **One sentence in the credits intro ("we've cropped some of them"):** what the page did before. It doesn't say which photo, and says nothing about edits other than cropping.
- **A `modified: true` flag:** says a photo changed but not how, and the licence asks for the modification to be indicated. Plain text is no harder to write.
- **A fixed list of edit kinds (cropped, blurred…):** edits vary (a plate pixelated, half a windscreen softened), and the list would keep growing; the note is read by people, not code.
- **The note in each photo's caption:** pages show no captions, and attribution already lives on `/credits` (ADR-0009).

## Consequences
- Each credit says how the photo differs from its original, as CC BY-SA requires, and the owner can see which photos were edited.
- The schema can only check that a note isn't empty, not that it's complete: an edit made without a note isn't caught. The aspect-ratio check finds crops, but not edits that keep the ratio, such as the Coaster's crop or a pixelated plate.
- A photo used in several places carries its credit, and so its note, on every use. `/credits` shows the first one it meets, so the copies have to match; nothing checks that yet.
- Revisit if a check comparing each source file with its Commons original becomes worth automating, or if photos start coming from a source with different attribution rules.
