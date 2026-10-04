# ADR-0024: One FAQ file for Help and the tour pages, each answer an anchor

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #86, #88

## Context
Tour Detail (#55) shows a tour's own questions, then shared booking questions from `content/faqs.json`, which had one category and no ids. Help (PRD #86) shows every question in six categories, links to a single answer (`/help#refunds`), and is searched in the browser. The two pages must never give two different answers to the same question.

## Decision
- **One file:** `content/faqs.json` holds Help's six categories, each with an `id` (its heading's anchor, `#cat-{id}`) and a title.
- **Every question has an `id`:** a slug, unique across the file, that is its anchor on Help. The schema rejects duplicates and ids that clash with the page's other anchors (`main`, `policies`, anything starting `cat-`).
- **Tour pages' subset by flag:** a question marked `tourPages: true` also shows on every tour page, after the tour's own questions, in file order. The three booking questions #55 showed carry it, so tour pages are unchanged.
- **`sample: true`** (ADR-0019) on answers with an invented claim about the company.
- Answers quote settings only through `{tokens}`.

## Alternatives considered
- **A separate file for the tour pages' questions:** two copies of the same answer, which drift.
- **Tour pages showing a category** (as before): the booking questions now sit in Help's categories (payments, cancellations, families), so no single category holds them.
- **Ids derived from the question text:** an edit to the wording would break every link already shared.

## Consequences
- Changing an answer changes it on Help and every tour page.
- An answer's id is a public link once shared: renaming it breaks links on WhatsApp.
- Revisit if tours need different shared questions from one another.
