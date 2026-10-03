---
description: Add a guide, driver or tour host (only with their consent)
argument-hint: <name>, <role>, <base>, <languages>, [years], "<short bio>", consent confirmed
---

Add a guide: $ARGUMENTS

This is a content-only task (CLAUDE.md §7). Create one file in `content/guides/` and change nothing else. If the request seems to need anything else, stop and ask.

1. **Consent first.** People are shown only when they agreed to be on the site (CLAUDE.md §7). If the request doesn't clearly say they agreed, ask "Has <name> agreed to be shown on the site?", and don't write anything until the owner confirms. Never set `consent` to `true` on an assumption.
2. **Role** must be one of: Lead guide, Guide, Trek lead, Driver, Tour host. If it's something else, ask. A new role is a code change, so stop.
3. **Collect the fields:**
   - `name`
   - `base`: where they're from or work, e.g. "Hunza" or "Skardu & Deosai"
   - `languages`: a list
   - `years`: optional
   - `bio`: one or two plain sentences, in the owner's words

   If any required field is missing, ask.
4. **Portrait:** always a placeholder for now: `{ "placeholder": "<role in lower case> in <base>", "alt": "<name>, <role in lower case>" }`, e.g. `"guide in Swat"`. Photos of people come only from the owner (ADR-0009) and are added once the image pipeline exists; if the owner offers a photo, say so and keep the placeholder. Never use a stock photo.
5. **Slug and file name:** from the name in lower case with hyphens, e.g. `karim-baig`, saved as `content/guides/<slug>.json`. If the file already exists, ask rather than overwrite it.
6. **Write the file** in the same shape as the existing guides, with `"consent": true`.
7. **Check:** run `pnpm content:check`. If it fails, delete the new file and report the problem.
8. **Show the change:** run `git status --short content/` and show the new file's contents (`cat <file>`); `git diff` doesn't show new files. Then summarise it in one line.
9. Don't commit or push unless asked. The change goes live after the next build (ADR-0003).
