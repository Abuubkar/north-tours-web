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
| Category | Follows the page | `--control-border` | `--fg-2` | Heritage, Viewpoint, Lake, Adventure |

- **Chips** (`Chip`): 44px, 999px, 14/500, 0 16px. Variants: toggle (`aria-pressed`), dropdown trigger (`aria-expanded`, caret turns over when open, optional count), removable (the whole chip is the button “Remove filter {label}”, so the tap target is the full pill) and link. Off: `--control-border` border. Hover and selected: `--bg-raised` fill with a `--fg` border, on both surfaces. Never gold. Counts in `--fg-2`.
- **Stepper** (`Stepper`): − value +, inside a named group (“Travellers”). The buttons are 44px icon buttons labelled by the caller (“Fewer travellers” / “More travellers”). The value uses the `stepTitle` role with tabular figures and is announced politely when it changes. At a limit the matching button is `aria-disabled` with the disabled look, and stays focusable so keyboard focus isn't lost.
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
| Display (hero word) | `display` | `27cqi` (≈105px @390, ≈389px @1440) | 600 | .74 | −0.065em | One word, e.g. NORTH. `white-space: nowrap`, slight negative left margin (−.035em), sits flush to hero bottom |
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
| Mono placeholder | — | 11px Geist Mono | 400 | 1.5 | +0.02em | Design files only; not in code |

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
| Nav breakpoint | below 820px page width the nav collapses to WhatsApp + menu buttons |
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
- **Capped auto-fill columns:** `grid-template-columns: repeat(auto-fill, minmax(max(MIN, calc((100% - (N-1)px) / N)), 1fr))`. This gives at most N columns and wraps down to MIN widths without media queries.

| Grid | MIN | N (max cols) | Result @390 | Result @1440 |
|---|---|---|---|---|
| Tour cards | 280px | 4 | 1 | 4 |
| How it works | 260px | 4 | 1 | 4 |
| Destinations | 160px | 6 | 2 | 6 |
| Guides | 150px | 4 | 2 | 4 |
| Reviews | 290px | 3 | 1 | 3 |
| Trust strip | 165px | 4 | 2 | 4 |

- **Cell padding rule:** every cell in a hairline grid or divided row has the same inner padding on both sides, so text never touches a divider: **16px on mobile → 24px on desktop** (`P = clamp(16px, 1.7cqi, 24px)`).
  - *Text-only grids* (facts, steps, reviews, notes, trust strip): cells use `padding: Y P`. The grid bleeds outward by P and is clipped back (`margin-left/right: calc(-1 * P); clip-path: inset(0 P)`), so the first column's text still aligns with the page margin and the last column with the right margin, at any column count.
  - *Image-card grids* (destinations, guides, highlights, hotels): photos stay full-bleed in the cell; the text block below uses `padding: Y P` on both sides.
  - Tour cards already carry 24px inner padding and are unaffected.
- **List rows:** label/value pairs as flex rows, `padding: 14px 0; border-bottom: 1px solid #253038`, with a top border on the list.
- **Sections:** every section after the hero opens with `border-top: 1px solid #253038`.
- Never use drop shadows, card backgrounds, coloured left-border accents, or gradients (except the hero legibility scrim).

---

## 6. Section labels

Removed. The headline introduces each section. A small label (11px logo-mark triangle + 13px/500 name in `--text-2`) is used **only** when a section has no headline of its own: About “Credentials”, Contact “Quick links”, and the footer “Contact” column.

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
3. The card has no border of its own; it sits inside a hairline grid.

### States

| State | Surface | Photo | Chip | Title / price | Seats row | Actions |
|---|---|---|---|---|---|---|
| **Default** | `#0C1216` | 100%, scale 1 | none | `--text` | dot + text `--text-2` | View Trip gold (primary); WhatsApp border `#5C6871` |
| **Hover** (pointer only) | `#121A1F` (.4s) | scale 1.045 (1s, ease-out) | none | `--text` | `--text-2` | arrow +4px (.3s); WhatsApp border `#F1EEE8` |
| **Urgent** (≤3 seats) | as Default | 100% | outlined tag “Only 3 seats left”: 28px, 999px radius, Ink 900 fill, 1px gold border, gold 13/500 text, clock icon | `--text` | gold dot + gold text “3 of 16 seats left” | as Default (hover still applies) |
| **Sold out** | `#0C1216`, no hover | 40% opacity | “Sold out” pill: Ink 900 bg, 1px `#5C6871` border, `--text` | `--text-2` | `#5C6871` dot, “0 of 12 seats · waitlist open” | “Join waitlist” (Quiet) + WhatsApp icon |

Touch devices always show the Default state; nothing depends on hover.

### Data contract

`title, price, route, dates, seatsLeft, totalSeats, rating, reviews, photo, status ('open' | 'urgent' | 'soldout')`. Urgent is set when `seatsLeft ≤ 3`.

---

## 9. Other components

