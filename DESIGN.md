# [BRAND NAME] — Design System

Premium, calm and editorial: a high-end travel brand built on restraint. One dark base, one accent, one typeface, hairline grids, generous space. Photography provides all the colour.

Reference implementations in this project: `Design System.dc.html`, `Homepage.dc.html`, `TourCard.dc.html`, `Homepage Views.dc.html` (390 / 1440).

---

## 1. Principles

- **Dark for imagery, light for reading.** Hero, route map, photography and destination sections sit on Ink 900 (`#0C1216`); photography supplies the colour. Reading-heavy areas sit on Mist 50 (`#EEF1F3`), a cool neutral off-white: Help/FAQ, policies, Legal pages, the Trip Planner form, Destination “Good to know”, and the Tour Detail practical sections (What's included, Dates & prices, FAQs).
- **Gold means action.** Gold `#D9B44A` (deep gold `#7A5A12` on light) is for primary buttons, ratings, active nav, map markers and key highlights only. Never decoration, never a large background.
- **One typeface.** Geist. Large, tight headlines; small, clean body text.
- **Hairlines, not boxes.** 1px lines divide sections and grid cells. No shadows.
- **Headlines carry the section.** No small label repeating the headline.
- **Essentials never wait.** Price, dates, seats left, error messages and every button are visible on first paint and never animated.

---

## 2. Colour tokens

### Dark surface (imagery)

| Token | Hex | Use | Contrast on Ink 900 |
|---|---|---|---|
| `--ink-900` | `#0C1216` | Dark section background | — |
| `--ink-800` | `#121A1F` | Card hover, selected rows | — |
| `--line` | `#253038` | Hairlines on dark | — |
| `--line-strong` | `#5C6871` | Control borders on dark | 3.3:1 |
| `--text` | `#F1EEE8` | Primary text | 16.6:1 |
| `--text-2` | `#B7BFC5` | Secondary text | 10.6:1 |
| `--text-3` | `#8F9AA2` | Captions, meta | 6.6:1 |
| `--gold` | `#D9B44A` | Primary buttons, stars, active nav, markers, links on dark | 9.6:1 |
| `--on-gold` | `#10161A` | Text on gold buttons | 9.0:1 on gold |

Gold button hover `#E3C366`, pressed `#C9A43C`.

### Light surface (reading)

| Token | Hex | Use | Contrast on Mist 50 |
|---|---|---|---|
| `--mist-50` | `#EEF1F3` | Light section background (cool neutral, never cream) | — |
| `--mist-100` | `#E2E7EB` | Hover, selected rows | — |
| `--line-light` | `#CBD2D8` | Hairlines on light | — |
| `--line-strong-light` | `#7D8992` | Control borders on light | 3.2:1 |
| `--ink-text` | `#10161A` | Primary text | 16.4:1 |
| `--ink-text-2` | `#46525C` | Secondary text | 7.0:1 |
| `--ink-text-3` | `#5B6770` | Captions, input placeholders | 5.1:1 |
| `--gold-deep` | `#7A5A12` | Links, accents, search highlights on light | 5.6:1 |

Primary buttons stay gold `#D9B44A` with `#10161A` text on both surfaces. Outlined buttons use `--text` on dark and `--ink-text` on light.

### Rules

- Mark each light block with `data-surface="light"` (header and footer carry `data-surface="dark"`), so default link colours follow the surface. `data-surface="dark"` restores the dark values inside a light block; status tags use it because they always sit on a photo.
- Components use **surface tokens**, never the raw palette (ADR-0011). They default to the dark values and switch inside `data-surface="light"`:

| Surface token | Dark | Light |
|---|---|---|
| `--bg` | `--ink-900` | `--mist-50` |
| `--bg-raised` | `--ink-800` | `--mist-100` |
| `--fg` | `--text` | `--ink-text` |
| `--fg-2` | `--text-2` | `--ink-text-2` |
| `--fg-3` | `--text-3` | `--ink-text-3` |
| `--hairline` | `--line` | `--line-light` |
| `--control-border` | `--line-strong` | `--line-strong-light` |
| `--control-border-soft` | `--text` at 50% | `--ink-text` at 50% |
| `--link` | `--text` | `--ink-text` |
| `--link-hover` | `--gold` | `--gold-deep` |
| `--accent` | `--gold` | `--gold-deep` |
| `--error` | `--gold` | `--gold-deep` |

  Gold, on-gold, gold hover and gold pressed (primary buttons) are the same on both surfaces, so components use them directly. Ratings, markers and key highlights use `--accent`, which turns deep gold on light.
- **Errors** use `--error`: gold on dark, deep gold on light. No separate error colour. An error always pairs the colour with the “!” badge and a written message, so colour is never the only signal.
- Input, select and textarea borders on light use `--control-border` (`#7D8992`, 3.2:1), never the hairline grey.
- Urgency (“Only 3 seats left”) is an **outlined tag**: Ink 900 fill (it sits on a photo), 1px gold border, gold text and a 13px clock icon. Never a filled gold shape.
- **Tags** (`Tag` in the base components): every tag is 28px high (`--tag-h`), 999px radius, 0 12px padding, 13/500 text (the `label` role).

| Tag | Surface | Border | Text | Use |
|---|---|---|---|---|
| Urgent | Always dark (on a photo) | `--gold` | `--gold`, with a 13px clock icon | “Only 3 seats left” |
| Sold out | Always dark (on a photo) | `--control-border` | `--fg` | “Sold out” |
| Category | Follows the page | `--control-border` | `--fg-2` | Heritage, Viewpoint, Lake, Adventure, Meadow (a destination's places) |

- **Chips** (`Chip`): 44px, 999px, 14/500, 0 16px. Variants: toggle (`aria-pressed`), dropdown trigger (`aria-expanded`, caret turns over when open, optional count), removable (the whole chip is the button “Remove filter {label}”, so the tap target is the full pill) and link. Off: `--control-border` border. Hover and selected: `--bg-raised` fill with a `--fg` border, on both surfaces. Never gold. Counts in `--fg-2`.
- **Stepper** (`Stepper`): − value +, inside a named group (“Travellers”). The buttons are 44px icon buttons labelled by the caller (“Fewer travellers” / “More travellers”). The value uses the `stepTitle` role with tabular figures and is announced politely when it changes. At a limit the matching button is `aria-disabled` with the disabled look, and stays focusable so keyboard focus isn't lost.
- **Accordion** (`Accordion`): built on `<details>`, so content opens without JavaScript and the browser handles Enter and Space. Items that share a `name` open one at a time. Rows are divided by hairlines, with a top hairline on the list. The question uses the `stepTitle` role; the answer uses `body` in `--fg-2`, max 740px (`--measure-answer`). Markers: `plus` (44px box with a `--control-border` border; the + turns 45° into × when open) or `caret` (turns over). Only the glyph turns, never the box. A `compact` size is one 52px row at 15/500 with no list lines, for a summary bar (the planner's trip summary on phones).
- **Sheet** (`Sheet`): a modal `<dialog>` opened with `showModal()`. The browser makes the page behind inert, closes it on Escape and returns focus to the trigger. The backdrop (`--backdrop`, Ink 900 at 72%) closes it on click, and page scroll is locked while it's open. Header: title (`stepTitle`), optional actions (a guide profile's counter, previous and next) and a 44px “Close” icon button, which takes focus when the sheet opens. Bottom sheet: full width, max 92% of the viewport height (`--sheet-max-h`), 8px top corners, optional grab handle (36×4px). Side drawer: `min(460px, 100%)` (`--drawer-w`), full height, 8px leading corners. Follows the surface it's opened from. Opening and closing slide from the edge it sits on (`--dur-400`, `--ease-out`); with reduced motion it simply appears.
- **Dropdown** (`Dropdown`): a trigger chip that opens a native `popover` panel. The browser closes it on Escape and on an outside click. The panel sits 8px under the chip, placed with CSS anchor positioning (it flips if it would leave the screen); where anchor positioning isn't supported, a small script places it instead. Panel: min-width 260px (`--dropdown-min-w`), 8px padding, surface background, hairline border, 8px radius. Option rows come from the caller. Used from 820px up; below that, filters and sort open in a Sheet.
- **Ratings:** `StarRating` shows five 15px (or 13px) stars, `--accent` up to the rating and `--hairline` after it, read as “N out of 5 stars”. `RatingInline` shows a 15px `--accent` star, the score (600, tabular, one decimal) and “(count)” in `--fg-3`, read as “4.9 out of 5, 128 reviews” (“1 review” in the singular). The text is built by the rating helpers in `lib/utils`.
- The sticky header uses `rgba(12,18,22,.86)` so it stays legible over light sections.

---

## 3. Typography

**Family:** Geist (Google Fonts, variable 300–700). **Geist Mono** is used *only* for image placeholders and motion annotations, never in production UI.

In code, Geist is loaded with `next/font/google`: it is downloaded at build time, served from the site itself with a size-matched fallback, and exposed as `--font-geist`. The variable font file covers weights 100–900; the design uses 300–700. Geist Mono is not loaded. The `<link>` below is how the design files load it.

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Geist:wght@300..700&family=Geist+Mono:wght@400;500&display=swap">
```

Fluid sizes use container-query units: the page root has `container-type: inline-size` and sizes are expressed in `cqi` (1cqi = 1% of page width).

In code each role is one class in `styles/typography.module.css`, reused with CSS Modules `composes`. Role names describe the look only: the heading element is chosen for meaning, and each page has exactly one `<h1>`. A dash in the line-height column means the role inherits the body line height.

| Role | Class | Size | Weight | Line height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Display (hero word) | `display` | `26cqi` (≈101px @390, ≈374px @1440) | 600 | .74 | −0.05em | One word, e.g. NORTH. Kerning off (`font-kerning: none`): Geist's capital kerning at this size made the gaps uneven (owner feedback, 2026-10-04; the design's 27cqi at −0.065em spans the same width). `white-space: nowrap`, slight negative left margin (−.035em), sits flush to hero bottom |
| Tour hero title | `tourHero` | `clamp(48px, 7.2cqi, 108px)` | 500 | .95 | −0.05em | Tour Detail hero. `text-wrap: balance` |
| Destination hero name | `destinationHero` | `min(20cqi, round(150 / max(length, 5)) cqi)` | 600 | .8 | −0.065em | Fits the name on one line; the component sets `--name-length`. Negative left margin as Display |
| Statement | `statement` | `clamp(40px, 6.4cqi, 92px)` | 500 | .98 | −0.045em | Brand statement, two lines on desktop |
| Section headline | `section` | `clamp(34px, 4.6cqi, 66px)` | 500 | 1.0 | −0.04em | Max-width ~720–820px |
| Section headline, long | `sectionLong` | `clamp(32px, 3.9cqi, 56px)` | 500 | 1.08 | −0.03em | Headlines over ~44 characters (§6) |
| Footer nav | `footerNav` | `clamp(40px, 5.2cqi, 76px)` | 500 | 1.06 | −0.045em | Large stacked links |
| Step numeral | `numeral` | `clamp(56px, 6cqi, 88px)` | 300 | .9 | −0.05em | Tabular figures |
| Trust value | `trustValue` | `clamp(26px, 2.6cqi, 38px)` | 500 | 1.05 | −0.03em | |
| Panel price | `panelPrice` | 30px | 500 | 1.05 | −0.025em | Booking panel. Tabular, `nowrap` |
| Card title | `cardTitle` | 26px | 500 | 1.08 | −0.025em | `text-wrap: balance` |
| Price | `price` | 24px | 500 | 1.1 | −0.02em | Tabular, `nowrap` |
| Destination name | `destination` | 22px | 500 | — | −0.02em | |
| Lead (hero sub) | `lead` | `clamp(18px, 1.6cqi, 22px)` | 400 | 1.4 | 0 | |
| Quote | `quote` | `clamp(19px, 1.6cqi, 23px)` | 400 | 1.42 | −0.01em | `text-wrap: pretty` |
| Step title | `stepTitle` | 20px | 500 | — | −0.015em | |
| Body, large | `bodyLarge` | 17px | 400 | 1.6 | 0 | Longer reading text. Usually `--fg-2` |
| Body | `body` | 16px | 400 | 1.55 | 0 | Page default. Usually `--fg-2` |
| Small | `small` | 15px | inherit | 1.5 | 0 | Dates, rows |
| UI | `ui` | 14px | inherit | 1.5 | 0 | Buttons, nav, meta rows |
| Label / meta | `label` | 13px | 500 | — | +0.01em | Minimum text size anywhere |
| Map waypoint | `waypoint` | 12px | 400 | — | 0 | `--fg-2` |
| Mono placeholder | `placeholderCaption` | 11px Geist Mono | 400 | 1.5 | +0.02em | Image placeholder captions only. In code the system monospace (`--font-mono`), since Geist Mono isn't loaded |

Other sizes in the design files that are not in this table move to the nearest role (see `docs/components.md`).

Use sentence case everywhere: no all-caps labels, and no italics.

---

## 4. Spacing & layout

**Spacing scale (px):** 4 · 8 · 12 · 16 · 20 · 24 · 32 · 48 · 64 · 96 · 144

| Token | Value |
|---|---|
| Page margin | `clamp(20px, 3.4cqi, 48px)` (20 mobile → 48 desktop) |
| Section padding (vertical) | `clamp(72px, 9cqi, 144px)`; brand statement `clamp(88px, 10cqi, 160px)` |
| Label column | 240px fixed |
| Column gutter | 48px (24px row gap when stacked) |
| Header gap → content | 48–64px |
| Header height | 72px |
| Nav breakpoint | below 960px page width the header's nav collapses to WhatsApp + menu buttons (820px until Home joined the nav, ADR-0027) |
| Max content width | full bleed to page margin; design system page caps at 1440px |
| Radius | 2px inputs; 6px every button (incl. icon buttons); 8px cards, panels and photo frames; 999px filter chips and tags only. Full scale in §7 |
| Tap targets | ≥ 44×44px; standard buttons 48–56px tall |

### Section anatomy

```
┌───────────────────────────────────────────────────────────────┐  ← 1px #253038 top border
│  ▲ Section label   │  Section headline (H2)                    │
│  (240px column)    │  optional meta / link aligned right       │
│                                                                │
│  Full-width content (card grid, steps, etc.)                   │
└───────────────────────────────────────────────────────────────┘
```

The header row is a flex row with `flex-wrap: wrap; gap: 24px 48px`. Label: `flex: 0 0 240px`. Content: `flex: 999 1 600px; min-width: 0`. On narrow screens the label wraps above the headline automatically; no media query needed.

---

## 5. Grid & hairline rules

- **Hairline grids:** build card/cell grids as `display:grid; gap:1px; background:#253038;` with each cell on `#0C1216`. Add `border-top` and `border-bottom: 1px solid #253038` to the grid. The gap *is* the line.
- **Open hairline grids:** where the last row is often part-filled (Tour Detail highlights and hotels, About's guides and drivers), each cell draws its own lines instead (a 1px outline meeting its neighbours' in the gap, the outer left and right edges clipped off), so the last row simply ends rather than leaving filled empty cells. In code: `openGrid`/`openCell` in `styles/layout.module.css`.
- **Tour card grids have gaps, not hairlines** (owner feedback, 2026-10-04): 24px between cards side by side (`--tour-grid-gap`), 48px between rows (`--tour-grid-row-gap`), no lines on the grid or its cells. This covers the Homepage's departures, Tour Detail's other trips, Tours' results and a destination's tours. A card's raised hover surface takes the 8px card radius; a destination's "See all" cell is an 8px block with a hairline border.
- **Capped auto-fill columns:** `grid-template-columns: repeat(auto-fill, minmax(max(MIN, calc((100% - (N-1) × GAP) / N)), 1fr))`, where GAP is the column gap: 1px for hairline grids, 24px for tour cards. This gives at most N columns and wraps down to MIN widths without media queries.

| Grid | MIN | N (max cols) | Result @390 | Result @1440 |
|---|---|---|---|---|
| Tour cards (24px gaps, no lines) | 280px | 4 | 1 | 4 |
| How it works | 260px | 4 | 1 | 4 |
| Destinations | 160px | 6 | 2 | 6 |
| Other valleys (Destination; two columns below 820px, an odd last card spans the row) | 160px | 5 | 2 | 5 |
| Guides | 150px | 4 | 2 | 4 |
| Principles (About) | 240px | 4 | 1 | 4 |
| Vehicles (About; beside the safety list) | 200px | 2 | 1 | 2 |
| Policies (Help) | 280px | 2 | 1 | 2 |
| Reviews | 290px | 3 | 1 | 3 |
| Trust strip, and About's numbers | 165px | 4 | 2 | 4 |
| Trust strip, mini (Tour Detail final CTA) | 200px | 3 | 1 | 3 |
| Quick facts (Tour Detail) | 160px | 5 | 2 | 5 |
| Highlights (Tour Detail) | 160px | 3 | 2 | 3 |
| Hotels (Tour Detail; no more columns than stays) | 160px | 5 | 2 | 5 |
| Suitability, inclusions (Tour Detail) | 260px | 2 | 1 | 2 |
| Hero facts (Tour Detail; gaps, not hairlines) | 150px | 4 | 2 | 4 |
| Season notes (Destination) | 240px | 4 | 1 | 4 |
| Good to know (Destination) | 260px | 3 | 1 | 3 |

- **Cell padding rule:** every cell in a hairline grid or divided row has the same inner padding on both sides, so text never touches a divider: **16px on mobile → 24px on desktop** (`P = clamp(16px, 1.7cqi, 24px)`).
  - *Text-only grids* (facts, steps, reviews, notes, trust strip): cells use `padding: Y P`. The grid bleeds outward by P and is clipped back (`margin-left/right: calc(-1 * P); clip-path: inset(0 P)`), so the first column's text still aligns with the page margin and the last column with the right margin, at any column count.
  - *Image-card grids* (destinations, guides, highlights, hotels): photos stay full-bleed in the cell; the text block below uses `padding: Y P` on both sides.
  - Tour cards sit apart with gaps (above) and carry their own 24px inner padding.
- **List rows:** label/value pairs as flex rows, `padding: 14px 0; border-bottom: 1px solid #253038`, with a top border on the list.
- **Sections:** every section after the hero opens with `border-top: 1px solid #253038`.
- Never use drop shadows, card backgrounds, coloured left-border accents, or gradients (except the hero legibility scrim).

---

## 6. Section labels

Removed. The headline introduces each section. A small label (11px logo-mark triangle + 13px/500 name in `--text-2`) is used **only** when a section has no headline of its own: About “Credentials”, Contact “Quick links”, and the footer “Contact” column.

**One owner-approved exception (PRD #86, 2026-10-04):** the Contact page header keeps its “Contact” label in the 240px label column beside the `<h1>` “Talk to a person”, as designed. It's plain text, not a heading. No other header takes a label.

### Headline style

- Plain, specific, varied in length; mostly without a full stop.
- At most two short two-beat lines on the whole site: “Your dates, your group” (Trip Planner) and “{Destination}, on your own dates” (Destination banner).
- Headlines longer than ~44 characters use the long size: `clamp(32px, 3.9cqi, 56px)`, line-height 1.08, letter-spacing −0.03em, max 3 lines (e.g. the homepage brand statement).
- State messages the brief fixed (“No trips match these filters yet.”, “No answers for that yet.”) keep their wording.

---

## 7. Buttons & radius

### Radius scale

| Radius | Applies to |
|---|---|
| 2px | Inputs, selects, textareas, checkboxes |
| 6px | **Every button**: primary, secondary, header “WhatsApp us”, icon buttons (menu, close, prev/next, WhatsApp, accordion +) |
| 8px | Cards, panels (booking panel, drawers, sheets, dropdowns), photo frames, standalone blocks |
| 999px | Filter chips and small tags only |

Cells inside a hairline grid stay square so the 1px lines run unbroken; the photo frame inside such a cell takes 8px. Full-bleed hero media is never rounded.

### Buttons

In code: `Button` and `IconButton` in the base components folder; see them in Storybook (`pnpm storybook`).

| Variant | Style | Use |
|---|---|---|
| Primary | `--gold` fill, `--on-gold` text. Hover `--gold-hover`, pressed `--gold-pressed` | Explore Tours, View Trip, Reserve, Send on WhatsApp, Plan a private trip, Chat now, Get directions |
| Secondary | 1px `--fg` border, `--fg` text, transparent. At 44px the border is `--control-border-soft` (`--fg` at 50%) | Plan on WhatsApp, Ask on WhatsApp, Call us, the header's “WhatsApp us” |
| Quiet | 1px `--control-border` border, `--fg` text | Join waitlist (always quiet), Back, social links |
| Icon | 44 or 48px square, 1px `--control-border` border. Hover: border `--fg` (the tour card WhatsApp hover) | WhatsApp, menu, close, prev/next, stepper − and + |

| Size | Where | Label |
|---|---|---|
| 44 | Header, social links, icon buttons | 15/500 |
| 48 | Cards, panels, sticky bars | 15/500 |
| 52 | Default | 16/500 |
| 56 | Closing CTAs | 16/500 |

Padding is 0 24px for every variant (the design's 28px is off the spacing scale). An optional leading icon (18px, e.g. WhatsApp) and an optional trailing arrow sit 8px from the label; the arrow moves 4px right on hover.

Hover (secondary, quiet): background `--bg-raised` (Ink 800 on dark, Mist 100 on light, the “hover” colours in §2); quiet also brightens its border to `--fg`. Hover isn't designed for these, so it uses the design's hover surface. Focus: 2px outline in the text colour, 3px offset. Disabled (buttons and icon buttons): `--hairline` fill, `--fg-3` text, no hover. A link can't be disabled; render a disabled action as a button. Buttons are never animated in or out.

In every row of tour cards the buttons align at the bottom of the card regardless of title length: the card fills its grid cell, and the price block takes `margin-top:auto` so price, seats and buttons sit together at the bottom.

---

## 8. Tour card

### Anatomy (top to bottom)

1. **Photo**: 4:3 aspect, 8px radius, overflow hidden, striped placeholder until supplied. Status tag top-left at 16px inset (tag rules in §2).
2. **Body**: padding 24px, flex column, fills the height.
   - Route: 13px / 500 / `--text-2`, e.g. “Lahore → Hunza → Skardu”, 10px above the title.
   - Title: H3 26/500.
   - Dates + duration: 15px `--text`, e.g. “12–20 May · 9 days, 8 nights”.
   - Divider: at least 24px space (the price block takes `margin-top:auto`), 1px `#253038`, then 20px.
   - Price block (left, `flex:1 1 auto; min-width:0`): “from” 13px `--text-3`, then “PKR 145,000” 24/500 tabular nowrap, then “per person” 13px `--text-3`.
   - Rating (right, `flex:none`): 15px gold star, score 14px/600, “(128)” `--text-3`.
   - Seats row (16px below): 7px dot + “X of Y seats left”, 14px / 500.
   - Actions (24px above, 8px gap): View Trip (gold primary, flex 1, 48px, 6px radius) + WhatsApp icon (48px, 6px radius). Price, seats and actions sit together at the bottom so buttons align across a row.
3. The card has no border of its own; it sits in a grid with 24px gaps between cards and 48px between rows, no lines (§5). Its raised hover surface has the 8px card radius.

### States

| State | Surface | Photo | Chip | Title / price | Seats row | Actions |
|---|---|---|---|---|---|---|
| **Default** | `#0C1216` | 100%, scale 1 | none | `--text` | dot + text `--text-2` | View Trip gold (primary); WhatsApp border `#5C6871` |
| **Hover** (pointer only) | `#121A1F` (.4s) | scale 1.045 (1s, ease-out) | none | `--text` | `--text-2` | arrow +4px (.3s); WhatsApp border `#F1EEE8` |
| **Urgent** (≤3 seats) | as Default | 100% | outlined tag “Only 3 seats left”: 28px, 999px radius, Ink 900 fill, 1px gold border, gold 13/500 text, clock icon | `--text` | gold dot + gold text “3 of 16 seats left” | as Default (hover still applies) |
| **Sold out** | `#0C1216`, no hover | 40% opacity | “Sold out” pill: Ink 900 bg, 1px `#5C6871` border, `--text` | `--text-2` | `#5C6871` dot, “Sold out · waitlist open” (the shared seats wording) | “Join waitlist” (Quiet) + WhatsApp icon |

Touch devices always show the Default state; nothing depends on hover.

### Data contract

`title, price, route, dates, seatsLeft, totalSeats, rating, reviews, photo, status ('open' | 'urgent' | 'soldout')`. Urgent is set when `seatsLeft ≤ 3`. The price is the twin price of the departure the card shows: the departure's own room prices if it has them (e.g. Eid), otherwise the tour's (ADR-0017).

A card shows one departure: the tour's next upcoming departure that still has seats. Only when every upcoming departure is sold out does it show the next sold-out date, in the sold-out state with the waitlist. Lists of cards (the Homepage's upcoming departures) sort by the date each card shows.

---

## 9. Other components

- **Hero:** full-screen (`clamp(700px, 100svh, 980px)`, so mobile browser bars don't resize it), slides under the header (`margin-top: -72px`). Video layer, then a legibility scrim `linear-gradient(180deg, rgba(12,18,22,.6) 0%, transparent 20%, transparent 42%, rgba(12,18,22,.78) 76%, #0C1216 100%)`, then an Ink 900 dim layer (opacity 0, animated). At the bottom: a row with the lead line (max 460px) and buttons (wrap to full width on mobile), then the Display word.
- **Header:** sticky, 72px, frosted (see M3). Desktop: logo · nav (14/500, 32px gap, active item gold) · “WhatsApp us” button (6px radius). The nav links only to pages (ADR-0026, ADR-0027): Home, Tours, Destinations, Private trips, About and Contact, the current page's item gold with `aria-current="page"`, from the URL alone (Home on the Homepage only, Tours also on every tour page, Destinations on every destination page; nothing on Help, the legal pages or Photo credits). This replaces the design's section-anchor nav (How it works, Guides and Reviews, with scroll-spy on the Homepage); PRD #118. Mobile (below 960px, so the six items never crowd the brand and the button): logo · WhatsApp icon 44 · menu 44 (two 16px lines). The menu button opens the mobile menu as a **side drawer** (the `Sheet` drawer variant, titled “Menu”, full width on narrow screens): the same six page links in the `footerNav` role divided by hairlines, the current page's in gold, then a primary 56 “Plan on WhatsApp” button on every page. It closes with its close button, the backdrop, Escape or Android's back gesture, and when a link is tapped; focus returns to the menu button. Other mobile overlays (booking, filters, sort) use the bottom sheet.
- **Steps:** numeral, then a `→` in `--text-3` on steps 1–3, a 20/500 title and a 15px `--text-2` description (max 300px).
- **Route map:** 560×700 schematic. Ink surface `#0E151A` with a 1px `#253038` border and graticule every 1°. Main route (motorway + KKH) 2px `#F1EEE8` with round joins; valley roads 1.5px dashed `#8F9AA2` (4/5); destinations are 9px gold dots with 20px halos and 14/500 labels; waypoints are 8px hollow white rings with 12px `--text-2` labels; start (Lahore) is a 10px white square. Labels are HTML overlays so they keep their pixel size on mobile. Next to the map: a stop list with number, name, elevation and a one-line note.
- **Image placeholder:** `repeating-linear-gradient(135deg, #151E24 0 12px, #10181C 12px 24px)` (12/24 in code, on the spacing scale; the design files draw 10/20) with an 11px Geist Mono caption at bottom-left naming the exact shot.
- **Reviews:** five 15px gold stars, then the quote, then a hairline, then name (15/500) and trip · month (14 `--text-3`).
- **Trust strip:** four cells, each with a 13px `--text-3` label, a large value and a 14px `--text-2` note. The mini strip in Tour Detail's final call to action has three (DTS licence, Departs from, We accept), values at 16/500, MIN 200.
- **Footer:** contact label column; the same six page links as the header, large, on the left, the current page's in gold; on the right a 380px column with an intro line, primary WhatsApp button and hairline contact rows (WhatsApp, Phone, Email, Office). The bottom bar sits on a hairline: © + DTS licence on the left, social links then Help, Privacy, Terms and Photo credits on the right (13px `--text-2`).

---

## 10. Motion

| ID | Behaviour | Reduced motion |
|---|---|---|
| Cards rise | **The only entrance animation.** Once, on first view: translateY 40px → 0, 0.9s `cubic-bezier(.2,.7,.2,1)`, 90ms stagger; the photo fades in, text never fades. Cards are visible by default: JS adds the offset only to cards still below the fold, so nothing is hidden if the script fails. On Tours, first load only, never on filter change. | Cards simply appear. |
| Brand statement | **Homepage only.** The brand headline lights up word by word on scroll (16% → 100% opacity). All other headlines simply appear. | Full opacity. |
| Hero blur | Scroll-linked, not an entrance: hero video blurs 0 → 16px, scales to 1.08 and darkens to 80% as it scrolls away. | Static. |
| Frosted header | Sticky, `rgba(12,18,22,.86)` + `blur(18px) saturate(140%)` backdrop. | Solid Ink 900 if no backdrop-filter. |
| Filter bar auto-hide | Tours: past 320px, scrolling down slides the filter bar (desktop and mobile) up behind the header; scrolling up brings it back (`transform`, `--dur-300`, `--ease-out`). Hiding closes any open dropdown; it stays shown while keyboard focus is inside it. Direction comes from one passive, frame-throttled scroll listener (`useHideOnScroll`); the movement is a CSS transition. | No transition: it simply hides and shows. |
| Maps | Routes, markers and pins are drawn in full on load. The Tour Detail itinerary progress line follows the day being read (functional): the day is found with a native IntersectionObserver at half the viewport (no scroll listener), and the line moves to it with a short transition. | Progress jumps. |
| Guide card (About) | While its profile is shown, the card takes the raised surface (`--dur-200`). | No transition. |
| Steps (planner) | Gentle slide between steps: only the step body, translateX 28px → 0 over .35s with `--ease-out` (`--step-slide`, `--dur-350`), from the right going forward and the left going back; transform only, so nothing is hidden. | Steps swap. |

Never animated: prices, dates, seats left, error messages, buttons.

**In code (ADR-0016):** scroll-linked motion (hero blur, brand statement) is pure CSS scroll-driven animation (`animation-timeline: view()`), inside `@supports` and `prefers-reduced-motion: no-preference`, so browsers without it and visitors who prefer reduced motion see everything in its final state. Cards rise with one small IntersectionObserver hook, `useRiseOnView`, which offsets only cards still below the fold at load. Only `transform`, `opacity` and `filter` animate. No GSAP.

---

## 11. Accessibility

- Body text is AA or better on both surfaces: lowest on dark is Text 3 at 6.6:1; lowest on light is Text 3 `#5B6770` at 5.1:1; deep gold on light is 5.6:1. The minimum text size is 13px; map waypoint labels are 12px and supplementary only.
- Tap targets are at least 44×44px.
- Focus ring is a 2px outline in the text colour with a 3px offset on every interactive element.
- Icon buttons have descriptive `aria-label`s. Star rows carry `aria-label="5 out of 5 stars"`.
- Text over photos always sits on the bottom scrim.
- No text in images.

---

## 12. Do's and don'ts

**Do**
- Keep dark for imagery and Mist 50 for reading.
- Use gold only for action and key highlights; deep gold on light.
- Let the headline introduce the section.
- Make every primary action a 6px gold button and every tap target at least 44px.
- Keep price, dates, seats and WhatsApp visible on first paint.

**Don't**
- No orange or apricot accent. Gold `#D9B44A` (deep gold `#7A5A12` on light) is the only accent; any “apricot” or `#F4A66A` left in the design files is stale.
- No pill main buttons. 999px is for filter chips and small tags only.
- No labels repeating headlines.
- No word-by-word reveals beyond the homepage brand statement.
- No AI-generated images of real places or people.
- No gold decoration, large gold areas, or filled urgency badges that look like buttons.
- No warm cream or beige surfaces.
- No drop shadows or coloured left-border accents.

---

## 13. Tokens (CSS)

The tokens in code live in `styles/tokens.css`, the only stylesheet allowed to hold raw values. Groups, in file order:

| Group | Tokens |
|---|---|
| Raw palette | `--ink-900` `--ink-800` `--line` `--line-strong` `--text` `--text-2` `--text-3` `--gold` `--gold-hover` `--gold-pressed` `--on-gold` `--mist-50` `--mist-100` `--line-light` `--line-strong-light` `--ink-text` `--ink-text-2` `--ink-text-3` `--gold-deep` (values in §2). Used only inside the tokens file. |
| Surface | `--bg` `--bg-raised` `--accent` `--fg` `--fg-2` `--fg-3` `--hairline` `--control-border` `--control-border-soft` `--link` `--link-hover` `--error`, plus `color-scheme`. Dark on `:root` and inside `[data-surface="dark"]`, light inside `[data-surface="light"]` (table in §2, ADR-0011). |
| Radius | `--radius-input` 2px, `--radius-button` 6px, `--radius-card` 8px, `--radius-chip` 999px |
| Interaction | `--tap` 44px, `--control-44` (= `--tap`) `--control-48` `--control-52` `--control-56` (button and icon-button heights), `--tag-h` 28px, `--hairline-width` 1px, `--focus-width` 2px, `--focus-offset` 3px |
| Other surfaces | `--backdrop` (Ink 900 at 72%, behind sheets), `--map-surface` `#0E151A`, `--placeholder-stripe-a` `#151E24`, `--placeholder-stripe-b` `#10181C`, `--header-bg` (Ink 900 at 86%), `--header-backdrop` `blur(18px) saturate(140%)`, `--filter-bar-bg` (Ink 900 at 92%, the Tours filter bars and the planner's bottom bar), `--light-bar-bg` (Mist 50 at 92%, the planner's progress on the light page), `--placeholder-stripe-light-a` `#DCE2E7` and `--placeholder-stripe-light-b` `#E6EAEE` (the placeholder stripes on light: the planner's "Not sure" card), `--hero-scrim` (§9 gradient), `--sold-out-opacity` .4 (a sold-out tour card's photo), `--map-grid` `#1B252C` (route map graticule), `--map-halo` (gold at 20%, around destination dots), `--hero-rule` (Text at 18%, the line over a photo hero's facts). The translucent values are derived from `--ink-900` with `color-mix()` |
| Spacing | `--space-4` `--space-8` `--space-12` `--space-16` `--space-20` `--space-24` `--space-32` `--space-48` `--space-64` `--space-96` `--space-144`, named by pixel value |
| Layout | `--margin` `clamp(20px, 3.4cqi, 48px)`, `--section-y` `clamp(72px, 9cqi, 144px)`, `--section-y-statement` `clamp(88px, 10cqi, 160px)`, `--cell-pad` `clamp(16px, 1.7cqi, 24px)`, `--gutter` (`--space-48`), `--row-gap` (`--space-24`), `--label-col` 240px, `--content-col-min` 600px (section content basis, §4), `--header-h` 72px, `--measure-lead` 460px, `--measure-answer` 740px, `--drawer-w` 460px, `--sheet-max-h` 92dvh, `--handle-w` 36px, `--handle-h` 4px, `--dropdown-min-w` 260px, `--nav-gap` `clamp(24px, 2.9cqi, 32px)` (header nav: 32px apart, closing to about 28px at the 960px header breakpoint), `--brand-mark-w` 16px and `--brand-mark-h` 14px (logo triangle), `--label-mark-w` 11px and `--label-mark-h` 10px (section label triangle), `--list-row-y` 14px (list row padding), `--key-col-w` 120px and `--key-value-min` 300px (a label-column row's label and value; a parent can also set its row padding, `--key-row-y`, 16px unless set), `--footer-contact-w` 380px (footer contact column), `--hero-h` `clamp(700px, 100svh, 980px)` (Homepage hero), `--photo-hero-h` `clamp(600px, 50cqi, 740px)` (Tour Detail photo hero), `--destination-hero-h` `clamp(620px, 52cqi, 780px)` (Destination photo hero), `--photo-hero-scrim-stretch` 160% (below 820px the hero scrim is drawn this tall, anchored at the bottom, so the title and facts sit on its dark end), `--hero-row-pad` `clamp(24px, 2.4cqi, 32px)` (under the hero's lead and buttons), `--hero-actions-w` 420px (hero button pair), `--measure-cta-actions` 520px (a closing CTA's lead and button pair), `--measure-statement` 1040px and `--measure-statement-body` 500px (brand statement), `--underline-offset` 6px (text links), `--underline-offset-inline` 4px (a link inside a sentence), `--seat-dot` 7px (seats line dot), `--measure-headline` 820px (section headlines), `--measure-note` 320px (a note beside a section headline), `--measure-overview` 620px (a tour overview's paragraphs), `--measure-destination` 560px (a destination's hero lead and overview paragraphs), hairline grid sizes from the §5 table, `--grid-tours-min`/`--grid-tours-cols` 280px/4 (`--grid-tours-detail-cols` 3 on Tour Detail), `--tour-grid-gap` 24px and `--tour-grid-row-gap` 48px (between tour cards and their rows), `--grid-steps-*` 260px/4, `--grid-reviews-*` 290px/3, `--grid-trust-*` 165px/4, `--grid-trust-mini-*` 200px/3 (Tour Detail's final call to action), `--grid-destinations-*` 160px/6 (`--grid-destinations-other-cols` 5 on a destination page), `--grid-guides-*` 150px/4, `--grid-hero-facts-*` 150px/4 (a photo hero's facts, with gaps), `--grid-quick-facts-*` 160px/5, `--grid-seasons-*` 240px/4 (a destination's season notes), `--grid-notes-*` 260px/3 (its good to know notes), `--grid-principles-*` 240px/4 (About's "How we run every trip"), `--grid-vehicles-*` 200px/2 (About's vehicles), `--grid-policies-*` 280px/2 (Help's booking policies), `--grid-highlights-*` 160px/3, `--grid-hotels-*` 160px/5 (never more columns than stays; `--hotel-card-max` 320px caps the grid's width per stay), `--grid-pairs-*` 260px/2 for suitability and inclusions (a grid sets `--grid-min` and `--grid-cols` from them), `--measure-step` 300px (a booking step's text), `--map-min-w` 440px, `--map-max-w` 620px and `--map-list-min` 320px (route map beside its stop list), `--stop-number-col` 36px (stop list numbers), Tour Detail booking: `--aside-w` 380px, `--aside-gap` 64px, `--aside-top` (header + 16px, where the sticky aside stops), `--aside-panel-max-h` (100vh less the aside's top, padding and a 20px gap: `calc(100vh - 156px)`; the aside's panel body scrolls, its footer stays in view), `--focus-reach` (focus width plus offset: how far a ring reaches outside its element), departure rows `--departure-when-min` 200px, `--departure-seats-min` 160px, `--departure-price-w` 140px, the date radio `--radio-size` 16px, `--radio-dot` 8px, `--radio-ring-width` 1.5px, a filter or sort option's checkbox or radio `--indicator-size` 18px (its border `--radio-ring-width`), route map marks `--map-route-width` 2px, `--map-road-width` 1.5px, `--map-road-dash` 4 5, `--map-dot-size` 9px, `--map-halo-spread` 5.5px (a 20px halo), `--map-ring-size` 8px, `--map-ring-width` 1.5px, `--map-start-size` 10px, `--map-label-offset` 14px, `--legend-swatch-w` 20px (a road sample in the legend), Destination season calendar `--month-cell-min-h` 76px and `--calendar-swatch-size` 14px (its legend's swatches), Destination places `--place-photo-w` 96px and `--place-number` 22px (a place row's photo and number), `--places-list-min` 360px (the places list beside its map, and the map's basis), `--places-map-max` 640px and `--places-map-top` (header + 24px) for the sticky places map, `--pin-size` 26px and `--pin-halo` 40px (a place's numbered pin and the glow when it's lit), `--route-dot` 12px (a stop on the route line from Lahore, joined by `--map-route-width` legs), `--see-all-min-h` 200px (the "See all" cell after a destination's tour cards), Tour Detail itinerary `--itinerary-node` 11px, `--measure-day` 520px, `--day-fact-min` 130px, `--map-side-w` 340px and `--map-side-top` (header + 32px) for the sticky side map, `--mini-map-w` 112px and `--mini-map-h` 156px, `--map-side-units` and `--mini-map-units` (drawing units per pixel, for their stroke widths), Tours `--page-header-top` `clamp(64px, 8cqi, 128px)` and `--page-header-bottom` `clamp(48px, 5cqi, 80px)` (a page header with a text `<h1>`), `--results-top` `clamp(28px, 3cqi, 40px)` (above the results heading), `--banner-y` `clamp(40px, 5cqi, 72px)`, `--banner-media-min` 320px, `--banner-media-max` 560px and `--banner-text-min` 360px (the private trip banner), `--empty-y` `clamp(48px, 6cqi, 96px)` (around the empty results), `--hidden-size` 1px (the box of a visually hidden element, read out but never seen), forms (Trip Planner): `--error-badge` 20px (the round "!" beside an error), `--progress-h` 2px (the planner's progress segments), `--textarea-min-h` 128px and `--textarea-pad-y` 14px (a textarea), `--measure-field` 520px and `--measure-notes` 640px (the planner's details fields), `--country-code-w` 72px (a country code's field), `--review-key-w` 110px and `--review-key-w-wide` 180px (the planner review's label column, below and from 1100px), `--measure-message` 560px (the WhatsApp message preview), `--planner-success-y` `clamp(40px, 5cqi, 72px)` (around the planner's thank-you), `--summary-key-w` 100px ("Your trip so far" label column), `--planner-aside-top` (header + 24px) and `--planner-aside-max-h` (the screen less that and 16px) for the planner's sticky side column, `--summary-rows-max-h` 50vh (the summary bar's rows, open, before they scroll), `--planner-top-reach` 128px, `--planner-progress-reach` 72px and `--planner-bottom-reach` 72px (room the planner's sticky bars take, kept clear when the browser scrolls a field into view), `--date-field-min` 200px (From and To side by side before they stack), `--age-select-w` 110px (each child's age select), `--measure-counters` 440px (group size rows), `--measure-field-short` 360px (the other city field), `--grid-choices-min` 150px (the planner's destination cards, 8px apart), `--measure-planner-lead` 600px, `--planner-header-bottom` `clamp(32px, 4cqi, 56px)` (under the planner's full header) and `--page-header-slim-y` 28px (its slim header from step 2), About (PRD #78): `--page-header-media-top` `clamp(40px, 5cqi, 72px)` (above the header's wide photo), `--measure-about` 560px (the header's lead and the story's paragraphs), `--story-text-min` 380px (the story's text before it wraps above the founder), `--founder-w` 320px and `--founder-min` 240px (the founder's portrait and name), `--measure-guides-intro` 520px (the line under the guides headline), `--fleet-min` 440px and `--safety-min` 360px (the vehicles beside the safety list), `--credentials-key-w` 200px and `--measure-credentials` 820px (the Credentials rows), `--office-text-min` 360px ("Visit the office": its rows and photo side by side), Help, Contact and Legal (PRD #86): `--page-header-bottom-short` `clamp(40px, 4cqi, 64px)` (under the Help and legal headers), `--body-top` `clamp(40px, 5cqi, 72px)` (above Help's questions and a legal document's text), `--side-top` (header + 24px, where the sticky side column stops: Help's categories, the legal contents), `--measure-legal` 35em (a legal document's text), `--measure-search` 640px (Help's search field), `--measure-contact-lead` 600px (the Contact header's lead), `--on-trip-pad-y` `clamp(28px, 4cqi, 56px)` and `--on-trip-text-min` 360px (Contact's on-trip panel: its padding, and its words beside its button), `--quick-link-h` 64px, `--quick-links-min` 360px and `--social-w` 280px (Contact's quick link rows, and the social links beside them) |
| Layers | `--z-header` 10 (sticky header), `--z-sticky-bar` 10 (Tour Detail's booking bar and the planner's Back and Next bar at the bottom), `--z-skip-link` 20 (above the header when focused), `--z-filter-bar` 9 (the Tours filter bars, just under the header so they slide up behind it), `--z-planner-bar` 9 (the planner's sticky progress, under the header). Sheets and dropdowns use the browser's top layer |
| Motion | `--nudge` 4px (arrow on hover), `--dur-200` .2s (an About guide card taking the raised surface while its profile is shown), `--dur-300` .3s, `--dur-400` .4s, `--dur-900` .9s, `--dur-1000` 1s, `--ease-out` `cubic-bezier(.2, .7, .2, 1)`, `--photo-zoom` 1.045 (tour card photo on hover), `--hero-blur` 16px, `--hero-zoom` 1.08 and `--hero-dim` .8 (hero blur, fully scrolled away), `--word-dim` .16, `--reveal-from` 8vh and `--reveal-span` 45vh (brand statement reveal), `--rise-distance` 40px and `--rise-stagger` 90ms (cards rise), `--results-pending-max` 3s (a linked Tours view's results, or the planner's saved answers, show after this even if the page's script never runs), `--step-slide` 28px and `--dur-350` .35s (the planner's step body slides in) |
| Type | `--font` (`var(--font-geist)`, set by `next/font`, then `system-ui`); weights `--fw-light` 300, `--fw-regular` 400, `--fw-medium` 500, `--fw-semibold` 600; per role `--fs-*`, `--lh-*`, `--ls-*` matching the §3 table (e.g. `--fs-statement`, `--lh-statement`, `--ls-statement`); `--ls-brand` −.01em (brand name, 16/600); `--indent-display` −.035em (display and destination hero left margin); `--display-sink` .05em (sets the display word flush with the hero's bottom); `--font-mono`, `--fs-map-grid` 11px (route map degree labels, decorative), `--fs-placeholder` 11px, `--lh-placeholder` 1.5 and `--ls-placeholder` .02em (image placeholder captions only, in the system monospace); `--fs-destination-hero-max` 20cqi, `--destination-hero-fit` 150 and `--name-length-min` 5 for the destination hero (size in cqi = round(150 / max(length, 5))) |

Breakpoints can't be custom properties in media queries, so they are literals there and documented in the tokens file: 490px, 656px and 829px (Tour Detail quick facts go to three, four, then five columns), 820px (sheets replace dropdowns, Tours results go to two columns, a destination's month calendar goes from six columns to twelve), 960px (the header's nav collapses, ADR-0027), 1100px (Tour Detail and Trip Planner side columns, Tours results go to three), 1280px (Tour Detail side map), viewport height 920px (compact booking panel).

The design files' token names `--fs-h1`, `--fs-h2`, `--fs-h2-long` and `--fs-h3` are `--fs-statement`, `--fs-section`, `--fs-section-long` and `--fs-card-title` in code, because type roles are visual only. `--fs-small` is 15px and `--fs-ui` 14px (the design's "Small / UI 14–15px").

---

## 14. Placeholders still to supply

Brand name, logo mark, DTS licence number, years operating, trips completed, advance %, pickup point, WhatsApp/phone/email, office address, guide names and portraits, all photography and the hero video, real prices, dates, ratings and reviews. Elevations and best-season ranges should be fact-checked before launch.

During development, invented sample content may fill these, except contact details and legal identifiers, which stay as placeholders (ADR-0010). Location photos may come from Unsplash or Wikimedia Commons; photos of people are supplied by the owner only (ADR-0009).

### Content corrections to the design files

- **Payment methods:** the design files show “Bank transfer · JazzCash · Easypaisa · Card”. Accepted methods are **cash and bank transfer only** (ADR-0008), read from `content/settings.json`. This applies to every “We accept” row, the booking panel, the “How booking works” step 3 and payment FAQs.
- **“Reserve with [X]% advance”** and **“Request a call back”** open WhatsApp with a pre-filled message (ADR-0008).

---

## 15. Headline changes (v2)

- **Homepage**: “Travel the north with people who know it.” → “Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway”
- **Homepage**: “From Lahore to the mountains in four steps.” → “How booking works”
- **Homepage**: “Up the Karakoram Highway, one valley at a time.” → “The road north, from Lahore to Hunza and Skardu”
- **Homepage**: “Six valleys. Each one has its season.” → “Where we go, and when to go there”
- **Homepage**: “The people who drive you up and bring you home.” → “Meet the guides and drivers”
- **Homepage**: “Families come back. Then they bring their cousins.” → “Families come back, and next time they bring the cousins”
- **Tour Detail**: “Two great valleys, one unhurried road trip.” → “Nine days up the Karakoram Highway to Hunza and Skardu”
- **Tour Detail**: “What you’ll see along the way.” → “What you’ll see along the way”
- **Tour Detail**: “Day by day.” → “The route, day by day”
- **Tour Detail**: “One price, no surprises.” → “What the price includes”
- **Tour Detail**: “Where you’ll sleep.” → “Where you’ll stay each night”
- **Tour Detail**: “Upcoming departures.” → “Upcoming departures and prices”
- **Tour Detail**: “From travellers on this trip.” → “What travellers said after this trip”
- **Tour Detail**: “Hold your seats with a [X]% advance.” → “Hold your seats with a [X]% advance”
- **Tour Detail**: “Before you book.” → “Questions people ask before booking”
- **Tour Detail**: “Other trips from Lahore.” → “Other trips from Lahore”
- **Tours**: “Every trip, from Lahore.” → “All our trips from Lahore”
- **Tours**: “Your dates, your group.” → “Plan a private trip for your family or team”
- **Destination**: “Pick your season.” → “The best months to visit”
- **Destination**: “From Lahore, by road.” → “Getting there from Lahore by road”
- **Destination**: “Before you go.” → “Good to know before you go”
- **Destination**: “More of the north.” → “Other valleys we travel to”
- **Trip Planner**: “Your dates, your group.” → “Your dates, your group”
- **About**: “Lahore office. Mountain people.” → “A Lahore company, with guides and drivers from the valleys we visit”
- **About**: “Running trips north since [year].” → “Running trips north since [year]”
- **About**: “Four things we never skip.” → “How we run every trip”
- **About**: “The people who drive you up and bring you home.” → “The full team of guides and drivers”
- **About**: “Good vehicles, rested drivers.” → “Our vehicles, and how we keep you safe”
- **About**: “Come for chai and plan your trip in person.” → “Plan your trip over chai at our Lahore office”
- **About**: “What travellers say about the team.” → “What travellers say about our guides and drivers”
- **About**: “Ready when you are.” → “Start planning your trip north”
- **Help**: “Questions, answered.” → “Help with booking, payments and the trip”
- **Help**: “The rules, in plain words.” → “Our booking policies, in plain words”
- **Help**: “Ask a person.” → “Still have a question? Ask us on WhatsApp”
- **Contact**: “Talk to a person.” → “Talk to a person”
- **Contact**: “Come for chai and plan your trip in person.” → “Plan your trip over chai at our Lahore office”
- **Destination**: “A green valley under the highest peaks.” → “A green valley under the highest peaks”
- **Destination**: “Cool air, a long weekend away.” → “Cool air, a long weekend away”
- **Destination**: “What to see in ${d.name}.” → “What to see in ${d.name}”
- **Destination**: “Tours that visit ${d.name}.” → “Tours that visit ${d.name}”
- **Destination**: “${d.name}, on your own dates.” → “${d.name}, on your own dates”
- **Destination**: “From travellers who went to ${d.name}.” → “What travellers said about ${d.name}”
