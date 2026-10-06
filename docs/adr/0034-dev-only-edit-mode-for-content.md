# ADR-0034: A dev-only edit mode for content

- **Status:** Accepted
- **Date:** 2026-10-06
- **Related issue:** #145 (PRD)

## Context
Almost all of the site's wording lives in `content/*.json`, read through the loaders in `lib/content` and checked by Zod schemas (ADR-0003, ADR-0013). To change a sentence, the owner has to find the right file and key and edit the JSON by hand.

The owner asked for in-place editing on the local site. The usual tools didn't fit:
- Visual editors that write to source (react-rewrite, Onlook) edit JSX and Tailwind, but our wording is in JSON and our styles are CSS Modules.
- TinaCMS and Keystatic need a second copy of every schema, and Tina also needs pages rebuilt around its hook.
- Hosted CMSs are out of scope (CLAUDE.md §11).

## Decision
- **`pnpm content:edit`** runs `next dev` with `EDIT_MODE=1` and a small edit server on 127.0.0.1. Only then does the root layout load the overlay script from that server. No build, preview or production page has the script, the server's address or any edit attribute.
- **Content ids** name every string in content:
  - page copy: the page file's name first: `home.hero.lead` → `content/pages/home.json`, `hero.lead`;
  - collection items: a colon: `tour:hunza-express.title`, `destination:hunza.lead`, `guide:…`, `review:…`;
  - the other files: reserved names: `settings.…`, `faqs.…`, `route-map.…`. `content:check` refuses a page file with a reserved name;
  - list items: numbers: `home.steps.items.2.title`.
- **Finding the content behind an element:** the overlay matches an element's text against every content string. No component is wired for it. Text built from a `{token}` template matches the template, each token standing for at most 40 characters, so a template ending in "trips" can't claim a whole card. An optional `data-content="<id>"` attribute settles a case matching can't. The overlay never marks the page's own elements (that would break React's hydration), and draws its outline as a box over them.
- **Editing:**
  - plain text with one source is edited in place; Enter saves, Escape cancels. Leaving the text keeps the edit open, so a stray click never saves half a sentence;
  - a template, or text with several sources, opens a panel that shows the source and the id.
- **Saving:**
  - the server changes only that string's characters in the file, and only if it still reads what the page showed;
  - it then runs `checkContent()`, and puts the file back if the edit made content invalid.
- **Loading in development:** loaders read a content file again each time it's loaded (`FRESH_READS`), so a saved edit shows on reload. Built pages still read each file once.
- **Next.js's agent file:** `next.config.ts` sets `agentRules: false`. Edit mode runs `next dev`, which otherwise adds its own block to CLAUDE.md whenever the block is missing.
- **Modal dialogs:** while the mobile menu or a sheet is open, the overlay's switch and panel move into it, since the rest of the page is inert.

## Alternatives considered
- **A `<Copy>` component that marks every string with its id:** exact, but it means rewriting every section's markup for a dev tool. Matching by text needs no component changes, and `data-content` covers the rare clash.
- **TinaCMS:** a polished editor and a path to editing the live site, but it needs a second set of schemas, pages rebuilt around its hook, and its own dev and build commands.
- **Keystatic or Decap:** form-based. No in-place editing, and the schemas are duplicated.
- **A Next.js route handler for saving:** the static export (ADR-0002) can't have one, so a separate local server keeps the build untouched.

## Consequences
- The owner edits wording on the page and gets an ordinary git diff of one value per edit, already checked.
- Images, alt text, numbers, dates, prices and adding or removing list items still need the JSON files (or the content commands).
- Text that isn't shown exactly as stored can't be matched and isn't editable: formatted prices and dates, or text with CSS-transformed letters split across elements. `data-content` can mark the rare one that matters.
- The same words in several places show a chooser; the owner picks the source.