- **Hero:** full-screen (`clamp(700px, 100vh, 980px)`), slides under the header (`margin-top: -72px`). Video layer, then a legibility scrim `linear-gradient(180deg, rgba(12,18,22,.6) 0%, transparent 20%, transparent 42%, rgba(12,18,22,.78) 76%, #0C1216 100%)`, then an Ink 900 dim layer (opacity 0, animated). At the bottom: a row with the lead line (max 460px) and buttons (wrap to full width on mobile), then the Display word.
- **Header:** sticky, 72px, frosted (see M3). Desktop: logo · nav (14/500, 32px gap, active item gold) · “WhatsApp us” button (6px radius). Mobile: logo · WhatsApp icon 44 · menu 44 (two 16px lines). The mobile menu is a full panel with 40px links divided by hairlines, plus a primary WhatsApp button.
- **Steps:** numeral, then a `→` in `--text-3` on steps 1–3, a 20/500 title and a 15px `--text-2` description (max 300px).
- **Route map:** 560×700 schematic. Ink surface `#0E151A` with a 1px `#253038` border and graticule every 1°. Main route (motorway + KKH) 2px `#F1EEE8` with round joins; valley roads 1.5px dashed `#8F9AA2` (4/5); destinations are 9px gold dots with 20px halos and 14/500 labels; waypoints are 8px hollow white rings with 12px `--text-2` labels; start (Lahore) is a 10px white square. Labels are HTML overlays so they keep their pixel size on mobile. Next to the map: a stop list with number, name, elevation and a one-line note.
- **Image placeholder:** `repeating-linear-gradient(135deg, #151E24 0 10px, #10181C 10px 20px)` with an 11px Geist Mono caption at bottom-left naming the exact shot.
- **Reviews:** five 15px gold stars, then the quote, then a hairline, then name (15/500) and trip · month (14 `--text-3`).
- **Trust strip:** four cells, each with a 13px `--text-3` label, a large value and a 14px `--text-2` note.
- **Footer:** contact label column; large nav links on the left; on the right a 380px column with an intro line, primary WhatsApp button and hairline contact rows (WhatsApp, Phone, Email, Office). The bottom bar sits on a hairline: © + DTS licence on the left, social and legal links on the right (13px `--text-2`).

---

## 10. Motion

| ID | Behaviour | Reduced motion |
|---|---|---|
| Cards rise | **The only entrance animation.** Once, on first view: translateY 40px → 0, 0.9s `cubic-bezier(.2,.7,.2,1)`, 90ms stagger; the photo fades in, text never fades. Cards are visible by default: JS adds the offset only to cards still below the fold, so nothing is hidden if the script fails. On Tours, first load only, never on filter change. | Cards simply appear. |
| Brand statement | **Homepage only.** The brand headline lights up word by word on scroll (16% → 100% opacity). All other headlines simply appear. | Full opacity. |
| Hero blur | Scroll-linked, not an entrance: hero video blurs 0 → 16px, scales to 1.08 and darkens to 80% as it scrolls away. | Static. |
| Frosted header | Sticky, `rgba(12,18,22,.86)` + `blur(18px) saturate(140%)` backdrop. | Solid Ink 900 if no backdrop-filter. |
| Maps | Routes, markers and pins are drawn in full on load. The Tour Detail itinerary progress line follows the day being read (functional). | Progress jumps. |
| Steps (planner) | Gentle slide between steps. | Steps swap. |

Never animated: prices, dates, seats left, error messages, buttons.

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
| Other surfaces | `--map-surface` `#0E151A`, `--placeholder-stripe-a` `#151E24`, `--placeholder-stripe-b` `#10181C`, `--header-bg` (Ink 900 at 86%), `--header-backdrop` `blur(18px) saturate(140%)`, `--hero-scrim` (§9 gradient). The translucent values are derived from `--ink-900` with `color-mix()` |
| Spacing | `--space-4` `--space-8` `--space-12` `--space-16` `--space-20` `--space-24` `--space-32` `--space-48` `--space-64` `--space-96` `--space-144`, named by pixel value |
| Layout | `--margin` `clamp(20px, 3.4cqi, 48px)`, `--section-y` `clamp(72px, 9cqi, 144px)`, `--section-y-statement` `clamp(88px, 10cqi, 160px)`, `--cell-pad` `clamp(16px, 1.7cqi, 24px)`, `--gutter` (`--space-48`), `--row-gap` (`--space-24`), `--label-col` 240px, `--header-h` 72px, `--measure-lead` 460px |
| Motion | `--nudge` 4px (arrow on hover), `--dur-300` .3s, `--dur-400` .4s, `--dur-900` .9s, `--dur-1000` 1s, `--ease-out` `cubic-bezier(.2, .7, .2, 1)` |
| Type | `--font` (`var(--font-geist)`, set by `next/font`, then `system-ui`); weights `--fw-light` 300, `--fw-regular` 400, `--fw-medium` 500, `--fw-semibold` 600; per role `--fs-*`, `--lh-*`, `--ls-*` matching the §3 table (e.g. `--fs-statement`, `--lh-statement`, `--ls-statement`); `--indent-display` −.035em (display and destination hero left margin); `--fs-destination-hero-max` 20cqi, `--destination-hero-fit` 150 and `--name-length-min` 5 for the destination hero (size in cqi = round(150 / max(length, 5))) |

Breakpoints can't be custom properties in media queries, so they are literals there and documented in the tokens file: 820px (nav collapses, sheets replace dropdowns), 1100px (Tour Detail and Trip Planner side columns), 1280px (Tour Detail side map), viewport height 920px (compact booking panel).

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
