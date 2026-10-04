# Component inventory: north-tours-web design export

Source: `docs/design/*.dc.html` (9 pages, `TourCard`, `BookingPanel`, `Design System`, 7 `* Views` files), checked against `DESIGN.md` and `CLAUDE.md`.
Audit date: 2026-10-04. Read-only audit. Line references are `File:line` in the export.

**Overrides applied throughout (docs win):** the only accent is gold `#D9B44A` / deep gold `#7A5A12`. Radius is 2px for inputs, 6px for buttons, 8px for cards and panels, and 999px for chips and tags only. Payments are **cash and bank transfer only**. "Reserve with [X]% advance" and "Request a call back" open WhatsApp with a pre-filled message. When this file says a design shows something stale, the override still applies.

**Decided in the foundation PRD (2026-10-04), applied over the design files:**

- **Error colour:** an error token that reuses deep gold `#7A5A12` on light and gold `#D9B44A` on dark. No new colour. Errors always pair the colour with the "!" badge and a message.
- **Off-scale sizes:** three type roles are added: the Tour Detail hero H1 `clamp(48px, 7.2cqi, 108px)`, the Destination hero name, and the BookingPanel price (30px). Every other off-scale size in §5 item 33, the compact review card (item 24) and the section-padding variants (item 35) move to the nearest DESIGN.md value.
- **One `<h1>` per page** (CLAUDE.md §10). Type roles are visual only.
- **Precedence fixes** (DESIGN.md / CLAUDE.md win): input, select and textarea borders on light use `--line-strong-light #7D8992` (item 19). No Geist Mono in UI (item 37). No section label on the Contact header (item 32). No 01–04 numbers on About principles (item 36). Every overlay (sheets, drawer, dropdowns, mobile menu) closes on Escape and returns focus (item 41). Payments and Reserve / call back follow ADR-0008 (items 43, 45).

