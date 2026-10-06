# Edit mode

Change the site's wording by clicking it, on your own machine (ADR-0034).

```sh
pnpm content:edit
```

Open <http://localhost:3000>. Click **Edit text** at the bottom left, or press **Alt + E**.

- **Point at text:** an outline shows what you can edit, and the bar at the bottom left names its source, e.g. `home.hero.lead` (page copy in `content/pages/home.json`, key `hero.lead`) or `tour:hunza-express.title` (`content/tours/hunza-express.json`).
- **Click to edit.** **Enter** saves, **Escape** cancels, and clicking away saves. The page reloads where you were.
- **Template text** (e.g. "Hold your seats with a {advancePercent}% advance…") and **text used in several places** open a small panel instead. Keep the `{tokens}`: the site fills them in. **Ctrl/⌘ + Enter** or **Save** saves.
- **A bad edit is refused** with the reason, e.g. an empty required field, and the file is left as it was.
- **Switch editing off** to use links and buttons normally.

Every save changes exactly one value in one JSON file. Review it with `git diff` and commit as usual. It's the same as editing the JSON by hand, only quicker, and already checked by `pnpm content:check`.

**Not covered:** photos and alt text, numbers, dates and prices, and adding or removing list items. Edit those in the JSON files or with the content commands (`/add-departure` and the others).

Edit mode runs only under `pnpm content:edit`. No build, the GitHub Pages preview or the live site has any of it.
