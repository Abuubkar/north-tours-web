# Launch checklist

What must be true before the site goes live. Hosting itself is out of scope (ADR-0007, CLAUDE.md §11): the owner sets it up by hand once this list is clear.

**Before launch:**
1. `pnpm launch:check` passes ("Nothing left to replace."), which needs the owner's sign-offs in section 4.
2. `pnpm audit:site` passes on every page.
3. The manual pass (section 3) is walked with a real screen reader, and walked again after a change to a shared component, a page's layout or an interactive flow.

## 1. Everything real: `pnpm launch:check`

```sh
pnpm launch:check
```

It validates content first (as `pnpm content:check`), then reads every JSON file under `content/` and lists what must be real before launch, grouped by kind, with the file and field of each item (`content/settings.json › contact.officeAddress`). It fails (exit code 1) while anything is left, and prints "Nothing left to replace." once nothing is. It isn't part of the build, `pnpm test` or the pre-commit hook, so builds and merges keep working until launch.

| Kind | Where it lives | How to clear it |
|---|---|---|
| **Brand name** | `content/settings.json › brand.name` | Write the real name. Page titles and the footer use it. |
| **Site URL** | `content/settings.json › site.url` | Write the live address, e.g. `https://example.pk`. Until then canonical URLs, `og:url`, share images, the sitemap and JSON-LD are root-relative, and robots.txt has no `Sitemap:` line; once it's real they're absolute and robots.txt names the sitemap. |
| **Placeholders** | Any text with a `[bracketed]` part, whole or partial ("[Office address], Lahore, Punjab"): contact details, office hours, the pickup point, the DTS licence, the company registration, social links, memberships | Replace the bracketed part with the real value. A value with no real counterpart (say, no YouTube channel) still has to be supplied for now; making it optional is a content-model change. |
| **Sample content** | Every object with `"sample": true`: invented claims about the company (ADR-0019), sample legal and policy text (ADR-0020), and each sample tour, tour rating, destination, guide, review and the `booking`, `trust` and `policies` settings figures (ADR-0022) | Make the item real, or have it reviewed (the lawyer for the Privacy Policy, the Terms and the Help policies), then remove the `sample` field. Delete a sample tour, guide or review the company doesn't have. |
| **Placeholder photos** | Every image still `{ "placeholder", "alt" }`: guide portraits, the founder, any place without a photo yet (the office shows a map instead, ADR-0029) | Add the photo (ADR-0009): people are the owner's own photos only, never stock. Run `pnpm images` and commit both folders. |
| **Map vetting** | `content/settings.json › maps.surveyOfPakistanVetted` | Set it to `true` once the Survey of Pakistan has vetted the route map, the itinerary maps and the places maps (CLAUDE.md §8). Nothing on the site reads it. |