**Decided in the base components PRD (#8, 2026-10-04):**

- **Scope:** Button, IconButton, Icon, Tag, Chip, StarRating (with the inline rating), Stepper, Accordion, Dropdown, Sheet. Input, Select, Textarea, Checkbox/Radio, FormField, MediaFrame, TextLink, SectionLabel, BrandMark, KeyValueRow and the inclusion icons wait for the PRDs that first use them.
- **Selected state:** Ink 800 fill with a `--fg` border on dark, Mist 100 fill with a `--fg` border on light. Gold is never a selection colour (replaces §5 items 6 and 16).
- **Radius:** dropdown panels 8px with square rows inside; selectable option tiles 8px; bottom sheets 8px top corners; side drawer 8px leading corners (§5 items 9–11).
- **Buttons:** primary, secondary, quiet; sizes 44 / 48 / 52 / 56 (DESIGN.md §7). The header "WhatsApp us" is secondary at 44 with the soft border. Join waitlist is always quiet. Disabled: hairline fill, `--fg-3` text (§5 items 1–5, 7, 8).
- **Tags:** all 28px (§5 item 15).
- **Accordion and disclosure:** one Accordion on `<details>`, with a `plus` or `caret` marker.
- **Dropdown:** in the base components folder, on the native `popover` attribute.
- **Stepper:** the value uses the `stepTitle` role; the button at a limit is `aria-disabled` with the disabled look, and stays focusable.
- **Native first:** Accordion on `<details name>`, Sheet on `<dialog>` with `showModal()`, Dropdown on `popover`.
- **Hover:** secondary and quiet buttons use `--bg-raised` (Ink 800 / Mist 100); icon buttons brighten their border to `--fg`.
- **Tooling:** Storybook as the component workshop and test runner (ADR-0012).
- Full measurements for every component (tags, chips, sheet, dropdown, stepper, icons, motion) are in PRD #8.

**Decided in the layout shell PRD (#32, 2026-10-04):**

- **Where it lives:** `SiteHeader`, `MobileMenu` and `SiteFooter` are in `components/layout` (with `SkipLink` and the client `NavLinks`), not `/sections`. `BrandMark`, `SectionLabel` and `KeyValueRow` are base components in `components/ui`.
- **Mobile menu:** the `Sheet` **drawer** variant (from the side), not the design's panel under the header. Close button, backdrop, Escape and focus return come from the Sheet. Every page gets "Plan on WhatsApp", including the Planner (§5 item 39).
- **Other mobile overlays** (booking, filters, sort) use the Sheet's **bottom** variant.
- **Routes:** one route map in `lib/routes.ts`. Nav and footer links point to pages that don't exist yet.
- **Active nav item** comes from the URL (`lib/utils/nav.ts`): Tours on `/tours` and `/tours/*`, Destinations on `/destinations/*`, Guides on `/about`. On the Homepage, scroll-spy instead (PRD #39).
- **WhatsApp links** are built by `lib/utils/whatsapp.ts` from the number and messages in `content/settings.json`. While the number is a placeholder they go to `https://wa.me/?text=…`; placeholder phone, email and social links show as plain text.
- **Skip link** first on every page, to `<main id="main" tabindex="-1">`. In-page anchors land below the sticky header (`scroll-padding-top: var(--header-h)`).

**Decided in the Homepage PRD (#39, 2026-10-04):**

- **The page's `<h1>`** is the brand statement ("Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway"), at the long-H2 size. "NORTH" in the hero is decorative and `aria-hidden`. Section headlines are `<h2>`; card titles and names are `<h3>`.
- **Page copy** lives in `content/pages/<page>.json` (schema, loader, `content:check`): headlines, leads, labels, steps, the `<title>` part and meta description. Copy may use `{tokens}` filled from settings; a field rejects tokens it doesn't allow. Titles are "{page title} | {brand}"; every page has Open Graph and Twitter tags, and its share image is its hero photo cropped to 1200×630 (the Homepage's where a page has none).
- **Images:** source photos in `content/images`; `pnpm images` (sharp, dev only, ADR-0015) writes AVIF, WebP and JPEG at fixed widths plus share crops to `public/images`; `content:check` fails if any are missing. `MediaFrame` (built) picks the file, lazy unless it's the page's main image. Place photos come from Unsplash or Wikimedia Commons (ADR-0009); the first set is from Commons, credited on `/credits`.
- **Motion** is native (ADR-0016): the hero blur and brand statement reveal are CSS scroll-driven animations; cards rise with the `useRiseOnView` hook (only cards below the fold at load, only the photo fades). Story files run one at a time so reduced motion can be set per story (ADR-0023).
- **`TourCard`** (built) shows the tour's next upcoming departure that has seats, or, when all are sold out, the next sold-out date with "Join waitlist". Lists sort by the date each card shows. WhatsApp opens a message naming the tour and date (templates in settings); sold out, the waitlist message. The seats line uses the shared wording ("Sold out · waitlist open").
- **Card links:** destination cards link to `/destinations/{slug}`; Homepage guide cards link to the guide's profile, `/about#guide-{slug}` (replacing "not clickable" in §2 and §5 item 26). Each card is one link, named by the destination or guide.
- **Scroll-spy** (Homepage only): the header nav and the mobile menu mark How it works, Destinations or Reviews, with `aria-current="location"`, once that section's top is above 40% of the viewport; above How booking works nothing is marked. Tours and Guides lead to other pages, so they're never marked there. Other pages keep the path rule (`aria-current="page"`).
- **Layout patterns** from §4 are shared styles in `styles/layout.module.css`: section shell, header row, capped hairline grid, cell, text-grid bleed (which fixes §5 item 28) and image-card cell.
- Built here: `MediaFrame`, `TextLink` (base); `TourCard`, `PriceBlock`, `SeatsStatus`, `StepCell`, `RouteMap`, `RouteStopList`, `ReviewCard`, `DestinationCard`, `GuideCard` (features); the Homepage sections and the `/credits` page.

Open questions are in §6, grouped by the PRD that settles them.

Token names used below: `ink-900 #0C1216`, `ink-800 #121A1F`, `line #253038`, `line-strong #5C6871`, `text #F1EEE8`, `text-2 #B7BFC5`, `text-3 #8F9AA2`, `gold #D9B44A`, `gold-hover #E3C366`, `gold-pressed #C9A43C`, `on-gold #10161A`, `mist-50 #EEF1F3`, `mist-100 #E2E7EB`, `line-light #CBD2D8`, `line-strong-light #7D8992`, `ink-text #10161A`, `ink-text-2 #46525C`, `ink-text-3 #5B6770`, `gold-deep #7A5A12`.

Breakpoints that recur in page scripts: **mobile < 820px** (header collapses, sheets replace dropdowns). **compact < 1100px** (Tour Detail and Planner drop their side column and use bars and sheets instead). **≥ 1280px** (Tour Detail shows the side map). Tour Detail also switches the booking panel to its compact form when **viewport height < 920px**.

---

## 1. Base components (`components/ui`)

### 1.1 Summary table

| # | Name | Pages (count) | Client? | Why `ui` |
|---|---|---|---|---|
| 1 | `Button` | all 9 + TourCard + BookingPanel | static (link/button); `onClick` only where the parent is client | primitive, everywhere |
| 2 | `IconButton` | all 9 (header) + TD, Tours, About, Planner, Help | static, or client when it toggles | primitive |
| 3 | `TextLink` (underlined link / link-with-arrow / back link / text button) | Home, TD, Dest, Tours, Planner, About, Help, Legal, Contact | static (text-button form is client) | used on 2+ pages |
| 4 | `Tag` (small status/category pill) | TourCard (Home, TD, Tours, Dest, DS), Destination | static | primitive (999px tag) |
| 5 | `Chip` (toggle / filter / removable / dropdown-trigger pill) | Tours, Planner, Help (link chips) | client | primitive (999px chip) |
| 6 | `Input` (text, tel with prefix, date, search) | Planner, Help | client | primitive |
| 7 | `Select` | BookingPanel (TD), Planner | client | primitive |
| 8 | `Textarea` | Planner | client | primitive |
| 9 | `Checkbox` / `Radio` indicator | Tours (dropdown, sort sheet), Planner (dest cards), BookingPanel (date radio-ring) | client | primitive |
| 10 | `Stepper` (− value +) | BookingPanel (TD), Planner | client | primitive, 2 places |
| 11 | `Accordion` (FAQ item) | TD, Help | client | 2 pages |
| 12 | `Disclosure` (caret toggle) | Help (policies), Legal (mobile contents), Planner (summary bar) | client | 3 pages |
| 13 | `Dropdown` (popover panel of options) | Tours only | client | primitive per CLAUDE.md §6 list, **only on 1 page** (see note) |
| 14 | `Sheet` (bottom sheet / side drawer + backdrop) | TD, Tours (×2), About | client | 3 pages |
| 15 | `StarRating` (5 stars) + `RatingInline` (★ score (count)) | Home, TD, Tours, Dest, About, TourCard, BookingPanel | static | 2+ pages |
| 16 | `MediaFrame` (8px photo frame / striped placeholder + caption) | all pages except Legal | static | 2+ pages |
| 17 | `SectionLabel` (triangle mark + 13px label) | footer (all), About, Contact | static | 2+ pages |
| 18 | `BrandMark` (logo triangle + name) | header (all) | static | shared |
| 19 | `KeyValueRow` / `ListRows` | footer (all), About, Contact, TD, Dest, Planner, About profile | static | 2+ pages |
| 20 | `FormField` (label + hint + error alert) | Planner only (+ Help's search label) | static wrapper | form primitive (see note) |
| 21 | `Icon` set (WhatsApp light/dark, star, clock, inclusion icons, caret, arrows) | all | static | primitive |

**Confirmed absent (do not build):** Tabs and segmented controls (the planner's "Exact dates / Flexible" switch is a pair of `Chip`s in `role="group"`), Tooltip, Toast, Modal-centre dialog, Pagination, Breadcrumbs, Loading/skeleton states, Avatar, Carousel, Star-rating *input*.

### 1.2 Details

#### 1 `Button` — `components/ui/Button`
- **Variants as designed**
  - **primary**: gold fill, `on-gold` text, 16/500, padding `0 28px`, 6px radius. Optional trailing `→` (gap 10) and optional leading WhatsApp icon (18px, dark glyph). Examples: Explore Tours, View Trip, Reserve with [X]% advance, Plan a private trip, Clear filters, Chat now, Get directions, Send on WhatsApp, Browse tours, Next: …, Call travel support, Chat on WhatsApp (footer), Plan on WhatsApp (mobile menu).
  - **secondary**: transparent, 1px `text` border and `text` colour on dark, or 1px `ink-text` border and colour on light. Padding `0 24px`. Examples: Plan on WhatsApp, Ask on WhatsApp, Call us, WhatsApp first, Plan a private trip (About), Request a call back, Explore destinations, Clear search, Select date (TD rows, light). Homepage hero adds `background: rgba(12,18,22,.25)` (`Homepage:78`).
  - **quiet**: 1px `line-strong` on dark, or `line-strong-light` on light, transparent. Examples: Join waitlist (TourCard), Back (Planner on light and on the dark mobile bar), Join waitlist (TD departure rows, light). Contact's social links (Instagram, Facebook, YouTube) use the quiet style at 44px (`Contact:140-142`).
  - **header**: "WhatsApp us", 44px, padding `0 18px`, 14/500, border `rgba(241,238,232,.5)`, WhatsApp icon. This style is not in DESIGN §7 (see Inconsistencies).
- **Sizes found:** 56 (closing CTAs, footer, mobile menu, Contact support), 52 (standard), 48 (TourCard, BookingPanel's secondary, TD sticky bar, planner mobile bar, TD departure rows, About profile share), 44 (header, Contact social). At 48px the label is usually 15px. At 52 and 56 it is 16px.
- **States:** default, hover (gold-hover plus arrow +4px, shown in DS and TourCard), pressed (gold-pressed, DS only), focus (2px outline in the text colour, 3px offset, DS only), **disabled**. Disabled is the line fill with `text-3` text and `cursor:not-allowed` (BookingPanel "Reserve" with no date, `BookingPanel:88`). It also appears as the look-alike "No trips match" in the Tours filter sheet (`Tours:287`). Selected: TD's "Selected ✓" is a gold fill with a `gold-deep` border on light (`Tour Detail:329`). Hover for secondary and quiet buttons is not designed.
- **Layout props seen:** `flex:1 1 auto` pairs that wrap (hero, CTAs, banners), full width (sheet, footer, menu), `align-self:flex-start`, `white-space:nowrap`.
- **Behaviour:** renders as `<a>` or `<button>`. Every WhatsApp button links to `wa.me` with a pre-filled message (Planner annotation "WHATSAPP · Standard wa.me link with the message pre-filled"). Buttons are never animated (RULE annotations on Home, TD, Tours, Destination and Planner).
- **Client?** No. It stays static, and the parent passes `onClick` where needed.

#### 2 `IconButton` — `components/ui/IconButton`
- 44×44 (header, sheets, stepper, accordion, profile nav) or 48×48 (TourCard and TD sticky-bar WhatsApp). Radius 6px.
- **Border variants:** `rgba(241,238,232,.5)` (header WhatsApp and menu), `line-strong` (dark: close, prev/next, steppers, TourCard WhatsApp), `text` (TD sticky bar WhatsApp), `line-strong-light` (light: steppers, accordion +), **none** (Help search clear, `Help:72`).
- **Glyphs:** WhatsApp icon, menu (two 16×1.5px lines, gap 6), `×` (22/300), `←`/`→`, `−`/`+` (20px), accordion `+` (22/300, rotates 45° when open).
- **States:** default. Hover is shown only on TourCard (WhatsApp border `line-strong` → `text`, .3s). Every instance needs an `aria-label` ("Menu", "Close", "Close profile", "Previous profile", "Fewer travellers", "Ask about {title} on WhatsApp", …).
- **Client?** Static, unless it toggles something.

#### 3 `TextLink` — `components/ui/TextLink`
- **Underlined link with arrow:** 15/500, `text-underline-offset:6px`, 1px thickness, min-height 44. Examples: "Meet the team →", "All tours →" (`Homepage:94,106`).
- **Back link:** 14/500, no underline, `← All tours` (TD hero) and `← All destinations` (Dest hero), min-height 44.
- **Text button** (same look, `<button>`): "Clear all" (Tours bar and sheet; 14 or 15/500), "Edit" (Planner review), "Plan another trip" (Planner success, 14px `ink-text-2`), "Read the full policy ▾ / Hide the full policy" (Help), "View profile" (About card, 13/500, offset 4).
- **Inline body link:** offset 4px ("Privacy policy", the Legal email). Its colour follows `data-surface`: `text`, hover gold on dark; `ink-text`, hover deep gold on light.
- **Big arrow row link:** see `QuickLinks` (Contact). Flagged as feature-level.
- **Mono deep link:** "Link to this answer · /help#id" (Geist Mono 12px, `Help:127`). Mono is supposed to be for placeholders only (see Inconsistencies).

#### 4 `Tag` — `components/ui/Tag`
- **urgent:** 28px, padding `0 10px`, 999px, `ink-900` fill, 1px gold border, gold 13/500 text, 13px clock icon, gap 6. "Only N seats left" (`TourCard:21`).
- **soldout:** 30px, padding `0 12px`, `ink-900` fill, 1px `line-strong` border, `text` 13/500, "Sold out" (`TourCard:24`).
- **category:** 26px, padding `0 10px`, 999px, 1px `line-strong` border, `text-2` 13px. Values: Heritage, Viewpoint, Lake, Adventure (`Destination:181`).
- Static. Positioned 16px inset at top-left on the photo for the status tags.

#### 5 `Chip` — `components/ui/Chip`
All variants are 44px high, 999px radius, 14/500, `white-space:nowrap`, with `aria-pressed` or `aria-expanded`.
- **toggle, dark** (Tours filter sheet `Tours:279`): off has a `line-strong` border and transparent fill. On has a **solid `text` fill with `ink-900` text**. Includes a count at opacity .75.
- **toggle, light** (Planner date mode, months, trip length, step-2 groups and times, `Trip Planner:142,154,173,212,246`). Off has a `line-strong-light` border and `ink-text` text. On has a **solid `ink-text` fill with `mist-50` text**.
- **dropdown trigger, dark** (Tours desktop filter groups and sort, `Tours:89,111`). Off has a `line-strong` border. Active (filters applied) has a `text` border, `ink-800` fill and an "(n)" count in `text-2`. A caret ▾ rotates 180° when open (.2s). Sort shows "Sort:" in `text-2`.
- **removable, dark** (active filter chips, `Tours:106,147`): `text` border, `ink-800` fill, padding `0 8px 0 16px`, plus a 28px round `×` (18/300, `text-2`). `aria-label="Remove filter {label}"`.
- **mobile bar buttons** (Tours: "Filters (n)" and "Sort ▾") use the same pill. "Filters" picks up the active style when n > 0.
- **link chip, light** (Help mobile category scroller, `Help:93`): an `<a>` with a `line-strong-light` border and a count in `ink-text-3`. Not a toggle.
- Client (toggle state). Hover and focus states are not designed.

#### 6 `Input` — `components/ui/Input`
All on light (`mist-50` fill), `ink-text` 16px, 2px radius, placeholder `ink-text-3`.
- **text:** 52px, padding `0 16px` (Name, Other city with max-width 360).
- **tel with prefix:** a "+92" box (52px, `mist-100` fill, 16/500 tabular, no right border) joined to the input. `inputmode=numeric`, `autocomplete=tel-national`. Input is stripped to digits and spaces, max 13 characters (`Trip Planner:236-237,664`).
- **date:** 52px, padding `0 14px`, inside a label "From"/"To" (13px `ink-text-2`). The design sets `color-scheme:dark` (flagged).
- **search:** 56px, padding `0 56px 0 18px`, visually hidden label, with a clear `IconButton` (borderless) when the field has text. The native cancel button is hidden (`Help:24-25,68-73`).
- **States:** default border `line-light`. **filled** (search) border `ink-text`. **error** border `gold-deep` with `aria-invalid` (Name, Phone, date inputs). Focus is not designed.
- Client.

#### 7 `Select` — `components/ui/Select`
- **dark** (BookingPanel compact, `BookingPanel:28`): 52px, 2px radius, `ink-900` fill, 15/500, padding `0 44px 0 14px`, custom ▾ at right 16. Border is `line` when empty and `text` when a value is chosen. The disabled first option reads "Choose a departure".
- **light** (Planner child ages, `Trip Planner:193`): 44px, min-width 110, 2px radius, `mist-50` fill, 15px, ▾ at right 12. Border is `line-light`, or `gold-deep` on error.
- Client.

#### 8 `Textarea` — `components/ui/Textarea`
- Planner "Anything else?" (`Trip Planner:251`): min-height 128, padding `14px 16px`, 2px radius, `line-light` border, `mist-50` fill, 16/1.5, `resize:vertical`. Only the default state is designed.

#### 9 `Checkbox` / `Radio` — `components/ui/Checkbox`, `components/ui/Radio`
- **Checkbox indicator** 18px, 1.5px border, ✓ 12/700. On dark (Tours dropdown) it has **0 radius**: off `line-strong`, on `text` fill with `ink-900` ✓ (`Tours:94`). On light (Planner destination cards) it has **2px radius**: off `line-strong-light`, on `ink-text` fill with `mist-50` ✓ (`Trip Planner:131`).
- **Radio indicator** 18px circle (Tours month options, sort dropdown and sort sheet): off `line-strong` border, on `text` fill.
- **Radio ring** 16px ring, 1.5px, with an 8px inner dot (BookingPanel date list, `BookingPanel:41`): off `line-strong` ring with no dot, on `text` ring and dot.
- Used only inside option rows. There is no standalone labelled checkbox in the design. Client.

#### 10 `Stepper` — `components/ui/Stepper`
- `−` [value] `+`: two 44px `IconButton`s (6px radius), value 18/500 tabular, min-width 32 (28 in the planner "Roughly N days" row), gap 6.
- **Dark** (BookingPanel "Travellers", `line-strong` border). **Light** (Planner Adults, Children, days; `line-strong-light` border).
- **Limits in the scripts:** travellers 1 to (seats left of the selected date, else 16). Adults 1–40, children 0–20, days 2–21.
- **States:** default only. Disabled at min or max is **not designed**.
- Each button needs an `aria-label` ("Fewer/More travellers|adults|children|days"). Client.

#### 11 `Accordion` — `components/ui/Accordion`
- Same style in **Tour Detail "11 FAQs"** (`Tour Detail:403-409`) and **Help "02 FAQs"** (`Help:120-129`), both on light.
- **Row:** full-width `<button>`, min-height 72, padding `16px 0`, question 20/500 (`-.015em`). The trailing 44px box (6px radius, `line-strong-light` border) holds a `+` that rotates 45° (.3s) when open. Rows are separated by `line-light` hairlines with a top border on the list.
- **Panel:** padding `0 68px 28px 0`, max-width 740, 16/1.6 `ink-text-2`.
- **States:** closed, open. **Single-open:** TD opens the first item by default; Help opens none by default. Help adds **search-term highlight** (`gold-deep` background, `mist-50` text) and a deep-link line in the panel.
- **Behaviour (Help):** each item has an `id`, and `/help#id` opens and scrolls to it (96px offset). Opening an item writes `#id` with `replaceState`. While a search is active, every match is expanded. Uses `aria-expanded` and `aria-controls`. Annotation: "SEO · Mark up FAQs as FAQPage structured data".
- Client.

#### 12 `Disclosure` — `components/ui/Disclosure`
A caret-style show/hide (▾ rotates 180°), distinct from the `+` accordion:
- Help policy card: "Read the full policy ▾" / "Hide the full policy" (text button, `Help:160`).
- Legal mobile "Contents (9) ▾" (52px full-width row, `Legal:84`). It closes when a link inside is clicked.
- Planner mobile summary bar (52px row, `Trip Planner:63`).
- Client. This could be folded into `Accordion` with a `caret` variant. Both styles are designed (see Inconsistencies).

#### 13 `Dropdown` — `components/ui/Dropdown` (**Tours only**)
- **Panel** (`Tours:91,113`): absolute, top 52px, min-width 260, padding 8, `ink-900` fill, 1px `line` border, **no radius** (DESIGN says 8px).
- **Option row:** min-height 44, padding `0 10px`, 15px, checkbox or radio indicator plus label plus count (13px `text-3`). Selected rows get an `ink-800` background.
- **Behaviour:** one open at a time. A transparent full-screen layer catches outside clicks and closes it. **Escape closes it and returns focus to the trigger** (`Tours:352-356`). It closes when the filter bar auto-hides. Sort closes on pick. Filter options stay open (multi-select).
- Client. Only one page uses it. Keep it in `ui` only if you count it as a primitive (CLAUDE.md lists Dropdown under `ui`). Otherwise it belongs in `components/tours`.

#### 14 `Sheet` — `components/ui/Sheet`
- **Bottom sheet** (mobile and compact): fixed full-screen. Backdrop `rgba(12,18,22,.72)` closes on click. The panel is `ink-900`, max-height 92%, with a 1px `line-strong` top border. Uses `role="dialog" aria-modal="true"` and an `aria-label`.
  - **With grab handle** (36×4, 999px, `line-strong`) and a header row (title 18/500 plus a 44px close `×`): TD booking sheet (`Tour Detail:473-483`), Tours filter sheet (`Tours:262-291`, with a scroll body and a pinned footer), Tours sort sheet (`Tours:293-309`).
  - **Without a handle**: About profile on mobile (`About:243-269`).
- **Side drawer** (desktop): About profile, `min(460px,100%)`, full height, 1px `line-strong` left border, sticky header.
- **Radius:** none designed. DESIGN §7 says sheets and drawers take 8px (see Inconsistencies).
- **Behaviour designed only on About:** Escape closes, focus moves to the close button on open, focus returns to the opening card, body scroll lock, `overscroll-behavior:contain`. CLAUDE.md §10 requires Escape-and-return-focus on every overlay, so apply it to all sheets.
- Client.

#### 15 `StarRating` / `RatingInline` — `components/ui/StarRating`
- **StarRating:** five gold stars with `aria-label="5 out of 5 stars"`. 15px with gap 4 (default review card) or 13px with gap 3 (Tours compact review card).
- **RatingInline:** one gold star plus a score (600 weight, tabular) plus "(count)" in `text-3`. TourCard and BookingPanel use 15px star and 14px text. The TD hero uses 16px star, 18/500 score and "(128 reviews)" at 14 `text-2`.
- **RatingSummary** (section header): 16px star, "**4.9** average · [X] reviews", 15px `text-2` (Home and TD reviews, Tours reviews).
- Static.

#### 16 `MediaFrame` / `ImagePlaceholder` — `components/ui/MediaFrame`
- An 8px-radius, overflow-hidden frame with a fixed aspect ratio. The placeholder is `repeating-linear-gradient(135deg,#151E24 0 10px,#10181C 10px 20px)` with an 11px Geist Mono caption at the bottom-left. Insets vary: 14/12 (most), 12/10 (hotels, vehicles, other destinations), 16/14 (banner), 20/16 (TourCard).
- **Aspect ratios used:** 4:3 (TourCard, highlights, hotels, vehicles, other destinations, office, About hero on mobile), 3:4 (Homepage destinations), 4:5 (guides, founder, profile on desktop), 16:10 (private trip banner, planner destination cards), 21:9 (About hero on desktop), 16:9 (DS sample).
- **Stripe variants:** hero 12/24px. Mini 8/16px with a 10px caption (Destination place thumbs, planner cards). **Light** `#DCE2E7/#E6EAEE` with `ink-text-2` caption (Planner destination cards).
- Full-bleed hero media is never rounded (Home, TD and Destination heroes).
- In production this is the real `<img>` with width and height. The mono caption is placeholder only. Static.

#### 17 `SectionLabel` — `components/ui/SectionLabel`
- 11×10 triangle (`clip-path` polygon) plus 13/500 `text-2`, height 28, `flex:0 0 240px`.
- Used in the footer "Contact" (all pages), About "07 Credentials", Contact "05 Quick links" and **Contact "01 Header"** (flagged). Static.

#### 18 `BrandMark` — `components/ui/BrandMark`
- 16×14 triangle plus "[BRAND NAME]" 16/600 (`-.01em`), gap 10, min-height 44, links home. Static.

#### 19 `KeyValueRow` / `ListRows` — `components/ui/KeyValueRow`
- **Justified pair** (label `text-3` left, value right, 15px, padding `14px 0`, bottom hairline, top border on the list): footer contact rows (all pages), About "Visit us", Contact "Visit the office".
- **Label-column pair** (fixed label column 100–200px): Credentials (200px), Destination getting-there (120px), Planner summary (100/110px grid), Planner review (110–180px), About profile (120px), TD itinerary `<dl>`.
- **Room-price row** (TD "Room sharing", light): title 16/500 plus sub 13, price right 16/500.
- Surface follows the parent: `line` on dark, `line-light` on light. Static.

#### 20 `FormField` (+ `FieldError`) — `components/ui/FormField`
- **Field heading:** label 20/500 plus hint 13 `ink-text-3` ("Required", "Optional", "Required · choose one or more", "Lahore by default", "Optional · filled from your flexible dates").
- **FieldError:** `role="alert"`, a 20px round "!" badge (`gold-deep` fill, `mist-50` 13/700) plus a 14/500 message. The phone message wraps (align flex-start).
- Planner only today. Treat it as a form primitive that pairs with `Input`, `Select` and `Textarea`. Otherwise keep it in `components/planner`.

#### 21 `Icon` — `components/ui/Icon` (or `ui/icons/*`)
- WhatsApp (light and dark versions in `icons/`; the Homepage uses the simple-icons CDN with `filter:invert(1)`), star polygon, clock (13px, TourCard urgent tag), inclusion icons 22px (`bed-double`, `utensils`, `bus`, `compass`, `car-front`, `sandwich`, `wallet`, `ticket`, `plane`). Text glyphs: ▾, →, ←, ×, +, −, ✓.

---

## 2. Feature components (`components/<feature>`)

| Feature folder | Component | Pages / section | Client? |
|---|---|---|---|
| `tour-card` | `TourCard` | Home 03, TD 12, Tours 03, Dest 07, DS 06 | client only for hover (CSS-only hover suffices → static) |
| `tour-card` | `TourCardGrid` | Home 03, TD 12, Dest 07, Tours 03 | static (rise motion = small client hook) |
| `tour-card` | `SeeAllToursCell` | Dest 07 | static |
| `tour` (shared tour bits) | `PriceBlock` | TourCard, BookingPanel, TD hero, TD sticky bar, TD dates | static |
| `tour` | `SeatsStatus` (dot + text) | TourCard, BookingPanel, TD hero, TD dates | static |
| `booking-panel` | `BookingPanel` | TD aside, TD sheet, TD Views 1c | client |
| `booking-panel` | `DepartureOption` (radio row) / `RoomOption` | inside BookingPanel | client |
| `booking-panel` | `BookingStickyBar` | TD (compact < 1100) | client |
| `booking-panel` | `BookingSheet` | TD (compact) | client |
| `departures` | `DepartureList` + `DepartureRow` | TD 08 | client (select date) |
| `departures` | `RoomSharingList` | TD 08 | static |
| `route-map` | `RouteMap` (schematic + legend) | Home 05 | static |
| `route-map` | `RouteStopList` | Home 05 | static |
| `itinerary` | `ItineraryTimeline` + `ItineraryDay` | TD 05 | client (scroll-linked active day) |
| `itinerary` | `ItineraryMap` (sticky, progress line) | TD 05 (≥ 1280) | client |
| `itinerary` | `DayMiniMap` | TD 05 (< 1280) | static |
| `places-map` | `PlacesMap` + `PlacePin` | Dest 04 | client |
| `places-map` | `PlaceList` + `PlaceRow` | Dest 04 | client |
| `route-line` | `RouteLine` (horizontal / vertical) | Dest 05 | static (switch is CSS) |
| `season-calendar` | `SeasonCalendar` + legend | Dest 03 | static |
| `season-calendar` | `SeasonNotes` (4 cells) | Dest 03 | static |
| `destination-card` | `DestinationCard` | Home 06, Dest 10 | static |
| `guide-profile` | `GuideCard` | Home 07 (static), About 04 (button) | About: client |
| `guide-profile` | `GuideProfileDialog` | About 04 | client |
| `review-card` | `ReviewCard` (default / compact) | Home 08, TD 09, Tours 05, Dest 09, About 09 | static |
| `highlights` | `HighlightCard` | TD 04 | static |
| `hotels` | `HotelCard` | TD 07 | static |
| `inclusions` | `InclusionList` (icon rows) | TD 06 | static |
| `inclusions` | `SuitabilityList` (+ / – rows) | TD 03 | static |
| `facts` | `FactsRow` (hero facts) / `FactCell` | TD 01, TD 02, Dest 01 | static |
| `filters` | `FilterBar` (desktop) | Tours 02 | client |
| `filters` | `FilterGroup` (trigger + dropdown) / `SortMenu` | Tours 02 | client |
| `filters` | `ActiveFilterChips` + Clear all | Tours 02 / 03 | client |
| `filters` | `MobileFilterBar` | Tours (mobile) | client |
| `filters` | `FilterSheet` / `SortSheet` | Tours (mobile) | client |
| `filters` | `ResultsHeader` | Tours 03 | static |
| `planner` | `PlannerProgress` | Planner (main or bar) | client |
| `planner` | `PlannerSummaryBar` | Planner (compact) | client |
| `planner` | `PlannerAside` (TripSoFar + WhatHappensNext) | Planner (≥ 1100) | client (reads answers) |
| `planner` | `DestinationChoiceCard` | Planner step 1 | client |
| `planner` | `StepWhereWhen` / `StepWhosComing` / `StepDetails` / `StepReview` / `PlannerSuccess` | Planner | client |
| `planner` | `CounterRow` (label + Stepper) | Planner step 2 | client |
| `planner` | `ChildAgeSelects` | Planner step 2 | client |
| `planner` | `PhoneField` (+92) | Planner step 3 | client |
| `planner` | `ReviewSummary` (sections + Edit) | Planner review | client |
| `planner` | `WhatsAppMessagePreview` | Planner review | static (props) |
| `planner` | `StepNav` (inline) / `PlannerBottomBar` (mobile) | Planner | client |
| `help` | `HelpSearch` | Help 01 | client |
| `help` | `CategoryNav` (sticky list / chip scroller) | Help 01–02 | static links (counts from search → client) |
| `help` | `FaqCategory` | Help 02 | client |
| `help` | `PolicyCard` (+ refund table) | Help 03 | client (Disclosure) |
| `legal` | `TableOfContents` | Legal 02 | client on mobile |
| `legal` | `LegalSection` | Legal 02 | static |
| `contact` | `ContactChannelCard` | Contact 02 | static |
| `contact` | `OnTripPanel` + `OnTripMobileBanner` | Contact 03 / top | client (scroll + focus) |
| `about` | `VehicleCard` | About 05 | static |
| `about` | `CheckList` (safety) | About 05 | static |
| `about` | `StatCell` | About 06 | static |
| `about` | `PrincipleCell` | About 03 | static |
| `steps` | `StepCell` (big numeral) | Home 04 | static |

### 2.1 Details

#### `TourCard` — `components/tour-card/TourCard`
- **Pages:** Homepage "03 Departures" (4), Tour Detail "12 Related tours" (3), Tours "03 Results" (8), Destination "07 Tours" (2), Design System "06" (all states).
- **Anatomy** (`TourCard.dc.html`): `MediaFrame` 4:3 with an optional status `Tag` at a 16px inset. Body padding 24px: route 13/500 `text-2`, title H3 26/500 (balance, 10px gap), dates 15 `text`. Then a divider (`margin-top:auto`, padding-top 20, `line`), `PriceBlock` on the left and `RatingInline` on the right, `SeatsStatus` 16px below, and actions 24px below (gap 8): **View Trip** (primary 48, flex 1, arrow) plus a 48px **WhatsApp IconButton**.
- **States:** **default**. **hover** (pointer only: `ink-800` surface .4s, photo scale 1.045 over 1s `ease-out`, arrow +4px over .3s, WhatsApp border → `text`). **urgent** (≤ 3 seats: urgent tag "Only N seats left", gold dot and text "3 of 16 seats left"; hover still applies). **soldout** (no hover, photo 40% opacity, title and price `text-2`, "Sold out" tag, dot `line-strong`, "0 of 12 seats · waitlist open", primary replaced by **Join waitlist** quiet 48). Forced-hover is a design-only prop.
- **Data:** `title, price, route, dates, seatsLeft, totalSeats, rating, reviews, photo, status, href`. The price is the shown departure's twin price: its own room prices, or else the tour's (ADR-0017).
- **Motion (M4):** "cards rise" once, on first view only, translateY 40px → 0 over .9s with a 90ms stagger. Only the photo fades. Cards are visible by default. On Tours it runs on first load only, never on filter change. Reduced motion means the cards simply appear.
- **Client?** Hover can be pure CSS (`@media (hover:hover)`), so the card stays static. The rise needs a small client hook (`/hooks/useRiseOnView`).

#### `TourCardGrid`
- A hairline grid of TourCards. Home uses max 4 columns (MIN 280). TD and Destination use max 3 (MIN 280). Tours uses explicit 1/2/3 columns (< 820 / < 1100 / else) with border-right/bottom hairlines, in **two chunks around `PrivateTripBanner`**: the first row (2 cards on mobile, n columns otherwise), then the banner, then the rest. Sold-out trips sort last.
- `SeeAllToursCell` (Destination only): the last grid cell, min-height 200, padding `32px 28px`, "See all Hunza trips →" 26/500 plus "Opens the Tours page, filtered to Hunza" 14 `text-2`. Links to `Tours?dest=hunza`.

#### `PriceBlock` — `components/tour/PriceBlock`
- "from" 13 `text-3` / "PKR 145,000" tabular nowrap / "per person[, twin sharing]" 13 `text-3`. A card's price is its departure's twin price; "from" elsewhere is the lowest twin price across upcoming departures, worked out, never stored (ADR-0017).
- **Sizes:** 24/500 (TourCard), 30/500 (BookingPanel), 18/500 (TD hero facts, TD sticky bar, TD departure rows), 16/500 (room rows).
- The sold-out colour is `text-2` (TourCard). On the TD dates list the sold-out colour is `ink-text-2`. Never animated. Static.

#### `SeatsStatus` — `components/tour/SeatsStatus`
- A 7px dot plus 13–14/500 text.
- **States and colours:** open (`text-2` dot and text, "N of M seats left" or "N seats left"), urgent (gold on dark, `gold-deep` on light: "Only N seats left" or "3 of 16 seats left"), soldout (dot `line-strong` or `line-strong-light`, text `text-3` or `ink-text-3`: "Sold out", "0 of 12 seats · waitlist open", "Sold out · waitlist open").
- Static. Text wording differs per place (see Inconsistencies).

#### `BookingPanel` — `components/booking-panel/BookingPanel`
- **Placement:** TD desktop `aside` (`flex:0 0 380px`, sticky top 88, margin `56px 0`, padding 24, 1px `line` border, **8px radius**, `max-height: calc(100vh - 156px)`). Also inside the TD booking `Sheet` (compact).
- **Anatomy:** a scroll body, then a pinned footer.
  - Body: `PriceBlock` 30px plus `RatingInline`. A hairline. "Departure date" label 13/500 `text-2`, then **either** a list of `DepartureOption` radio rows (min-height 48, padding `0 14px`, ring plus date 15/500 plus seats 13/500; selected has a `text` border and `ink-800` fill; sold-out dates show their text in `text-2`) **or**, in **compact** mode (viewport height < 920), a dark `Select` followed by a `SeatsStatus` line.
  - "Travellers" with a `Stepper` ("Adults and children [X]+").
  - "Room sharing" with three `RoomOption` buttons (min-height 56, label 14/500 plus price 13 `text-2`; selected has a `text` border and `ink-800` fill; **0 radius**).
  - A trust line ("DTS licence No. [NUMBER] · Departs from [pickup point], Lahore"). The payments line becomes **"Cash · Bank transfer"** (override).
  - Footer (`ink-900`, top hairline): Total row ("Total / Choose a date" when empty; "2 × PKR 145,000 / PKR 290,000" 24/500 when a date is chosen) plus "Advance to reserve: [X]% of total". A sold-out date shows "{date} is full. Join the waitlist and we'll message you on WhatsApp if a seat opens." Primary 52: **disabled** "Reserve with [X]% advance" (no date), **enabled** "Reserve with [X]% advance →" (opens WhatsApp, override), or "Join waitlist" (gold, sold out). Then the secondary 48 "Ask on WhatsApp" with icon, then the cancel note 13 `text-3`.
- **States (TD Views 1c):** no date, date selected, compact short-screen (dropdown with the footer pinned), sold-out date selected.
- **Behaviour:** controlled `date` and `onDate` are shared with `DepartureList` and the sticky bar. Travellers are clamped to the seats left. Choosing a date on compact opens the sheet.
- Client.

#### `BookingStickyBar` — `components/booking-panel/BookingStickyBar`
- TD compact (< 1100): sticky to the bottom, `rgba(12,18,22,.82)` plus 18px blur, safe-area padding. "PKR 145,000" 18/500 plus a sub line ("per person · twin sharing" or "per person · {date}[ · sold out]"), then **Reserve** (primary 48, 15px), which opens the sheet, plus a 48px WhatsApp `IconButton` (`text` border).
- Client.

#### `BookingSheet`
- A `Sheet` with a handle and a header: "Hunza & Skardu Grand" 18/500, "9 days, 8 nights · from Lahore" 13, a close `×`, and the BookingPanel inside (TD Views 1e: "bottom sheet, date selected"). Opened by Reserve on the bar, by picking a date on compact, or by the final-CTA Reserve on compact.

#### `DepartureList` / `DepartureRow` — `components/departures`
- TD "08 Dates and prices" on **light**. Each row wraps: date 20/500 plus "9 days, 8 nights · departs Lahore" 14 `ink-text-3`, then `SeatsStatus` (light colours), then `PriceBlock` 18 plus "per person, twin", then the action.
- **Action states:** **Select date** (secondary on light 48, padding `0 22px`, 15px), **Selected ✓** (gold fill, `gold-deep` border), **Join waitlist** (quiet light 48). Rows are separated by hairlines.
- Picking a date updates the BookingPanel and opens the sheet on compact. Client.
- `RoomSharingList`: "Room sharing" 20/500, three KeyValue price rows (Twin, Triple, Quad), then a note 14 `ink-text-2`. Static.

#### `RouteMap` — `components/route-map/RouteMap`
- Homepage "05 Route map". 560:700 schematic. `#0E151A` surface, 1px `line` border (**no radius**). Graticule lines `#1B252C` with 11px `text-3` degree labels. Main route 2px `text` with round joins. Valley roads 1.5px dashed `text-3` (4/5). Destinations are 9px gold dots with 20px halos (`rgba(217,180,74,.2)`) and 14/500 labels. Waypoints are 8px hollow `text` rings with 12px `text-2` labels. Start (Lahore) is a 10px `text` square with "Lahore · start". Caption "Northern Pakistan / Schematic · roads simplified". Labels are HTML overlays.
- Legend row below (13px `text-2`).
- **M5:** the route and markers are shown in full, with no draw-on-scroll. Static.
- `RouteStopList`: header "Main route · elevation" 13/500, then rows as a 3-column grid `36px 1fr auto` (number 13 `text-3` / name 18/500 with an optional 8px gold dot / elevation 14 `text-2` / note 14 `text-3`). Static.
- CLAUDE.md §8: schematic SVG only, no borders, and it needs Survey of Pakistan vetting.

#### `ItineraryTimeline` / `ItineraryDay` — `components/itinerary`
- TD "05 Itinerary". An `<ol>` with a 1px `line` left rule. Each day has an 11px node at left −6, a label "Day 01" 13/500 `text-2`, an H3 26/500 "Lahore → Islamabad", a body 16/1.55 `text-2` (max 520), and a `<dl>` grid (Overnight / Meals / Drive) above a hairline.
- **Node states:** current (gold fill and ring), visited (`text` fill and ring), upcoming (`ink-900` fill, `line-strong` ring), with a .3s transition.
- **Behaviour (M5):** the active day is the last `[data-day]` whose top is above 50% of the viewport. The progress line follows the day being read. Reduced motion makes progress jump. Annotation: "Map is sticky only; it never captures scroll".
- Client (scroll listener).

#### `ItineraryMap` — `components/itinerary/ItineraryMap`
- ≥ 1280 only: a sticky (top 104) 340px column. Header "Day 03 of 09" 13/500 gold plus the day title 15/500 ("Start / Lahore" before the first day). The map has no border and no surface fill. The base route is `line-strong` 1.5px with a `text` 2px **progress path** (`strokeDashoffset`). Stops: current is a 10px gold dot with a 24px halo and a gold 600 label. Visited is `text`. Upcoming is hollow with a `line-strong` ring and a `text-3` label. Lahore is a square unless current. Caption "Schematic · roads simplified" 12px.
- Client.

#### `DayMiniMap`
- < 1280: a 112×156 thumbnail beside each day heading. It shows the base route, progress to that day, the Lahore square, a gold current-stop dot with a halo, and 12/500 labels on an `ink-900` chip (from-stop in `text`, to-stop in gold). Static (the progress fraction is per day).

#### `PlacesMap` / `PlacePin` / `PlaceList` / `PlaceRow` — `components/places-map`
- Destination "04 Places to see". The map (484:420, sticky top 96 on desktop, static on mobile) has a graticule, route, static labels ("↓ Gilgit", "↑ Khunjerab", "Karimabad") and **numbered pins**: a 44px hit area, a 26px circle (1.5px border), number 12/600, and a 40px halo when highlighted. Off: `ink-900` fill with a `text` border and number. On: gold fill and border with an `ink-900` number. When highlighted, a label (13/600 gold on an `ink-900` chip) is placed with **collision avoidance**: four candidate spots, and static labels it would overlap are hidden.
- **List:** `<ol>` rows as full-width buttons (padding `16px 12px`): a 96px 4:3 mini `MediaFrame`, a 22px number badge, name 17/500, desc 14 `text-2`, and a category `Tag`. Highlighted rows get an `ink-800` background.
- **Behaviour:** hover, focus or tap on a pin or row highlights both ("Hover or tap a place to light its pin, and the reverse"). On mobile, tapping a row scrolls the map into view (offset 88, smooth unless reduced motion). "Pins are shown straight away; the page keeps scrolling normally over the map." The Views show the `highlight` preset (Attabad, Baltit).
- Client.

#### `RouteLine` — `components/route-line/RouteLine`
- Destination "05 Getting there". **Desktop:** a horizontal line of stops (12px dots, `text`, the last one gold) joined by 2px `text` legs with drive times (14 `text-2`, tabular) below. Stop names 17/500 sit above (the last one gold). **Mobile:** a vertical list (dot plus a 2px connector, name 17/500, "↓ [4–5 hrs]" or "Arrive").
- Followed by label-column rows "By road" / "By air". Static.

#### `SeasonCalendar` / `SeasonNotes` — `components/season-calendar`
- Destination "03 Season calendar" (also in the "template check" Views for Murree). The legend has 14px squares: Best (`text` fill), Good (`ink-800` with a `line-strong` border), Avoid (`ink-900` with a `line` border).
- A hairline grid of 12 months (**12 columns on desktop, 6 on mobile**, fixed). Each cell is min-height 76, padding `14px 10px 16px`, name 15/500 and label 13/500. Best has a `text` fill with `ink-900` text. Good has `ink-800`. Avoid has `ink-900` with `text-2`/`text-3`.
- `SeasonNotes`: four cells (MIN 240, max 4 columns): season 18/500, months 13 `text-3`, text 15 `text-2`. Static.

#### `DestinationCard` — `components/destination-card/DestinationCard`
- **Homepage variant** ("06 Destinations", 6 columns, MIN 160): `MediaFrame` 3:4, then name 22/500, "Best season" 13 `text-3`, months 15 `text`. Links point to `#hunza` anchors in the design.
- **Destination "Other valleys" variant** ("10 Other destinations", 5 columns, MIN 160; on mobile an odd last item spans the full row): `MediaFrame` 4:3, then name 20/500, "Best · Apr – Oct" 14 `text-2`, "2 tours" 13 `text-3`. Links to `Destination?d=key`.
- Static. Hover is not designed.

#### `GuideCard` / `GuideProfileDialog` — `components/guide-profile`
- **GuideCard on Homepage** ("07 Guides and drivers"): a static `div`. `MediaFrame` 4:5 PORTRAIT, then name 18/500 and role 14 `text-2`. Not clickable.
- **GuideCard on About** ("04 Guides and drivers"): a `<button>` with `aria-haspopup="dialog"` that adds an underlined "View profile" 13/500. While its profile is open the card background is `ink-800` (.2s).
- **GuideProfileDialog:** a `Sheet` (side drawer 460 on desktop, bottom sheet at max 92% on mobile). The sticky header has a counter "N of 8", prev and next `IconButton`s (they cycle), and close. The body has a portrait (4:5 on desktop, 4:3 on mobile), name H2 32/500 (`id="guide-name"` used for `aria-labelledby`), role 15, quote 19, label-column rows (Home valley, With us, Languages, Leads, Licence when present), a secondary 48 "Share this profile on WhatsApp" (`wa.me/?text=`), and a mono URL line `/about#guide-{id}`.
- **Behaviour:** "LINKS · Guide profiles open from /about#guide-name". The hash is read on load and on `hashchange`. Open, prev and next `replaceState` to `#guide-id`. Close sets `#guides`. Escape closes. Focus moves to close on open and returns to the originating card. Body scroll lock. "REAL ONLY · no stock photos of people".
- About cards are client. Homepage cards are static.

#### `ReviewCard` — `components/review-card/ReviewCard`
- A `figure` in a hairline grid (MIN 290, max 3 columns).
- **default:** padding `32px P 36px`, gap 24, `StarRating` 15, quote `clamp(19px,1.6cqi,23px)`/1.42, then a hairline (padding-top 20) and the caption: name 15/500, "trip · month" 14 `text-3`.
- **compact** (Tours "05 Reviews"): padding `24px P 28px`, gap 16, stars 13, quote 17/1.5, caption padding-top 14 with name 14/500 and trip 13.
- Pages: Home 08, TD 09, Tours 05 (compact), Destination 09, About 09. Static. Reviews need `consent: true` (CLAUDE.md §7).

#### `HighlightCard` (TD "04 Highlights")
- `MediaFrame` 4:3, then title 20/500 and desc 14 `text-2`. Grid MIN 160, max 3 columns. **M4:** highlight cards rise in sequence (90ms stagger); the photo fades in, text never fades. Static plus the rise hook.

#### `HotelCard` (TD "07 Hotels")
- `MediaFrame` 4:3 (caption inset 12/10), then "Night 1 · Islamabad" 13 `text-3`, "[Hotel name]" 17/500, "[Category] · twin sharing" 14 `text-2`. Grid is **5 equal columns ≥ 1100, otherwise 1 column**, fixed (not capped auto-fill). A note sits below. Static.
- *(Built in PRD #47: hotels are never named; the title is generic, "Hotel in Karimabad", over a photo of the town or valley. The grid is capped auto-fill, MIN 160 so five fit beside the aside, never more columns than stays and at most 320px per stay, drawn as an open hairline grid so a wrapped row leaves no filled empty cells.)*

#### `InclusionList` (TD "06 Included", light)
- A two-column hairline grid "Included" / "Not included" (20/500). Rows have a 22px icon, title 15/500 and desc 14 `ink-text-2`, separated by hairlines. Static.

#### `SuitabilityList` (TD "03 Overview")
- Two cells, "Who this trip is for" (`+` bullets) and "Who it may not suit" (`–` bullets). Rows 15/1.5 `text-2`, padding 12, hairlines. Static.

#### `FactsRow` / `FactCell` — `components/facts`
- **Hero facts** (TD "01 Hero", Dest "01 Hero"): a top border `rgba(241,238,232,.18)`, then a capped grid `max(150px, (100%−72px)/4)` with gaps `16px 24px`. Each cell: label 13 `text-3`, value 18/500, optional sub-line. TD uses Duration / Rating / from / Next departure, with the last one showing `SeatsStatus` in gold. Destination uses Best season / Altitude / From Lahore / Tours.
- **Quick facts strip** (TD "02 Quick facts"): a text hairline grid (MIN 160, max 5 columns; the last cell spans the full row on mobile). Label 13 `text-3`, value 17/500.
- Static.

#### `FilterBar` and related — `components/filters`
- **FilterBar** (Tours "02 Filter bar", desktop): sticky at top 72, `rgba(12,18,22,.92)` plus blur, top and bottom hairlines, padding `12px P`. It contains the `FilterGroup` triggers (Destination, Duration, Budget, Trip type, Month), then a 1px divider, the removable chips and Clear all when any are active, then `SortMenu` aligned right.
- **FilterGroup:** a dropdown-trigger `Chip` plus a `Dropdown` with checkbox rows (multi-select) or radio rows (Month, single) and **faceted counts** (the count is calculated with that group's own filter ignored).
- **SortMenu:** "Sort: Soonest departure ▾" with radio rows (Soonest departure, Price low to high, Price high to low, Shortest first).
- **ActiveFilterChips:** removable `Chip`s plus a "Clear all" text button. On mobile they render above the results.
- **MobileFilterBar** (< 820): sticky with the same frosted look. "8 trips" 16/500 plus the "Filters (n)" and "Sort ▾" chips.
- **FilterSheet:** a `Sheet` with groups (label 13/500 `text-2`) of toggle `Chip`s with counts. The pinned footer has "Clear all" plus a primary 52 "Show N trips", which is styled as disabled ("No trips match") when there are 0 results.
- **SortSheet:** a `Sheet` of radio rows (min-height 56, 16px, hairlines). Picking one closes the sheet.
- **ResultsHeader** (desktop): "8 trips" 20/500 and "Sorted by soonest departure · sold-out trips last" 14 `text-2`.
- **Behaviour:** "URL · Filters and sort live in the URL, e.g. ?dest=hunza&type=family&sort=soonest, so a view can be shared on WhatsApp" (`replaceState`; the default sort is omitted). The filter bar **auto-hides** when scrolling down past 320px (translateY, .3s ease-out; no transition under reduced motion), reappears on scroll up, and closes any open dropdown when it hides. Escape closes the dropdown with focus returned to its trigger. An outside click closes it.
- **States (Tours Views):** default (8 trips), filtered (Hunza + Family → 2), empty (Murree + 8+ days), mobile filter sheet open.
- Client.

#### `EmptyState` (Tours "03 Results" empty)
- Between hairlines: H2 standard "No trips match these filters yet." (fixed wording, DESIGN §6), a lead 17 `text-2`, then primary 52 "Clear filters" plus secondary 52 "Ask on WhatsApp". The private-trip banner is hidden when empty. Lives in `components/filters/EmptyResults`, or reuse a section-level `EmptyState` with Help (see 3.x).

#### Planner components — `components/planner`
- **PlannerProgress:** an H2 15/500 with `aria-live="polite"` and `data-step-heading` ("Step 1 of 3 · Where and when" … "Review · Check and send"), then three 2px segments (`ink-text` when done or current, `line-light` otherwise). Desktop: sticky at top 72 inside the main column on a light frosted background `rgba(238,241,243,.92)`. Compact: inside the summary bar. Hidden on success. Client.
- **PlannerSummaryBar** (compact < 1100): sticky at top 72, light frosted. A 52px Disclosure row shows a label like "Hunza · June · 4 people ▾". Open, it shows summary rows (110px label grid, empty values shown as "—" in `ink-text-3`). It contains PlannerProgress below. Views 2b show "summary bar open".
- **PlannerAside** (≥ 1100): sticky at top 96, 380px, with two bordered boxes (`line-light`, **0 radius**). "Your trip so far" (17/500 plus "N of 9 answered", 9 summary rows) and "What happens next" (numbered 1–3, 14px), then the DTS line. On compact, "What happens next" and the DTS line render below the form instead (`showMobileNext`).
- **DestinationChoiceCard:** a grid MIN 150 of `<button aria-pressed>` cards with a 1px border (0 radius), a light `MediaFrame` 16:10, a checkbox and a label 15/500. Off: `line-light` border, `mist-50` fill. On: `ink-text` border, `mist-100` fill. Error: `gold-deep` border. The 7th card is "Not sure, suggest something" ("WE'LL SUGGEST"). Multi-select.
- **StepWhereWhen:** Destinations (required), Dates (required: an "Exact dates / Flexible" chip pair. Exact shows From/To date `Input`s. Flexible shows month chips and "Roughly [Stepper] days"), Trip length (optional chips, auto-filled from the flexible days until the user picks one).
- **StepWhosComing:** Group size `CounterRow`s (Adults "18 and over", Children "Under 18"). `ChildAgeSelects` (one per child, "Under 2"…17) appears when children > 0. Then five single-select chip groups: Group type, Hotels, Transport, Departing from (default Lahore; "Other city" shows a text `Input`), Budget per person.
- **StepDetails:** Name (required), WhatsApp number (`PhoneField`, required), Best time to reach you (chips), Anything else? (`Textarea`), and a privacy line with a link.
- **Validation (Views 1e, 2d):** shown after the user presses Next. Messages: "Choose at least one destination, or 'Not sure, suggest something'."; "Pick a month, or switch to exact dates."; "Add a start and an end date."; "The end date is before the start date."; "Add an age for each child."; "Add your name so we know who to reply to."; "Add your WhatsApp number so we can reply."; "This number looks incomplete (N of 10 digits). Pakistani mobile numbers have 10 digits after +92, for example 3XX XXX XXXX." On failure the page scrolls to the first invalid field (with the sticky offset) and focuses it.
- **StepReview / ReviewSummary:** a bordered box (0 radius) with three sections (title 17/500 plus an "Edit" text button that jumps to that step and focuses its first field) and label/value rows ("Not given" in `ink-text-3`). Then **WhatsAppMessagePreview** (icon plus "Message preview", a `mist-100` box with `pre-wrap` 14/1.6, and "Opens WhatsApp with this message ready to send. Nothing is sent until you press send there."). Desktop actions: Back (quiet light 52), **Send on WhatsApp** (primary 52 with icon, `wa.me` link), **Request a call back** (secondary light 52 → **opens WhatsApp**, override). On mobile only the call-back button is inline; Send lives in the bottom bar.
- **PlannerSuccess:** a 44px round ✓ (`ink-text` fill), H2 "Thanks, {first name}." (focused on arrival), a line, primary "Browse tours →" plus secondary "Explore destinations", and the "Plan another trip" text button (resets).
- **StepNav** (≥ 1100, steps 1–3): a hairline, then Back (quiet light 52, hidden on step 1), a spacer, and primary 52 "Next: Who's coming →" / "Review →".
- **PlannerBottomBar** (compact, steps 1–4): sticky to the bottom, **dark** frosted `rgba(12,18,22,.92)`. Back (quiet dark 48) plus a primary 48 "Next →" / "Review →" or "Send on WhatsApp".
- **Behaviour:** "SAVE · Answers are kept when going back a step or reloading the page" (localStorage key `planner-answers-v1`, answers plus step). "URL · ?dest= from Destination and Tour pages pre-selects that destination". "MOTION · Steps slide gently (translateX 28px → 0, .35s); reduced motion: steps simply swap". "RULE · Buttons and error messages are never hidden by animation". After a step change the page scrolls the main column to the top (minus the sticky offset) and focuses the step heading. Header copy changes: the H1 intro shows on step 1 only, and steps 2+ show the slim "Planning your private trip".
- All client.

#### Help components — `components/help`
- **HelpSearch:** `Input` search 56px (max 640) plus a clear button. The result line "N answers for 'refund'" / "No answers for 'visa'" uses `aria-live="polite"`. Matching: every term longer than 1 character must appear in the question or answer. Matches are highlighted and auto-expanded. Category counts update. Views 1c and 1d.
- **CategoryNav:** desktop is a sticky (top 96) 240px column of 44px link rows with counts. Mobile is a horizontal scroller of link `Chip`s. Links point to `#cat-{id}`.
- **FaqCategory:** H2 `clamp(26px,2.6cqi,36px)` (not in the type scale), then `Accordion` items.
- **NoResults:** between hairlines, H2 `clamp(28px,3cqi,40px)` "No answers for that yet." (fixed wording), a lead, then primary "Ask on WhatsApp" (icon) plus secondary light "Clear search".
- **PolicyCard:** a light hairline grid with max 2 columns (MIN 280). Title 20/500, summary 15, an optional refund **table** (header 13 `ink-text-3`, rows 15 with a right-aligned tabular %), then a `Disclosure` "Read the full policy ▾" with paragraphs. Annotations: "PLACEHOLDER · All policy and legal text is placeholder…" and "MATCH · Advance %, refund schedule and reply time must match Tour Detail, the planner and these FAQs exactly".

#### Legal components — `components/legal`
- **TableOfContents:** desktop is sticky (top 96) at 240px with a "Contents" label and numbered 44px link rows (number 22px `ink-text-3`). Mobile is a `Disclosure` "Contents (9) ▾" whose links close it. Client on mobile.
- **LegalSection:** `section` with an `id` (scroll-margin 96), H2 `clamp(22px,2.2cqi,28px)` with the number "1." in `ink-text-3`, then paragraphs 17/1.65 `ink-text-2`. The article is max 35em. It ends with "Questions about this policy? Email [address]."
- **Template:** "/privacy and /terms share this layout; ?doc=terms loads the Terms". Views 3c shows Terms as title plus contents with a body placeholder.

#### Contact components — `components/contact`
- **ContactChannelCard** ("02 Ways to reach us"): a hairline grid, `2fr 1fr 1fr` at ≥ 1100 and 1 column below. The WhatsApp cell has a label with icon ("WhatsApp · fastest"), the number at `clamp(28px,3.4cqi,48px)`, a line, and primary 52 "Chat now". The Phone and Email cells have a label, the value 22/500 and a line.
- **OnTripPanel** ("03 On a trip right now"): a **light** block with **8px radius** inside the dark page (`role="region"`). Eyebrow 13/600, H `clamp(26px,3cqi,40px)`, number `clamp(22px,2.4cqi,32px)`/600, primary 56 "Call travel support" (`tel:`).
- **OnTripMobileBanner:** mobile only. A full-width 52px `mist-50` strip below the header: "On a trip right now? Get help ↓". Clicking it scrolls to `#on-trip` (offset 88) and focuses the call button. Client.
- **QuickLinks** ("05 Quick links"): a `SectionLabel`, then big link rows (min-height 64, `clamp(22px,2.4cqi,32px)`/500 with →, hairlines) plus "Follow the trips" with three quiet 44px social buttons.
- Annotations: "NO FORM · WhatsApp and phone are the main channels for now"; "MATCH · Reply time must match the planner, Help and Tour Detail".

#### About components — `components/about`
- **PrincipleCell** ("03 How we travel"): number 13 `text-3` "01", title 20/500, text 15. Text grid MIN 240, max 4 columns.
- **VehicleCard** ("05 Vehicles and safety"): `MediaFrame` 4:3, name 18/500, desc 14. A 2-column hairline grid plus a full-width row "Average age of our fleet: [X] years".
- **CheckList** ("How we keep you safe"): rows with an 18px square ✓ badge (`text` fill, **0 radius**) and text 15/1.55, hairlines.
- **StatCell** ("06 In numbers"): value `clamp(40px,4.4cqi,64px)`/300 tabular, label 14 `text-2`. Grid MIN 165, max 4 columns. No top label, unlike TrustStrip.
- Founder `figure` ("02 Our story"): portrait 4:5 plus name 18/500 and "Founder".

#### `StepCell` — `components/steps/StepCell` (Homepage "04 How it works")
- Numeral `clamp(56px,6cqi,88px)`/300 tabular with a `→` (20 `text-3`) on steps 1–3, title 20/500 (margin-top 24), description 15/1.55 `text-2` (max 300). An `<ol>` hairline grid, MIN 260, max 4 columns.
- Step 3 copy becomes "…by cash or bank transfer" (override). Static.

---

## 3. Page sections (`/sections`)

The shared header, mobile menu and footer live in `components/layout` instead (PRD #32).

### 3.1 Page × shared-section matrix

✓ = present. `v` = present as a variant (see notes). Page labels are the `data-screen-label` values.

| Section | Home | Tours | Tour Detail | Destination | Planner | About | Help | Contact | Legal |
|---|---|---|---|---|---|---|---|---|---|
| `SiteHeader` (+ `MobileMenu`) | ✓ (scroll-spy) | ✓ active Tours | ✓ active Tours | ✓ active Destinations | ✓ (no active; the design's menu lacks the WhatsApp CTA, added in PRD #32) | ✓ active Guides | ✓ | ✓ | ✓ |
| `SiteFooter` | ✓ 10 | ✓ 07 | ✓ 13 | ✓ 11 | ✓ | ✓ 11 | ✓ 11 | ✓ 11 | ✓ 11 |
| `HomeHero` (video + Display word) | ✓ 01 | | | | | | | | |
| `PhotoHero` (back link + H1 + FactsRow) | | | ✓ 01 | v 01 (display name, lead) | | | | | |
| `PageHeader` (text H1 + lead) | | ✓ 01 | | | v 01 (light, step-aware) | v 01 (long H1 + wide photo) | v 01 (light + search) | v 01 (with SectionLabel) | v 01 (light, "Last updated") |
| `BrandStatement` | ✓ 02 | | | | | | | | |
| `TourCardsSection` (H2 + TourCardGrid) | ✓ 03 Departures | (results) | ✓ 12 Related | ✓ 07 Tours (+ see-all cell) | | | | | |
| `HowBookingWorks` (Steps) | ✓ 04 | | | | | | | | |
| `RouteMapSection` | ✓ 05 | | | | | | | | |
| `DestinationsGrid` | ✓ 06 | | | v 10 Other destinations | | | | | |
| `GuidesGrid` | ✓ 07 (static) | | | | | v 04 (opens profile) | | | |
| `ReviewsSection` | ✓ 08 (long H2 + summary) | v 05 (compact, no H2, summary) | ✓ 09 (H2 + summary) | v 09 (H2, no summary) | | v 09 (long H2, no summary) | | | |
| `TrustStrip` | ✓ 09 | ✓ 06 | v (3-cell mini, inside 10 Final CTA) | | | | ✓ "09" | ✓ "09" | |
| `PrivateTripBanner` | | ✓ 04 (inside results) | | ✓ 08 | | | | | |
| `ClosingCta` (H1-size H2 + 56px buttons) | | | ✓ 10 Final CTA (+ lead + mini trust) | | | ✓ 10 Closing CTA | ✓ 04 Still need help (+ lead) | | |
| `FaqSection` (Accordion list, light) | | | ✓ 11 | | | | v 02 (categories + search + nav) | | |
| `VisitOffice` | | | | | | ✓ 08 (4 rows, 2 buttons) | | v 04 (2 rows, 1 button) | |
| `EmptyState` | | ✓ (no results) | | | | | v (no search results) | | |
| `FiltersBar` + sheets | | ✓ 02 | | | | | | | |
| Tour-detail-only sections | | | 02 Quick facts, 03 Overview, 04 Highlights, 05 Itinerary, 06 Included, 07 Hotels, 08 Dates and prices, BookingAside, StickyBar, Sheet | | | | | | |
| Destination-only sections | | | | 02 Overview, 03 Season calendar, 04 Places to see, 05 Getting there, 06 Good to know | | | | | |
| Planner-only | | | | | Steps 1–3, Review, Success, Aside, SummaryBar, BottomBar | | | | |
| About-only | | | | | | 02 Our story, 03 How we travel, 05 Vehicles and safety, 06 In numbers, 07 Credentials, ProfileDialog | | | |
| Help-only | | | | | | | 03 Policies | | |
| Contact-only | | | | | | | | 02 Ways to reach us, 03 On a trip now, 05 Quick links, mobile banner | |
| Legal-only | | | | | | | | | 02 Body (TOC + sections) |

### 3.2 Shared sections, in detail

#### `SiteHeader` / `MobileMenu` — `components/layout` (built in PRD #32)
- Sticky, 72px, `rgba(12,18,22,.86)` with `backdrop-filter: blur(18px) saturate(140%)` (M3 "frosted"; solid `ink-900` when unsupported), bottom hairline, `data-surface="dark"`. Contents: `BrandMark`, then on desktop a nav (14/500, gap 32, min-height 44 per link, active item gold) and the header WhatsApp button. `SiteHeader` is server-rendered; only `NavLinks` (reads the path, and on the Homepage follows the scroll) and `MobileMenu` (open state) are client components.
- **Mobile < 820:** a WhatsApp `IconButton` 44 plus the menu `IconButton` 44.
- **MobileMenu:** the `Sheet` drawer (side), titled "Menu", with the nav links in the `footerNav` role (min-height 44, hairlines, active item gold) and a primary 56 "Plan on WhatsApp" on every page. It closes on link tap, the close button, the backdrop and Escape, returning focus to the menu button. *(The design shows a panel below the header with no Escape or focus handling and no WhatsApp button on the Planner; PRD #32 replaced it.)*
- **Nav items:** Tours (→ `/tours`), How it works (→ `/#how`), Destinations (→ `/#destinations`), Guides (→ `/about#guides`), Reviews (→ `/#reviews`). On Home, **scroll-spy** marks How it works, Destinations or Reviews (`aria-current="location"`) once that section's top is above 40% of the viewport (built in PRD #39; Tours and Guides aren't marked there).

#### `SiteFooter` — `components/layout/SiteFooter` (static, built in PRD #32)
- Identical on all 9 pages. `SectionLabel` "Contact" (240 column), then large nav links `clamp(40px,5.2cqi,76px)`/500 (Tours, Destinations, Private trips, About us, Reviews), then a right column (`flex:0 1 380px`) with an intro 17, primary 56 "Chat on WhatsApp" and `KeyValueRow`s (WhatsApp, Phone, Email, Office with address and hours).
- Bottom bar (margin-top 96, hairline, 13px `text-2`): "© {build year} {brand} · DTS Licence No. {licence}" and links (Instagram, Facebook, YouTube, Help, Contact, Privacy, Terms). Placeholder phone, email and social values show as plain text.
- The design's `id="whatsapp"` anchor isn't used: every WhatsApp link goes to `wa.me`.

#### `HomeHero` — `sections/HomeHero` (client for scroll effect)
- `clamp(700px,100vh,980px)`, `margin-top:-72px`. Layers: video (placeholder stripes 12/24), scrim gradient, `ink-900` dim layer (opacity 0 animated to .8), "VIDEO PLACEHOLDER" note box. At the bottom: a lead (max 460) and buttons (`flex:0 1 420px`; primary "Explore Tours →" and secondary "Plan on WhatsApp" with the .25 fill), then the Display word "NORTH" (27cqi/600/.74).
- **M1:** the video blurs 0 → 16px, scales to 1.08 and darkens to 80% as it scrolls away. Reduced motion keeps it static.

#### `PhotoHero` — `sections/PhotoHero`
- TD: min-height `clamp(600px,50cqi,740px)`. Destination: `clamp(620px,52cqi,780px)`. Both use `margin-top:-72px`, a scrim gradient variant, and padding-top 96. At the top: back `TextLink`, PHOTO note box, annotation chips. At the bottom: the route line (TD, 15/500 `text-2`) or region (Destination), an H1, an optional lead (Destination), and `FactsRow`.
- **TD H1:** `clamp(48px,7.2cqi,108px)`/500/.95/−.05em. **Destination H1:** display-like `min(20cqi, 150/len cqi)`/600/.8/−.065em, nowrap. Static.

#### `PageHeader` — `sections/PageHeader`
- Padding `clamp(64px,8cqi,128px) P clamp(40–48px…)`, a headline-row layout, H1 `clamp(40px,6.4cqi,92px)` and a lead 17.
- **Variants:** Tours (dark). Planner (light; slim "Planning your private trip" after step 1, padding 28). About (H1 at **long H2 size** plus a full-width `MediaFrame` 21:9 or 4:3). Help (light plus `HelpSearch`). Contact (with `SectionLabel` "Contact"). Legal (light plus "Last updated [date]").

#### `TourCardsSection` — `sections/TourCardsSection`
- H2 plus an optional right meta block (Home: "Prices per person, twin sharing…" plus "All tours →"), then `TourCardGrid`. Home has max 4 columns, TD and Destination max 3. Margin-top 48 (TD, Dest) or 48 after notes (Home).

#### `HowBookingWorks` — `sections/HowBookingWorks` (Home only)
- H2 "How booking works" and four `StepCell`s.

#### `ReviewsSection` — `sections/ReviewsSection`
- A header row (H2, plus an optional `RatingSummary` aligned bottom-right), then a `ReviewCard` grid (text grid with bleed).
- **Variants:** Home (long H2), TD (standard H2), Destination (standard H2, no summary, grid margin 56), About (long H2, no summary), Tours (no H2, only the summary, compact cards, section padding `clamp(64px,7cqi,112px)`).

#### `TrustStrip` — `sections/TrustStrip` (static)
- A section with border-top and no vertical padding. A text hairline grid (MIN 165, max 4 columns, no outer top or bottom border, bleed clipped). Cells: label 13 `text-3`, value `clamp(26px,2.6cqi,38px)`/500, note 14 `text-2`.
- Cells: DTS licence / Operating / Trips completed / We accept. The last value is 17/500 and becomes **"Cash · Bank transfer"** (override; every page's copy is stale).
- Identical on Home, Tours, Help and Contact. **Mini variant** inside the TD Final CTA: 3 cells, value 16/500, padding `20px P 24px`, min 200.

#### `PrivateTripBanner` — `sections/PrivateTripBanner`
- A flex row: `MediaFrame` 16:10 (max 560), then H2 standard, lead 17, primary 52 "Plan a private trip →" (Planner, with `?dest=` on Destination) and secondary 52 "Ask on WhatsApp".
- Tours: inside the results with a border-bottom only, between the card rows, hidden when empty, headline "Plan a private trip for your family or team". Destination: its own section with a border-top, headline "{Destination}, on your own dates". Static.

#### `ClosingCta` — `sections/ClosingCta`
- Padding `clamp(88px,10cqi,160px)`, H2 at **H1 size**, an optional lead, then a 56px button pair (max 520).
- TD "Hold your seats with a [X]% advance": "Reserve with [X]% advance →" (opens the sheet on compact; DESIGN says it opens WhatsApp) plus "Ask on WhatsApp", then the mini trust strip. About "Start planning your trip north": Explore tours plus Plan a private trip (no icon). Help "Still have a question? Ask us on WhatsApp": a primary *with WhatsApp icon* "Ask on WhatsApp" plus secondary "Call us".

#### `FaqSection` — `sections/FaqSection`
- TD: light, H2 "Questions people ask before booking", a single `Accordion` list (first item open). Help: categories, search, sticky nav and deep links (see `components/help`). Share the `Accordion` primitive. Keep the two sections separate.

#### `VisitOffice` — `sections/VisitOffice`
- About "08 Visit us" and Contact "04 Visit the office". Same H2 (long size) "Plan your trip over chai at our Lahore office", `KeyValueRow`s, a buttons row, and a 4:3 photo on the right.
- About: 4 rows (Office, Open, Phone, WhatsApp) plus "Get directions →" and secondary "WhatsApp first". Contact: 2 rows plus "Get directions →" (Google Maps, new tab).

#### `GuidesGrid` / `DestinationsGrid` — `sections/…`
- H2 plus an image-card hairline grid. Guides: MIN 150, max 4 columns, 8 cards. Destinations: MIN 160, max 6 columns (Home) or 5 columns (Destination "Other valleys").

#### `EmptyState` — `sections/EmptyState` (or per-feature)
- Tours no results and Help no results share the pattern: fixed wording H2, a lead, then primary plus secondary 52. Sizes differ (Tours standard H2; Help `clamp(28px,3cqi,40px)`).

### 3.3 Page-specific sections (one page each)
- **Home:** `BrandStatement` (long H2 with **word-by-word reveal M2**, 16% → 100% opacity on scroll, homepage only; body 17 plus "Meet the team →" aligned right, max 500), `RouteMapSection` (`RouteMap` plus `RouteStopList`).
- **Tour Detail:** `QuickFacts`, `TripOverview` (long H2, two paragraphs, `SuitabilityList`), `Highlights`, `Itinerary`, `Included` (light; **bleeds full width** to cover the main column only: `margin-right: calc(-1 * (444px + P))` when the aside is shown), `Hotels`, `DatesAndPrices` (light, same bleed), `BookingAside`, `BookingStickyBar` and `BookingSheet`. Main column sections use `clamp(64px,8cqi,120px)` padding and an H2 margin-top of 20.
- **Destination:** `DestinationOverview` (H2 plus right-aligned paragraphs, max 560), `SeasonCalendar`, `PlacesToSee`, `GettingThere`, `GoodToKnow` (light hairline grid MIN 260, max 3 columns, title 18/500 plus text 15). Template annotation: "One template filled from data: hero, facts, season months, attractions with coordinates, route legs, notes, linked tours". "SEO · `<title>Hunza tours from Lahore | [BRAND NAME]</title>`". "Template check" Views (Murree) render the hero and calendar only.
- **Planner:** the whole page is light (`data-surface="light"`) except the header, footer and mobile bottom bar.
- **About:** `OurStory`, `HowWeTravel`, `VehiclesAndSafety`, `InNumbers`, `Credentials` (`SectionLabel` plus label-column rows, max 820; "Remove this row if none").
- **Help:** `Policies` (H2 plus "Last updated [date]" aligned right, `PolicyCard` grid).
- **Contact:** `WaysToReachUs`, `OnTripNow`, `QuickLinks`, `OnTripMobileBanner`.
- **Legal:** `LegalBody` (TOC plus sections).

---

## 4. Layout patterns (implement as CSS utilities or tiny layout components)

| Pattern | Spec | Where |
|---|---|---|
| **Section shell** | `border-top: 1px line` (or `line-light` on light), padding `var(--section-y) var(--margin)` = `clamp(72px,9cqi,144px) clamp(20px,3.4cqi,48px)`; brand statement and closing CTAs `clamp(88px,10cqi,160px)` | every page |
| **Section header row** | `display:flex; flex-wrap:wrap; gap:24px 48px`; optional label `flex:0 0 240px`; content `flex:999 1 600px; min-width:0`. Most sections render **only** the content column (no label). Optional right-aligned meta via an inner `flex-wrap; justify-content:space-between; align-items:flex-end` (Home Departures, all Reviews, Help Policies) | all |
| **H2 sizes** | standard `clamp(34px,4.6cqi,66px)`/1/−.04em, max-width 720–820; long (> ~44 chars) `clamp(32px,3.9cqi,56px)`/1.08/−.03em; closing CTA uses H1 `clamp(40px,6.4cqi,92px)`/.98/−.045em | all |
| **Hairline grid, capped auto-fill** | `display:grid; gap:1px; background: line; border-top/bottom: 1px line; grid-template-columns: repeat(auto-fill, minmax(max(MIN, calc((100% - (N-1)px)/N)), 1fr))`. Cells `ink-900` (or `mist-50` on light with `line-light` background). **Open variant** (TD highlights and hotels): each cell's 1px outline draws the lines, so a part-filled last row ends cleanly | see table below |
| **Text-grid bleed** | `margin-left/right: calc(-1 * P); clip-path: inset(0 P)` with `P = clamp(16px,1.7cqi,24px)`; cells `padding: Y P` | steps, reviews, trust strip, facts, notes, policies, seasons, principles, stats, suitability, inclusions, Contact ways |
| **Image-card cells** | photo full-bleed in the square cell with an 8px frame; text block `padding: Y P` | destinations, guides, highlights, hotels, vehicles, other destinations |
| **List rows** | `padding:14px 0` (12–20 seen); `border-bottom: 1px line`; top border on the list. Justified pair, or fixed label column (100/110/120/200px) | footer, Visit us, Credentials, Getting there, summaries, profile, itinerary `<dl>` |
| **Two-column with sticky side** | flex, gap 48–64. Side column fixed width (240 nav, 340 map, 380 aside), `position:sticky; top: 88–104px` | TD (booking aside, itinerary map), Help (category nav), Legal (TOC), Planner (aside), Destination (places map) |
| **Media + text split** | `flex:1 1 320–440px` children, gap `32–56px`, wraps | Home route map, About story / visit, Contact visit, PrivateTripBanner, Destination places |
| **Light-surface section** | `data-surface="light"`, `mist-50` background, `ink-text` colour, `line-light` hairlines | TD 06 and 08 and 11, Destination 06, Help (01–03), Legal (01–02), Planner (whole page), Contact on-trip panel |
| **Frosted sticky bar** | `rgba(12,18,22,.82–.92)` + `blur(18px) saturate(140%)`, hairline `rgba(241,238,232,.12)` or `line` | header, Tours filter bar, TD sticky bar, Planner bottom bar; light variant `rgba(238,241,243,.92)` for Planner progress and summary |
| **Image placeholder** | see `MediaFrame` | everywhere |
| **Annotation chips** | dashed 1px `text-3` (or `ink-text-3` on light), Geist Mono 11px, 6px radius, prefixes M1–M5, RULE, URL, SEO, SAVE, WHATSAPP, MOTION, LINKS, REAL ONLY, PLACEHOLDER, MATCH, TEMPLATE, NO FORM, REDUCED MOTION. **Designer notes, not UI** | all pages when `showNotes` |
| **Cards rise (M4)** | `data-rise` cells: translateY 40px → 0, .9s `cubic-bezier(.2,.7,.2,1)`, stagger 90ms × (index mod columns); `data-rise-fade` photo opacity 0 → 1; only for elements below the fold at load; IO threshold .12 | Home departures, TD highlights and related, Tours results (first load), Destination tours |

Hairline grid MIN/N values found:

| Grid | MIN | Max cols | Page |
|---|---|---|---|
| Tour cards | 280 | 4 (Home) / 3 (TD, Dest) / explicit 1-2-3 (Tours) | Home, TD, Dest, Tours |
| How it works | 260 | 4 | Home |
| Destinations | 160 | 6 / 5 | Home / Dest |
| Guides | 150 | 4 | Home, About |
| Reviews | 290 | 3 | Home, TD, Tours, Dest, About |
| Trust strip / stats | 165 | 4 | Home, Tours, Help, Contact / About |
| Quick facts | 160 | 5 | TD |
| Hero facts | 150 (gap 24) | 4 | TD, Dest |
| Highlights | 160 | 3 | TD |
| Suitability / Included | 260 | 2 | TD |
| Final CTA trust | 200 | 3 | TD |
| Season notes | 240 | 4 | Dest |
| Good to know | 260 | 3 | Dest |
| Principles | 240 | 4 | About |
| Vehicles | 200 | 2 | About |
| Policies | 280 | 2 | Help |
| Hotels | fixed 5 / 1 (built: 160, max 5, never more than the stays) | — | TD |
| Months | fixed 12 / 6 | — | Dest |
| Contact ways | fixed `2fr 1fr 1fr` / 1 | — | Contact |
| Planner destination cards | 150, `auto-fill`, gap 8 (not hairline) | — | Planner |

---

## 5. Inconsistencies (design vs design, and design vs DESIGN.md)

**Buttons**
1. **Primary height inside panels.** DESIGN says 48 in cards and panels. The BookingPanel Reserve and Join waitlist are **52** while the panel's "Ask on WhatsApp" is **48** (`BookingPanel:88-96`). TourCard is 48. TD sticky bar and Planner bottom bar are 48.
2. **Closing CTA vs other 56s.** 56 is used for closing CTAs (TD 10, About 10, Help 04) as DESIGN states, but also for the footer button, the mobile-menu button and Contact "Call travel support". The empty state, PrivateTripBanner, Contact "Chat now", Get directions and the Planner all use 52.
3. **Header "WhatsApp us"** is a 44px button with `rgba(241,238,232,.5)` border and 14px label, which is not one of the DESIGN §7 variants. The mobile header icon buttons use the same .5 border, not `line-strong`.
4. **Font size and padding drift:** 48px buttons use 15px text (DESIGN says 16/500). Secondary padding is `0 24px` and primary `0 28px`. TD departure-row buttons use `0 22px`. Homepage hero secondary alone has an `rgba(12,18,22,.25)` fill.
5. **Join waitlist has three looks:** quiet (TourCard, `line-strong`), **gold primary** (BookingPanel sold-out), quiet-light (TD departure rows). DESIGN lists Join waitlist as Quiet.
6. **"Selected ✓"** in TD departure rows uses a gold fill with a `gold-deep` border as a *selection state* (`Tour Detail:329`). This conflicts with "gold means action" and with every other selected state (ink-800 or inverse fill).
7. **Quiet buttons on light** use `line-strong-light` (Back, Join waitlist). Secondary on light uses `ink-text`. Both appear side by side in Planner review (Back quiet, Request a call back secondary) with no documented rule for when to use which.
8. **Disabled look-alike:** the Tours filter sheet "No trips match" is styled as disabled (`line` fill, `text-3`) but stays an active button that closes the sheet (`Tours:287,538`).

**Radius (DESIGN §7: 2 / 6 / 8 / 999)**
9. **Selectable option boxes with 0 radius:** BookingPanel date options and room options (`BookingPanel:40,62`), Planner destination cards (`Trip Planner:128`), Tours dropdown rows (fine as rows, but the panel itself is 0). Decide whether these are "inputs" (2px) or "cards" (8px).
10. **Panels with 0 radius:** Tours dropdown panels (`Tours:91,113`), Planner aside boxes, review box and message preview (`Trip Planner:259,271,313,319,332`). All four sheets and the About drawer have no radius, only a border-top or border-left. DESIGN says panels, drawers, sheets and dropdowns are 8px. By contrast, the BookingPanel aside (`Tour Detail:346`) and Contact on-trip panel (`Contact:102`) **are** 8px.
11. **Checkbox radius:** 0 in the Tours dropdown (`boxRadius:'0'`, `Tours:494`) and 2px in Planner cards (`Trip Planner:131`). About safety ✓ badges are 0.
12. **Route map frame** (Home) has a 1px border with no radius. TD and Destination maps have no frame at all.
13. **Help search clear** is an icon button with **no border**. Every other icon button has one.
14. Design System page still says "Radius 0 on surfaces · 999 on buttons + chips" (`Design System:90`). Stale.

**Chips and tags**
15. *(Decided: every tag is 28px, padding 0 12px; see the decisions at the top.)* **Status tag heights:** urgent is 28px with padding 10. Sold out is **30px** with padding 12 (`TourCard:21,24`). The Destination category tag is 26px.
16. **Three different "selected" chip styles:** desktop filter trigger and removable chip use an `ink-800` fill with a `text` border. Mobile filter-sheet option uses a **solid `text` fill with ink text**. Light-surface planner chips use a solid `ink-text` fill with `mist-50` text. The first two are both on dark on the same Tours page.
17. Chip and dropdown **hover and focus states** are not designed anywhere.

**Accordion and disclosure**
18. **Two expand idioms:** the 44px `+` icon box that rotates 45° (TD FAQ, Help FAQ: identical, good) and a **caret ▾ that rotates 180°** (Help policy "Read the full policy", Legal mobile contents, Planner summary bar, Tours dropdown triggers). TD opens the first FAQ by default; Help opens none.

**Inputs**
19. **Control borders on light:** default input, select and textarea borders use the hairline `line-light #CBD2D8` (`Trip Planner:146,193,216,228,237,251`, `Help:70`). DESIGN specifies control borders on light = `line-strong-light #7D8992` (3.2:1). `#CBD2D8` likely fails 3:1 for non-text contrast on mist-50.
20. **Input heights:** 52 (planner), 56 (Help search), 44 (age select), 52 (dark booking select).
21. **Error colour** is `gold-deep` (border plus "!" badge). DESIGN has no error token, and gold is reserved for action and highlights. It needs a decision.
22. **Date inputs** set `color-scheme:dark` on a light field (`Trip Planner:146-147`), which is likely a bug (it gives a dark native picker on a light form).
23. **Focus states** for inputs, chips and rows are not drawn anywhere. Only the DS shows the button focus ring.

**Cards and grids**
24. **ReviewCard:** two specs. Default (15px stars, clamp 19–23 quote, 32/36 padding) vs Tours compact (13px stars, 17px quote, 24/28 padding, 14/13 caption). DESIGN §9 only describes 15px stars.
25. **DestinationCard:** Homepage is 3:4, 22px name, "Best season" plus months. Destination "Other valleys" is 4:3, 20px name, "Best · …" plus tour count. The Planner choice card is 16:10 light.
26. **GuideCard:** Homepage cards are non-interactive; the same people on About open profiles (with "View profile"). Homepage nav "Guides" goes to About#guides, but the Homepage cards don't link. *(Settled in PRD #39: Homepage cards link to `/about#guide-{slug}`.)*
27. **Hairline grid implementation:** the Tours results grid uses per-card `border-right`/`border-bottom` (computed from column count) instead of `gap:1px` on a line background (`Tours:154-156,473`). TD Hotels uses a fixed `repeat(5,…)`/`1fr` (no capped auto-fill, so nothing between 1 and 5 columns). Contact ways uses a fixed `2fr 1fr 1fr`.
28. **Bleed bug:** the Homepage "How it works" `<ol>` sets the bleed margins and then `margin:64px 0 0`, which resets them (`Homepage:138`). The first and last step text therefore sits P inside the page margin, unlike every other text grid. *(Fixed in PRD #39: the shared text-grid bleed holds.)*
29. **Caption insets** on placeholders vary: 20/16, 16/14, 14/12, 12/10, 10/8, 6/5.
30. **Price sizes:** 24 (TourCard), **30** (BookingPanel, not in the type scale), 18 (hero, sticky bar, rows), 16 (room rows).
31. **Seats copy varies:** "3 of 16 seats left" (card), "Only 3 seats left" (tag, panel, TD hero, TD row), "14 seats left" (panel), "14 of 16 seats left" (TD row), "Sold out" (panel), "Sold out · waitlist open" (TD row), "0 of 12 seats · waitlist open" (card). Pick one formatter in `lib/utils`.

**Sections and typography**
32. **Section labels:** DESIGN §6 says labels appear only on About Credentials, Contact Quick links and the footer. **Contact "01 Header" also has a "Contact" label** beside H1 "Talk to a person" (`Contact:66`).
33. **Headline sizes outside the scale:** TD hero H1 `clamp(48px,7.2cqi,108px)`. Destination name `min(20cqi,150/len cqi)`/600. Help category H2 `clamp(26px,2.6cqi,36px)`. Help no-results H2 `clamp(28px,3cqi,40px)`. Legal section H2 `clamp(22px,2.2cqi,28px)`. Contact numbers `clamp(28px,3.4cqi,48px)` / `clamp(22px,2.4cqi,32px)`. About profile H2 32px. About stats `clamp(40px,4.4cqi,64px)`/300.
34. **Reviews H2 sizes:** Home and About use the long size; TD and Destination use the standard size. The rating summary appears on Home, TD and Tours but not Destination or About.
35. **Section padding:** TD main-column sections use `clamp(64px,8cqi,120px)` with an odd H2 `margin-top:20px`. Tours reviews use `clamp(64px,7cqi,112px)`. The standard is `clamp(72px,9cqi,144px)`.
36. **Decorative numbering:** About "How we run every trip" numbers four principles 01–04 (`About:99-102`). These are not a sequence, which conflicts with CLAUDE.md §8 "no decorative numbering".
37. **Mono in UI:** Help "Link to this answer · /help#id" (`Help:127`) and the About profile URL line (`About:265`) use Geist Mono in production UI. DESIGN §3 says mono is placeholders only.
38. **Screen-label numbering:** the Help and Contact trust strips are labelled "09 Trust strip" and their footers "11 Footer" (copy-paste). Harmless, but don't rely on the numbers.

**Header, menu, overlays**
39. **Planner mobile menu has no "Plan on WhatsApp" button** (`Trip Planner:51-57`). Every other page has it. *(Fixed in PRD #32: every page's menu has it.)*
40. The **Homepage** header and footer use the simple-icons CDN WhatsApp image with `filter:invert(1)`. Other pages use local `icons/whatsapp-light|dark.svg`. The README notes `icons/whatsapp.svg` is missing.
41. **Sheet anatomy differs:** TD and Tours sheets have a grab handle and a title header. The About profile sheet has no handle and a counter, prev/next and close header. **Escape / focus-return / scroll-lock are only implemented for the About profile and Tours dropdowns.** The TD booking sheet, Tours filter and sort sheets and the mobile menu have none. *(The `Sheet` base component (PRD #8) adds them to every sheet; the mobile menu uses it since PRD #32.)*
42. **Light-on-dark backgrounds:** the planner progress and summary bar use a light frosted bar, while the planner bottom bar on the same page is dark frosted.

**Stale content (apply the overrides)**
43. **Payments:** "Bank transfer · JazzCash · Easypaisa · Card" appears in the BookingPanel (`BookingPanel:72`), TrustStrip on Home, Tours, Help and Contact, the TD Final CTA mini trust, Home step 3 ("bank transfer, JazzCash or Easypaisa"), the TD FAQ "How do payment and the advance work?" and the Help FAQ "How can I pay?" and policy "Payments and the advance". All become cash and bank transfer only.
44. **Apricot:** DS tour-card spec rows "Apricot star", "apricot when ≤ 3" (`Design System:122-123`), DS don'ts "The old apricot #D9B44A" (typo), and Views pages `a:hover{color:#F4A66A}`. Use gold.
45. **Reserve / call back:** the TD Final CTA "Reserve with [X]% advance" links to `#dates` (desktop) or opens the booking sheet (compact). The BookingPanel Reserve links to `#reserve`. Planner "Request a call back" jumps straight to success. Per the override, each opens WhatsApp with a pre-filled message.

---

## 6. Open decisions, by the PRD that settles them

Each one is asked (grilled) at the start of its PRD. A recommendation is noted where one is obvious.

**Base components PRD**
- All settled (see the decisions at the top of this file).

**Trip Planner and Help PRDs (inputs)**
- Hover and focus states for inputs, selects and textareas are not designed (§5 item 23). Decide when the first input is built.

**Content system PRD**
- One seats-copy formatter for all the variants in §5 item 31.
- "We accept" copy read from `content/settings.json`: "Cash · Bank transfer".

**Layout shell PRD**
- All settled (see the decisions at the top of this file).

**Homepage PRD**
- All settled (see the decisions at the top of this file).

**Tour Detail PRD**
- Reserve flow: does the final CTA open WhatsApp directly, or keep "choose date → panel Reserve → WhatsApp"?
- Join waitlist: presumably opens WhatsApp with a waitlist message, from the card, the departure row and the panel.
- The two sticky-panel rules: the side panel appears at ≥ 1100px width, and its compact (select) mode at viewport height < 920px. Also the side map at ≥ 1280px with per-day mini maps below that.

**Tours PRD**
- Mobile filter sheet: filters apply live and "Show N trips" only closes the sheet. Confirm live-apply rather than apply-on-confirm.

**Destination PRD**
- Hide empty sections (Places to see, Good to know, Reviews) when a destination has no data (Murree)?

**Trip Planner PRD**
- "Request a call back": the pre-filled WhatsApp message, and whether the success screen still follows.
