---
description: Add a traveller's review (only with their consent)
argument-hint: <tour>, <name>, <city>, <month travelled>, <rating 1–5>, "<quote>", consent confirmed
---

Add a review: $ARGUMENTS

This is a content-only task (CLAUDE.md §7). Create one file in `content/reviews/` and change nothing else. If the request seems to need anything else, stop and ask.

1. **Consent first.** Reviews are shown only when the traveller agreed to be quoted (CLAUDE.md §7). If the request doesn't clearly say they agreed, ask "Has <name> agreed to be quoted on the site?", and don't write anything until the owner confirms. Never set `consent` to `true` on an assumption.
2. **Find the tour** in `content/tours/` by `title` or `slug`. If no tour matches, or more than one could, ask.
3. **Collect the fields:**
   - `name`: as it should appear, e.g. "Ayesha Malik & family".
   - `place`: their city.
   - `month`: when they travelled, as `YYYY-MM`.
   - `rating`: a whole number from 1 to 5.
   - `quote`: their words exactly. Fix obvious typos only, and say which you fixed.

   If any of these is missing, ask.
4. **Slug and file name:** the first word of the tour's slug (`hunza-skardu-grand` → `hunza`, `swat-kalam-summer` → `swat`), then the month and the first name, e.g. `swat-2026-07-nadia`, saved as `content/reviews/<slug>.json`. If the file already exists, add a number to the slug, e.g. `-2`.
5. **Write the file** in the same shape as the existing reviews, with `"consent": true`.
6. **Check:** run `pnpm content:check`. If it fails, delete the new file and report the problem.
7. **Show the change:** run `git status --short content/` and show the new file's contents (`cat <file>`); `git diff` doesn't show new files. Then summarise it in one line.
8. Don't commit or push unless asked.