Not checked: the Homepage hero video (#38) is a nice-to-have, not a launch blocker.

Reviews and guides added with `/add-review` and `/add-guide` are real and never get `sample`.

## 2. The quality bar on the built site: `pnpm audit:site`

```sh
pnpm audit:site
```

It builds the site, serves the static export on a free localhost port (as a static host would: HTTP/2 over TLS with a throwaway certificate made by the system's `openssl`, `/path` serves `path.html`, an unknown path the 404 page with status 404, text gzipped) and checks every built page: each route, all eight tours, all six destinations and the 404. It prints one Markdown table (page, LCP, CLS, TBT, axe violations, page checks, result) for the PR, then each failure and warning in detail, and exits 1 on any failure. A full run takes about 7 minutes. It isn't part of `pnpm test`, the pre-commit hook or the build (ADR-0021).

- **Lighthouse**, with its default mobile settings (a mid-range phone screen, simulated slow 4G, 4x CPU slowdown): fails on LCP over 2.5 s or CLS over 0.1. A page over a limit is run twice more and judged on the median of three, so one noisy run doesn't fail it.
- **Axe** (axe-core's default rules) at 390 and 1440, with reduced motion so everything is in its final state: any violation fails, listed with page, width, rule and element.
- **Page checks:** exactly one `<h1>` at each width; a `<title>` no other page shares; a meta description; `og:image` and `twitter:image` pointing to a file in the build; a canonical URL to the page itself (not on the 404).
- **Sitemap:** `sitemap.xml` lists exactly the built pages, minus the 404.

**Its limits:**
- **INP needs real taps,** and Lighthouse only loads pages. The audit reports TBT (Total Blocking Time) as the lab stand-in and warns above 200 ms without failing. INP is checked by hand on the interactive flows.
- Lab numbers are estimates for a mid-range phone on slow mobile data, not what real visitors measure. They depend on how the site is served: Lighthouse reads LCP up to a second slower from a plain HTTP/1.1 server than from HTTP/2, which every host uses, so the audit serves HTTP/2 (ADR-0025).
- Fix a failure where it starts (the component, section, content or image), never by switching off an axe rule, raising a limit or skipping a page.

## 3. The manual pass

What the audit can't check: walk it at 390 and 1440 on the built site (`pnpm build`, then any static server with compression on, e.g. `npx serve out`), first with the keyboard alone, then with a screen reader.

**Keyboard only**
- The skip link is the first Tab stop and moves focus into the page.
- Focus is always visible and follows the visual order. Enter and Space work every control.
- Escape closes every sheet, drawer, dropdown and dialog and returns focus to what opened it. Nothing traps focus.
- Anchors land below the sticky header.
- **Flows:**
  - the header, and the mobile menu below 820px;
  - Tours: the filter dropdowns and sort from 820px, the filter and sort sheets below it, the results count;
  - a tour page: choosing a date, the booking panel from 1100px, the sticky bar and the booking sheet below it, the itinerary, the FAQs;
  - the planner, from the first step to "Send on WhatsApp" with the trip in the message;
  - Help: search (Escape clears it), and an answer link (`/help#refunds` opens it);
  - the legal pages' contents (the disclosure below 820px closes when a link is followed);
  - Contact's "On a trip right now?" banner below 820px;
  - About: a guide's profile, Previous and Next, Escape back to the card;
  - the 404.

**Touch:** every tap target is at least 44px.

**Screen reader** (VoiceOver with Safari on macOS or iOS; TalkBack with Chrome on Android)
- One `<h1>`, and headings in order with no skipped level.
- Landmarks named: the banner, main, the footer and each navigation.
- Links and buttons named. Images have alt text; photo placeholders are named by their shot.
- Live regions read once: Help's answer count, Tours' results count, the booking total, the travellers count, the guide profile's "2 of 6", the planner's errors.
- Dialogs are announced with their names.
- Prices and dates read sensibly ("PKR 145,000 per person", "2–7 Jun"). Decorative parts stay silent ("NORTH" on the Homepage, the arrows on link rows, the mini maps).

**Reduced motion and no JavaScript**
- With reduced motion on, nothing moves and nothing waits to appear.
- With JavaScript off, every page's content shows and its links work. (The Homepage's brand statement still reveals word by word as it scrolls into view, in CSS; it ends fully shown.)

**INP** (Interaction to Next Paint, each ≤ 200 ms)
- In Chrome's performance panel with a 4x CPU slowdown, after the page has settled: open the menu, open and toggle a filter, choose a date and open the booking sheet, the planner's steps and typing, typing in Help's search, opening a profile and Next, opening the legal contents and the Contact banner. Record the numbers.

**Structured data**
- Paste the built Homepage, a tour page and `/help` into the Schema.org validator (validator.schema.org). Expect `TravelAgency`, each tour as `TouristTrip` + `Product` with its offers, and `FAQPage`. Once a tour's rating or reviews are real, run a tour page through Google's Rich Results Test too: the rating and reviews sit on the `Product` type, which allows them (#117). Check Google's current rules on review snippets first: Google may not show stars for reviews a business publishes about itself.

## 4. The owner's sign-offs

`launch:check` lists these until they're done:
- **Real values:** the brand name, the site URL, contact details (the office's address and phone are real since 2026-10-05), office hours, the pickup point, the DTS licence, the company registration, social links and memberships.
- **Legal review:** the Privacy Policy, the Terms and the Help policies are sample text (ADR-0020) until a lawyer has reviewed them.
- **Photos of people:** guides, drivers and the founder are the owner's own photos only (ADR-0009); the office shows a map instead (ADR-0029).
- **The fleet:** stock photos of each vehicle type stand in for it (ADR-0019). Each vehicle is listed as sample content until the owner's photo and details replace it.
- **Survey of Pakistan vetting:** the route map, the itinerary maps and the places maps, then set `maps.surveyOfPakistanVetted` to `true`.

Not listed by `launch:check`:
- **Hosting** is out of scope here (ADR-0007, CLAUDE.md §11): the owner sets it up by hand once this list is clear.
