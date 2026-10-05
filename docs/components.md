# Component inventory: north-tours-web design export

Source: `docs/design/*.dc.html` (9 pages, `TourCard`, `BookingPanel`, `Design System`, 7 `* Views` files), checked against `DESIGN.md` and `CLAUDE.md`.
Audit date: 2026-10-04. Read-only audit. Line references are `File:line` in the export.

**Overrides applied throughout (docs win):** the only accent is gold `#D9B44A` / deep gold `#7A5A12`. Radius is 2px for inputs, 6px for buttons, 8px for cards and panels, and 999px for chips and tags only. Payments are **cash and bank transfer only**. "Reserve with [X]% advance" and "Request a call back" open WhatsApp with a pre-filled message. When this file says a design shows something stale, the override still applies.

**Decided in the foundation PRD (2026-10-04), applied over the design files:**

- **Error colour:** an error token that reuses deep gold `#7A5A12` on light and gold `#D9B44A` on dark. No new colour. Errors always pair the colour with the "!" badge and a message.
- **Off-scale sizes:** three type roles are added: the Tour Detail hero H1 `clamp(48px, 7.2cqi, 108px)`, the Destination hero name, and the BookingPanel price (30px). Every other off-scale size in §5 item 33, the compact review card (item 24) and the section-padding variants (item 35) move to the nearest DESIGN.md value.
- **One `<h1>` per page** (CLAUDE.md §10). Type roles are visual only.
- **Precedence fixes** (DESIGN.md / CLAUDE.md win): input, select and textarea borders on light use `--line-strong-light #7D8992` (item 19). No Geist Mono in UI (item 37). No section label on the Contact header (item 32; *reversed by the owner on 2026-10-04, PRD #86: the label stays, an exception recorded in DESIGN.md §6; reversed again by the owner on 2026-10-04 in the first feedback round: the label goes*). No 01–04 numbers on About principles (item 36). Every overlay (sheets, drawer, dropdowns, mobile menu) closes on Escape and returns focus (item 41). Payments and Reserve / call back follow ADR-0008 (items 43, 45).

**Decided in the base components PRD (#8, 2026-10-04):**

- **Scope:** Button, IconButton, Icon, Tag, Chip, StarRating (with the inline rating), Stepper, Accordion, Dropdown, Sheet. Input, Select, Textarea, Checkbox/Radio, FormField, MediaFrame, TextLink, SectionLabel, BrandMark, KeyValueRow and the inclusion icons wait for the PRDs that first use them.
- **Selected state:** Ink 800 fill with a `--fg` border on dark, Mist 100 fill with a `--fg` border on light. Gold is never a selection colour (replaces §5 items 6 and 16).
- **Radius:** dropdown panels 8px with square rows inside; selectable option tiles 8px; bottom sheets 8px top corners; side drawer 8px leading corners (§5 items 9–11).
- **Buttons:** primary, secondary, quiet; sizes 44 / 48 / 52 / 56 (DESIGN.md §7). The header "WhatsApp us" is secondary at 44 with the soft border *(gone with the 2f header, PRD #135, and the soft border with it)*. Join waitlist is always quiet. Disabled: hairline fill, `--fg-3` text (§5 items 1–5, 7, 8).
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
- **Active nav item** comes from the URL (`lib/utils/nav.ts`): Tours on `/tours` and `/tours/*`, Destinations on `/destinations/*`, Guides on `/about`. On the Homepage, scroll-spy instead (PRD #39). *(Replaced by PRD #118: the nav lists five pages, marked from the URL alone, with no scroll-spy.)*
- **WhatsApp links** are built by `lib/utils/whatsapp.ts` from the number and messages in `content/settings.json`. While the number is a placeholder they go to `https://wa.me/?text=…`; placeholder phone, email and social links show as plain text.
- **Skip link** first on every page, to `<main id="main" tabindex="-1">`. In-page anchors land below the sticky header (`scroll-padding-top: var(--header-h)`).

**Decided in the Homepage PRD (#39, 2026-10-04):**

- **The page's `<h1>`** is the brand statement ("Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway"), at the long-H2 size. "NORTH" in the hero is decorative and `aria-hidden`. Section headlines are `<h2>`; card titles and names are `<h3>`.
- **Page copy** lives in `content/pages/<page>.json` (schema, loader, `content:check`): headlines, leads, labels, steps, the `<title>` part and meta description. Copy may use `{tokens}` filled from settings; a field rejects tokens it doesn't allow. Titles are "{page title} | {brand}"; every page has Open Graph and Twitter tags, and its share image is its hero photo cropped to 1200×630 (the Homepage's where a page has none).
- **Images:** source photos in `content/images`; `pnpm images` (sharp, dev only, ADR-0015) writes AVIF, WebP and JPEG at fixed widths plus share crops to `public/images`; `content:check` fails if any are missing. `MediaFrame` (built) picks the file, lazy unless it's the page's main image. Place photos come from Unsplash or Wikimedia Commons (ADR-0009); the first set is from Commons, credited on `/credits`. A credit's optional `changes` notes every edit made to the photo (ADR-0028); `/credits` shows it after the licence.
- **Motion** is native (ADR-0016): the hero blur and brand statement reveal are CSS scroll-driven animations; cards rise with the `useRiseOnView` hook (only cards below the fold at load, only the photo fades). Story files run one at a time so reduced motion can be set per story (ADR-0023).
- **`TourCard`** (built) shows the tour's next upcoming departure that has seats, or, when all are sold out, the next sold-out date with "Join waitlist". Lists sort by the date each card shows. WhatsApp opens a message naming the tour and date (templates in settings); sold out, the waitlist message. The seats line uses the shared wording ("Sold out · waitlist open").
- **Card links:** destination cards link to `/destinations/{slug}`; Homepage guide cards link to the guide's profile, `/about#guide-{slug}` (replacing "not clickable" in §2 and §5 item 26). Each card is one link, named by the destination or guide.
- **Scroll-spy** (Homepage only): the header nav and the mobile menu mark How it works, Destinations or Reviews, with `aria-current="location"`, once that section's top is above 40% of the viewport; above How booking works nothing is marked. Tours and Guides lead to other pages, so they're never marked there. Other pages keep the path rule (`aria-current="page"`). *(Removed by PRD #118: nothing is marked on the Homepage.)*
- **Layout patterns** from §4 are shared styles in `styles/layout.module.css`: section shell, header row, capped hairline grid, cell, text-grid bleed (which fixes §5 item 28), image-card cell and (owner feedback, 2026-10-05) the photo card grid with gaps.
- Built here: `MediaFrame`, `TextLink` (base); `TourCard`, `PriceBlock`, `SeatsStatus`, `StepCell`, `RouteMap`, `RouteStopList`, `ReviewCard`, `DestinationCard`, `GuideCard` (features); the Homepage sections and the `/credits` page.

**Decided in the Tour Detail PRD (#47, 2026-10-04):**

- **Room prices** (ADR-0017): a tour has twin, triple and quad prices per person; a departure can replace the whole set (e.g. Eid). "From" is worked out, never stored: the lowest twin price across upcoming departures, or the tour's twin price with none left. A tour card shows its departure's twin price.
- **The booking panel** (`components/booking-panel`): date radios, travellers (`Stepper`, kept to the date's seats left, the number asked for kept across dates), room radios with the date's prices, the total and the advance. One booking state (`hooks/useBooking`) is shared by the departure rows, the aside, the sticky bar, the sheet and the final call to action. From 1100px it is a 380px sticky aside; on screens under 920px tall the aside picks its date from a native `Select` (the compact form). Below 1100px a frosted sticky bar with Reserve opens it in the `Sheet` bottom variant (always the list form). Buttons are 48 (§5 item 1).
- **Reserve** opens WhatsApp with the tour, dates, travellers, room, total and advance (settings template). It is `aria-disabled` until a date is chosen. It doesn't hold a seat (ADR-0008).
- **The final call to action never opens WhatsApp itself:** from 1100px it scrolls to Dates and prices and focuses the panel's first date control; below that it opens the booking sheet; without JavaScript it links to `#dates` (§6, settled).
- **Join waitlist** is always quiet (§5 item 5) and opens the waitlist message for that date, from the card, the departure row and the panel (§6, settled).
- **The selected row** uses the shared selected state with `aria-pressed`, reading "Selected", never gold (§5 item 6). Option tiles are 8px (§5 item 9).
- **Policies live in settings** (`policies`: the refund schedule, the balance due and the children's age); the panel, the FAQs and later Help read them. A tested formatter writes the schedule as sentences.
- **Shared FAQs** live in `content/faqs.json`, in Help's six categories since PRD #86 (ADR-0024). Tour Detail shows the tour's own questions, then the shared ones marked `tourPages`, in file order, in one `Accordion` with the first open.
- **The itinerary map** (from 1280px) is a sticky side column whose progress line follows the day being read: #46's scroll-spy rule at a 50% line, with an IntersectionObserver, no scroll listener (ADR-0016). Below 1280px each day has a static mini map. Both are schematic (CLAUDE.md §8) and need Survey of Pakistan vetting before launch.
- **Hotels are never named:** a generic title ("Hotel in Karimabad") and a photo of the town or valley. Highlights and hotels are open hairline grids, so a part-filled last row ends cleanly. *(Photo card grids with gaps since the owner's second feedback round.)*
- Built here: `Select` (base); `FactsRow`, `FactCell`, `HeroFacts`, the booking panel and its parts, `DepartureList`, `DepartureRow`, `RoomSharingList`, `SuitabilityList`, `InclusionList`, `HighlightCard`, `HotelCard`, the itinerary components, `TourCardGrid` and `RelatedTours` (features); `PhotoHero`, `QuickFacts`, `BookingLayout`, `TripOverview`, `Highlights`, `Itinerary`, `Included`, `Hotels`, `DatesAndPrices`, `ClosingCta`, `FaqSection` (sections).

**Decided in the Tours PRD (#56, 2026-10-04):**

- **One page, filtered in the browser:** `/tours` is built with every tour in the default order (soonest departure first, sold-out trips after the bookable ones, trips with no upcoming dates last), so the full list shows without JavaScript. After hydration the browser re-checks departures with its own date and applies the view in the link.
- **Filters:** Destination (one option per destination, loader order), Duration (`2-4` up to 4 days, `5-7`, `8plus`), Budget (`under-50k` under PKR 50,000, `50-100k` 50,000 to 100,000, `100k-plus` over 100,000) and Trip type (the tour schema's four) are multi-select; Month is single (every month with an upcoming departure; picking another replaces it, picking it again clears it). Any option within a group matches; every group must. Budget and the price sorts use the tour's "from" price (#49) over the departures in view (upcoming, narrowed to the month), or its twin price with none left. With a month chosen, a card shows that month's first date with seats, else its first date (#58's card rule).
- **Faceted counts:** an option's count is the tours matching every other group plus that option; a group's own picks are left out.
- **Sort and order:** Soonest departure (default), Price low to high, Price high to low, Shortest first (days, then soonest). Bookable trips first, then sold out (the card's date is full), then no upcoming dates; ties by title. Pure, tested functions in `lib/utils/tourFilters.ts`.
- **The URL holds the view:** `/tours?dest=hunza,skardu&dur=5-7&budget=under-50k&type=family&month=2027-06&sort=price-asc`, parameters in that order, values comma-separated in option order, empty groups and the default sort left out (the default view is plain `/tours`). Parsing drops unknown parameters and values (a past month too) and keeps the first month; a messy link is rewritten to its clean form. Every change uses `replaceState`, so Back leaves the page. `routes.toursWith({ dest: ['hunza'] })` builds filtered links (for Destination pages) on the same serialiser (`lib/utils/toursSearch.ts`). Next's `useSearchParams` isn't used: under static export it would leave the results out of the built HTML.
- **No jump on a linked view:** a small inline script marks the view as pending before first paint when the link asks for filters or a sort; the results and the filter bars' controls (whose counts and chips change width) stay hidden with their space kept until the view is applied, then show in the same frame (`pendingHidden` in `styles/layout.module.css`). Without JavaScript nothing is hidden; if the app script never runs, the results show after `--results-pending-max` (3s).
- **One view state** (`hooks/useTourFilters`, `TourFiltersProvider`) is shared by the desktop bar, the mobile bar and sheets, the chips and the results. One polite status announces the count after each change ("2 trips"; "No trips match these filters yet.").
- **Desktop filter bar** (from 820px): sticky under the header, frosted (`--filter-bar-bg`, Ink 900 at 92%), a named region "Filter trips". Each filter is a `Dropdown` whose option rows are 44px toggle buttons (`aria-pressed`) with a 2px checkbox (a circle for Month and the sort), named with their count ("Hunza, 3 trips"). Filter dropdowns stay open while ticking; the sort menu closes on a pick (`Dropdown` gained a `close()` handle). Picked filters show as removable chips after a divider, then "Clear all" (`TextLink`'s new button form), which keeps the sort.
- **Auto-hide:** past 320px, scrolling down slides each filter bar up behind the header and scrolling up brings it back (moves under 4px ignored), with `--dur-300`/`--ease-out` and no transition under reduced motion; hiding closes any open dropdown. It stays shown while keyboard focus is inside it, and a key press or focus moving in brings it back (a clicked control keeps focus without a ring, so after a click the bar still hides). `hooks/useHideOnScroll` reads the scroll direction with one passive, frame-throttled listener: ADR-0016 rules out scroll listeners for scroll-linked animation, but direction can't come from scroll-driven animations or an IntersectionObserver, and the movement itself is a CSS transition.
- **Phones** (below 820px): a slim frosted bar with the count, "Filters (n)" and "Sort", opening bottom sheets. The filter sheet applies each tap at once (settles §6's question: live-apply); its pinned footer has "Clear all" and "Show 2 trips", which only closes the sheet. With nothing matching it reads "No trips match" and turns secondary: an enabled, labelled button that closes the sheet, never the disabled look (§5 item 8). The sort sheet's rows are 56px with a radio and close it on a pick. The sheets return focus to the chip that opened them; `Sheet` gained a pinned `footer`.
- **Chips and focus:** removing a chip moves focus to the next chip (or the one before); with none left, and after Clear all from the bar, chips or the empty state, focus moves to the results heading from 820px or to "Filters" below it. The sheet's own Clear all keeps focus where it is (the sheet stays open), and closing the sheet returns it to "Filters".
- **Selected chips and rows** use the shared selected state (raised surface, `--fg` border), not the design's solid fill (§5 item 16); chips and rows get the hover surface and the standard focus ring (§5 item 17).
- **Results:** the count is the section's `<h2>` ("8 trips"; visually hidden below 820px, where the bar shows it), so headings don't skip to the cards' `<h3>`s. Cards sit in 1, 2 or 3 columns (below 820, below 1100, from 1100) with no lines and 24px/48px gaps (owner feedback, 2026-10-04; until then per-card hairlines, since the gap-on-background grid would paint a short row's empty cells in the line colour, §5 item 27). The widest layout's first row loads its photos straight away. Cards below the fold rise once the view is in place; a filter or sort change cancels any rise still waiting.
- **No upcoming dates card:** no tag, "No upcoming dates · ask on WhatsApp" in place of the dates, the tour's twin price as its "from" price, no seats line, View Trip and WhatsApp with the general message.
- **Empty state** (`EmptyResults`, since PRD #86 the shared `sections/EmptyState`): the fixed H2 "No trips match these filters yet.", the lead, "Clear all filters" (keeps the sort) and "Plan a private trip" (to `/plan`), replacing the design's "Clear filters" and "Ask on WhatsApp".
- **Private trip banner** (`PrivateTripBanner`, Tours variant) sits inside the results after the first row: after three cards from 1100px, after two below (the built HTML places it for the widest layout; `useMediaQuery` moves it below the first screen). It's hidden with no results. Its photo is a credited place photo (Lulusar Lake, already used by Naran-Kaghan's highlights) until the owner supplies one of a family with their guide (ADR-0009).
- **Reviews:** `ReviewsSection`'s compact variant has a visually hidden H2 ("Reviews from travellers"), the site-wide rating summary and three compact `ReviewCard`s (13px stars, the body-large quote, UI and label caption, 24px padding; §5 item 24); the standard section padding (§5 item 35).
- Built here: `PageHeader` and `PrivateTripBanner` (sections); `components/filters` (`FilterBar`, `FilterGroup`, `SortMenu`, `OptionRow`, `ActiveFilterChips`, `MobileFilterBar`, `FilterSheet`, `SortSheet`, `ResultsHeader`, `ResultsGrid`, `EmptyResults` (now `sections/EmptyState`), `TourResults`, `TourFiltersProvider`); `TextLink`'s button form, `Dropdown`'s close handle, `Sheet`'s footer, `MediaFrame`'s 16:10 frame.

**Decided in the Destination PRD (#63, 2026-10-04):**

- **Route and metadata:** `/destinations/[slug]`, one static page per destination in content (unknown slugs aren't built). `<title>` "Hunza tours from Lahore | [BRAND NAME]" from a page copy template, the destination's `description` (at most 160 characters) as the meta description, and its photo's 1200×630 crop as the share image. Page copy in `content/pages/destination.json`; page data shaped in `lib/content/destinationPage.ts`.
- **No destinations index page.** "← All destinations" and the nav's Destinations go to `/#destinations`; every destination page links to the other five. *(Reversed by PRD #118: `/destinations` lists every destination, and both open it.)*
- **Destination fields:** `lead`, `altitude`, `fromLahore`, `overview`, `months` (twelve levels: best, good, avoid, the design's words for the owner's "good, shoulder, avoid") and `seasons` are required; `places` (1–8, in visiting order), `mapLabels` (one may be the way in, `entry: true`) and `notes` (up to 6) are optional; `gettingThere` (Lahore first, a drive time on every stop but the last) is required. The build fails on a calendar that disagrees with `bestSeason`, seasons out of order, a duplicate place id, coordinates out of range or a road not starting at Lahore. **Derived, never stored:** a destination's tours (those whose `destinations` include it) and its reviews (of those tours, most recent first, at most three).
- **Hide empty sections:** `destinationSections` (`lib/utils/destination.ts`) shows the hero, overview, season calendar, getting there, the banner and other destinations always; places to see, good to know, the tours and reviews only with data. Every section is an `<h2>` under the `<h1>`, so leaving one out never skips a level. Murree, with no places or notes, shows the rule (settles the §6 question).
- **Season calendar** (`components/season-calendar`, static): the legend, twelve months as an ordered list (6 columns below 820px, 12 from it), each read as "January: Avoid"; then the season notes as `<h3>`s.
- **Places map** (`components/places-map`, the page's client code with the tour cards): #43's projection fitted to the places, a graticule at a step that suits the span, context labels at their place or at the edge with an arrow ("↓ Gilgit", "↑ Khunjerab"), and 44px numbered pins (26px circles). Pins closer than 44 drawing units are eased apart, so the caption says "positions approximate". The list and map are linked by `hooks/usePlaceHighlight`: hover or focus lights a place on both, a click picks it (`aria-pressed` on both), and below 820px picking a row brings the map into view. The lit pin's name takes the first clear spot (`lib/utils/pinLabel.ts`, measured by `hooks/usePinLabel`); context labels it or a pin covers are hidden. No road, border, basemap or surface fill (CLAUDE.md §8); it needs Survey of Pakistan vetting before launch. *(Owner feedback, 2026-10-05: a schematic route line joins the places in order, from the way in; see the owner's third feedback round below.)* The map is sticky (top 96px) beside the list from 820px and never traps the scroll.
- **Route line** (`components/route-line`, static): one ordered list of stops, a horizontal line from 820px and a vertical list below; the switch is CSS only. Each leg is read as "4–5 hrs by road to Islamabad". "By road" and "By air" are `KeyValueRow`s in its new column layout (120px label column).
- **Tours that visit:** every tour as a card with the shared card departure and the Tours page's order (`tourCards`, on `tourResults`), checked again in the browser; 1, 2 or 3 columns with gaps and no lines (`cardGrid`/`cardCell` in `styles/layout.module.css`, shared with Tours' results; per-card hairlines until the owner's feedback); cards rise once (M4). The see-all cell is an 8px block with a hairline border. The **`SeeAllToursCell`** ("See all Hunza trips") links to `/tours?dest=hunza` through `routes.toursWith`.
- **Private trip banner** (Destination variant): its own section with a hairline above; "Plan a private trip" goes to `/plan?dest=hunza` (`routes.planFor`; the Planner pre-selects it), and "Ask on WhatsApp" sends `settings.whatsapp.destinationMessage` ("Hi, I'd like to plan a private trip to Hunza."). Its photo is the Tours banner's place photo until the owner supplies one of a family with their guide (ADR-0009).
- **Reviews** (Destination variant): the standard H2 and **no rating summary**, the three most recent reviews of the destination's tours as default cards (settles §5 item 34 for Destination). Murree shows its one review.
- **Other destinations:** `DestinationsGrid`'s "other" variant, every other destination in loader order; MIN 160, max 5 from 820px, and two columns below it so an odd last card can span the row. **`DestinationCard`'s "other" variant:** a 4:3 photo, the name on the `destination` role (not the design's 20px), "Best · Apr – Oct" (`seasonRange`'s short form) and "2 tours" (page copy count words); the whole card links to the destination (settles §5 item 25).
- Built here: `PhotoHero`'s Destination variant, `DestinationFacts`, `DestinationOverview`, `SeasonCalendarSection`, `PlacesToSee`, `GettingThere`, `GoodToKnow` (sections); `SeasonCalendar`, `SeasonNotes`, `PlacesExplorer`, `PlacesMap`, `PlacePin`, `PlaceList`, `PlaceRow`, `RouteLine`, `DestinationTours`, `SeeAllToursCell` (features); `KeyValueRow`'s column layout, `MediaFrame`'s placeholder as a `<span>`, the banner's and `DestinationsGrid`'s variants.

**Decided in the Trip Planner PRD (#71, 2026-10-04):**

- **Inputs** (`Input`, with `FormField` and `FieldError`, base components): 52px, 2px radius, the surface fill; `--control-border` (the strong control border, 3:1 on light, §5 item 19), `--fg` on hover and once filled, the standard focus ring, `--error` with `aria-invalid` (#51's rule for `Select`, which gains the error state; settles §5 item 23 and §6's inputs question). Date inputs keep the surface's `color-scheme`, so the picker is light on the light page (§5 item 22; dark since the owner made the planner dark). A field's error is the "!" badge and a message linked with `aria-describedby`, plain text rather than an alert, since focus moves to the field (§5 item 21).
- **Checkbox indicator** (`CheckboxIndicator`, base): the 18px square at 2px, shared by the planner's destination cards and the Tours option rows (§5 item 11).
- **Route and metadata:** `/plan`, one static page, light (`data-surface="light"`) between the dark header and footer, with a dark bottom bar on small screens (§5 item 42, owner decision). *(Reversed by the owner on 2026-10-04: the planner is dark, on a photo band; see the owner's first feedback round.)* `<title>` "Plan a private trip from Lahore | [BRAND NAME]", a meta description, and a share crop (the Homepage's until the owner's feedback; now the photo band's, Skardu's Shangrila). Page copy in `content/pages/planner.json`; page data shaped in `lib/content/plannerPage.ts`. No nav item is marked (Private trips since PRD #118); the mobile menu has "Plan on WhatsApp" (§5 item 39).
- **One `<h1>` on every step:** `PageHeader`'s `planner` variant on step 1 ("Your dates, your group", statement size, lead max 600px; on a photo band since the owner's feedback), then `plannerSlim` ("Planning your private trip", 15/500) on every later step and on the thank-you, instead of the design's `<p>`. The progress is the `<h2>`; review sections are `<h3>`s.
- **Steps and options** (`lib/utils/plannerOptions.ts`, `plannerAnswers.ts`): Where and when (destinations from content in loader order, then "Help me choose"; exact dates or a month from the next 12, counted from today in Karachi; trip lengths `2-4`, `5-7`, `8-10`, `10plus`, the only length question since the owner's second feedback round, which removed "roughly 2–21 days" and the length filled in from it), Who's coming (adults 1–40, children 0–20 with an age each, group type, hotels, transport, departing from (always one, Lahore by default; "Other city" asks which), budget), Your details (name, WhatsApp number, best time, "Anything else?" up to 500 characters). Months, trip lengths, group type, hotels, transport, budget and best time take any number of chips, each unpicked by a second press (owner feedback, 2026-10-05; until then one chip each); Departing from and the date mode stay one answer.
- **Validation and focus** (`lib/utils/plannerValidation.ts`, `hooks/usePlannerFocus`): Next checks the step (no destination, no month, a missing, past or reversed date, a child without an age, no name, the phone rules; every message in page copy); each problem shows beside its field in `--error` with the "!" badge and a linked message (`aria-invalid`, `aria-describedby`); the page scrolls the first problem's section below the header and the sticky bar and focuses the field. After Next or Back the progress heading takes focus; after Edit, the step's first field; after sending, "Thanks, {first name}." Smooth unless reduced motion.
- **Phone** (`lib/utils/phone.ts`): +92 by default, spaces and dashes ignored and a leading 0 or 92 dropped; 10 digits starting with 3, with messages for empty, incomplete ("5 of 10 digits") and wrong numbers. "Outside Pakistan?" switches to a country code (1–3 digits, not starting with 0) and a number, 8–15 digits in all. Messages and the review use the international form ("+92 300 123 4567").
- **WhatsApp** (`settings.whatsapp.planner`, `lib/utils/plannerMessage.ts`, ADR-0008): "Send on WhatsApp" opens `wa.me` with the trip request, line by line from templates (a line whose tokens are all empty is left out; open hotels and transport read "Any"); the review previews it exactly. "Request a call back" opens WhatsApp with "Please call me back on {phone}, best time {bestTime}." and the trip (settles §6's call back question and §5 item 45). Following either link shows the thank-you; "Plan another trip" starts clean. Nothing is sent anywhere else.
- **Saved answers** (ADR-0018, `lib/utils/plannerStorage.ts`): the trip answers and step go to `localStorage` under `planner-answers-v1` (`planner-answers-v2` since the answers became lists, owner feedback 2026-10-05) at every change; name, number, best time and notes are never stored. A hand-written parser checks each field on load and falls back field by field; the step moves back to the first step that doesn't pass, so a reload on the review lands on Your details. The thank-you is never restored. A small inline script keeps what may change hidden (its space kept) until restored, so step 1 never flashes: the whole planner for saved answers, only the form for a `?dest=` link alone, so the header's `<h1>` still paints at once.
- **`?dest=`:** `/plan?dest=hunza` adds Hunza to the saved destinations (unknown values are ignored), then the parameter is removed with `replaceState`.
- **Motion** (ADR-0016): only the step body slides in, 28px over .35s with `--ease-out`, from the right going forward and the left going back; transform only. With reduced motion steps swap.
- **Layouts:** *(Owner feedback: the bars are dark frosted, `--filter-bar-bg`, and "Your trip so far" is a postcard; see below.)* From 1100px the progress sticks at the top of the form on the light frosted bar (`--light-bar-bg`), "Your trip so far" (`PlannerAside`: N of 9 answered, the nine rows, "What happens next" and the DTS line) is a 380px sticky column 64px beside the form, and Back and Next sit under each step (`StepNav`). Below 1100px a light summary bar sticks under the header (`PlannerSummaryBar`: a compact `Accordion` row with "Hunza · Jun · 4 people", opening to the nine rows, with the progress under it), Back and Next (and Send on review) sit in a dark frosted bar at the bottom (`PlannerBottomBar`, `--filter-bar-bg`), "Request a call back" stays inline, and "What happens next" follows the form. `useMediaQuery` (null while hydrating) picks where the progress renders, so only one progress heading is in the accessibility tree.
- **Radius:** destination choice cards are selectable option tiles, 8px (§5 item 9); the side column's panels, the review box and the message preview are panels, 8px (§5 item 10); inputs, the select, the textarea and the checkbox indicator 2px; buttons 6px; chips 999px.
- **Sizes and buttons:** text, tel and date inputs are 52px; the age select stays at #51's 48px (§5 item 20). Back is quiet as navigation and "Request a call back" secondary as an action (§5 item 7). Selected chips and cards use the shared selected state, not the design's solid fill (§5 item 16).
- Built here: `Input`, `Textarea`, `FormField`, `FieldError`, `CheckboxIndicator` (base); `TextLink`'s inline form and labelled button, `Select`'s error state, `Accordion`'s compact size, `KeyValueRow`'s row padding variable; `components/planner` (`PlannerProvider`, `PlannerProgress`, `DestinationChoiceCard`, `DestinationChoices`, `DatesField`, `ChoiceChips`, `CounterRow`, `ChildAgeSelects`, `PhoneField`, the step bodies, `StepNav`, `ReviewSummary`, `WhatsAppMessagePreview`, `PlannerSuccess`, `TripSummaryRows`, `WhatHappensNext`, `PlannerAside`, `PlannerSummaryBar`, `PlannerBottomBar`); `TripPlanner` and `PageHeader`'s planner variants (sections).

**Decided in the About PRD (#78, 2026-10-04):**

- **Route and metadata:** `/about`, one static page. `<title>` "About us, our guides and drivers | [BRAND NAME]", a meta description, and the header photo's 1200×630 crop as the share image. Page copy in `content/pages/about.json`; page data shaped in `lib/content/aboutPage.ts`. The header's Guides is marked on `/about` (About since PRD #118).
- **Sample claims (ADR-0019):** an object in content holding an invented claim about the company carries `sample: true` (only `true`; the owner confirms a claim by removing it; never shown). On About: the story and founder, each principle, each vehicle, the fleet age, the safety list, the travellers figure and each membership. Headlines and labels aren't flagged, nor the `trust` values. PRD 12's `launch:check` lists them. Stock photos of a vehicle type stand in for the fleet (vehicles only, no people, no other company's name readable at the size shown), credited on `/credits`.
- **`PageHeader`, About variant:** the `<h1>` at the long size, the lead (560px), then a full-width photo, 4:3 on phones and 21:9 from 820px from CSS alone (`MediaFrame`'s `wideRatio`), loaded first with high priority. A place photo (the Karakoram Highway) stands in for the design's team photo (ADR-0009). *(Owner feedback, 2026-10-05: a full-bleed photo cover instead; see the second feedback round below.)*
- **Principles** ("How we run every trip") are a `<ul>` of `PrincipleCell`s with `<h3>` titles and **no 01–04 numbers** (settles §5 item 36).
- **Guide fields:** `home`, `leads` (1–6) and `joined` (not before `trust.operatingSince`, not after the build year) are required; `licence` is optional and left out of sample content.
- **Guide profiles:** About's `GuideCard` is a `<button aria-haspopup="dialog">` with `id="guide-{slug}"`, named by its own words with the guide's name first (the portrait, which repeats the name, is hidden from it), the raised surface while its profile is shown; the Homepage card stays a link (settles §5 item 26). About's cards sit in an open hairline grid, so the part-filled last row ends cleanly *(a photo card grid with gaps since the owner's second feedback round)*. `GuideProfileDialog` is the `Sheet`: the bottom variant below 820px (no handle) and the drawer from 820px. The guide's name is the sheet's title (the dialog's `<h2>`), with the counter ("2 of 6"), previous and next in `Sheet`'s new header actions; the design's 32px name in the body goes (settles §5 item 33 for the profile). Close takes focus when any sheet opens, and focus returns to the card that opened the profile, even after previous and next. Previous and next wrap, scroll the sheet to the top and announce the guide ("Ali Raza, 2 of 6"). Rows: Home valley, With us ("Since 2016"), Languages, Leads, and Licence only when supplied. "Share this profile on WhatsApp" opens `wa.me/?text=` with no number (settings `whatsapp.guideShareMessage`). The profile's URL line ("/about#guide-karim-baig") is Geist, not Geist Mono (settles §5 item 37 for About). Sheet anatomy now shares one base for all sheets (settles §5 item 41 for About).
- **Profile links:** `/about#guide-{slug}` opens that profile after load (the browser has already scrolled to the card); a later `hashchange` opens another; an unknown guide or `#guides` opens nothing. Opening, previous and next write the anchor with `replaceState`, and closing clears it (path and search kept), so Back leaves the page and a reload shows the plain page; the design's `#guides` on close is dropped. A profile opened by a link moves focus to the shown guide's card on close. The state lives in `hooks/useGuideProfile` (and `hooks/useShownProfile`, which keeps the last guide in the sheet while it closes and starts a new one at the top); `guideForHash`, the rows, the counter and the share message are pure functions in `lib/utils/guideProfile.ts`.
- **Vehicles and safety:** `VehicleCard`s (MIN 200, max 2) with a full-width fleet-age row, beside `CheckList` ("How we keep you safe"), whose ✓ square is the planner's `CheckboxIndicator` at 2px, hidden from screen readers (settles §5 item 11 for About).
- **In numbers:** laid out as the trust strip, with a visually hidden `<h2>`. `StatCell` values use the `numeral` role (settles §5 item 33 for the stats). Years and trips come from the `trust` settings, travellers from page copy, and guides and drivers are counted (`lib/utils/companyStats.ts`).
- **Credentials:** `SectionLabel` can render as an `<h2>` (with its usual look), so heading navigation reaches the section; label-column `KeyValueRow`s (200px, max 820px). The licence and company registration are settings placeholders, shown as written; the Memberships row is left out with none.
- **`VisitOffice`** (`/sections`, shared with Contact in PRD 11): the headline, rows and labels are a `visitOffice` settings section (as `trust`); the address, hours and numbers stay in `contact`. Phone and WhatsApp are links once real, plain text while placeholders (`TextOrLink`, now a base component shared with the footer). "Get directions →" goes to a Google Maps search for the address in a new tab, and is left out while any part of the address is a `[placeholder]` (`hasPlaceholder`, `directionsHref`). The office photo takes the owner's photo only (`ownerImageSchema`), a placeholder until then. *(Owner feedback, 2026-10-05: the photo slot is a Google map of the address, ADR-0029, and "Get directions" opens Google Maps directions.)*
- **Reviews** (About variant): the long headline, no rating summary, and the reviews page copy chooses, in order (one to three; `content:check` fails on one that doesn't exist).
- **Closing CTA:** `ClosingCta` reused, its lead and anchor now optional; "Explore tours →" and "Plan a private trip" (`PlanningActions`).
- Built here: `TextOrLink` (base); `PrincipleCell`, `VehicleCard`, `CheckList`, `StatCell`, `PlanningActions` (`components/about`); `GuideProfileDialog`, `GuideTeam` and `GuideCard`'s About variant (`components/guide-profile`); `OurStory`, `HowWeTravel`, `VehiclesAndSafety`, `InNumbers`, `Credentials`, `VisitOffice` (sections); `PageHeader`'s and `GuidesGrid`'s About variants; `MediaFrame`'s `wideRatio` (21:9 and 4:5 from 820px); `Sheet`'s header actions; `SectionLabel`'s heading form.

**Decided in the Help, Contact and Legal PRD (#86, 2026-10-04):**

- **Routes and metadata:** `/help`, `/contact`, `/privacy` and `/terms`, static. Page copy in `content/pages/help.json`, `contact.json` and `legal.json` (one file for both legal documents); pages shaped in `lib/content/helpPage.ts`, `contactPage.ts` and `legalPage.ts`. Each has its own `<title>` ("Help and FAQs", "Contact us", "Privacy policy", "Terms and conditions", then the brand), a meta description and the Homepage's share crop (none has a photo of its own). No nav item is marked (Contact is, since PRD #118).
- **Sample legal and policy text (ADR-0020):** each Help policy, the Privacy Policy and the Terms carry ADR-0019's `sample: true` until the owner's lawyer has reviewed them; so do the FAQ answers with an invented claim about the company (ADR-0019), including the three tour-page answers taken from design copy. The Privacy Policy describes the site as built (no cookies, analytics or forms that send data; planner answers in the browser, ADR-0018; WhatsApp and Google Maps as third parties), and a change that adds any of those updates it in the same PR.
- **Tokens only:** every figure from settings in an answer, policy or legal section is a `{token}` (`textTokens`: settings, policy and company tokens; `settings.policies.refundPaidWithinDays` is new, sample 7). Tests fill every text with changed settings and find none of the old figures (`changedSettings`, `staleFigures` in `lib/content/testing.ts`). Payments read `{paymentMethods}` ("cash or bank transfer"), and "Cash · Bank transfer" in the trust strip (settles §5 item 43 for Help and Contact).
- **Shared FAQs (ADR-0024):** `content/faqs.json` holds Help's six categories (`id` for `#cat-{id}`) and 25 questions, each with an `id` that is its anchor (a slug, unique in the file, never `main`, `policies` or `cat-…`). Questions marked `tourPages` also show on every tour page, in file order, as before.
- **`PageHeader` variants:** Help (light, the statement size, then the search), Legal (light, the title, then "Last updated 4 October 2026" in a `<time>`, `LastUpdated`), Contact (dark, the `<h1>`, the lead at most 600px). *(PRD #86 kept a "Contact" `SectionLabel` beside the `<h1>` as an owner-approved exception, settling §5 item 32; the owner reversed it on 2026-10-04 and `PageHeader`'s `label` prop went with it.)*
- **Help FAQs:** `CategoryNav` is a sticky 240px list from 820px and a row of link chips below it (each named "Booking & payment, 4 answers"); CSS shows one, so one nav is in the accessibility tree. `FaqCategory` is the name as an `<h2>` at the `trustValue` role, then the plus `Accordion`, **none open by default, one open at a time** across the page (settles §5 item 18 for Help). "Link to this answer · /help#refunds" is Geist at the label role (settles §5 item 37 for Help). The two-column layout with a sticky side is shared (`sideLayout`, `sideColumn`, `sideTop`, `mainColumn` in `styles/layout.module.css`) by Help and the legal pages.
- **Answer links:** `/help#{id}` opens that answer after load, and a later `hashchange` opens another; an unknown hash, a category or the policies open nothing. Opening an answer writes its hash with `replaceState`; closing the one the address names clears it, keeping path and search. "Link to this answer" keeps the answer open and writes its link, with no jump or history entry (`hooks/useAnswerHash`; `replaceHash` is shared with About's profiles). `Accordion` gained an anchor per item, a controlled `open` and an `onToggle` callback.
- **Search:** in the browser, no library. The query and every question and answer are folded (lower case, accents removed, punctuation and curly quotes as spaces); terms under 2 characters are ignored; every term must appear, as part of a word. Matches open (the one-open group is lifted) with the terms in `<mark>` (the accent fill, the surface's text colour), other answers and empty categories are hidden, and both navs count the matches. The result line ("2 answers for “refund”") is a polite live region that settles 400ms after typing stops, its line reserved so nothing shifts. "Clear search", the empty state's button and Escape clear it, keep focus in the field and leave the address's answer open. The field is the shared 52px `Input` (`type="search"`, native clear hidden; settles §5 item 20 and §6's input states for Help) with the standard bordered 44px "Clear search" `IconButton` (settles §5 item 13). Nothing goes in the URL (`hooks/useHelpSearch`, `hooks/useHelp`, `HelpProvider`).
- **`EmptyState`** (`sections/EmptyState`) is shared by Tours, Help and the not-found page: the fixed headline at the section size (the design's `clamp(28px,3cqi,40px)` goes), a lead and two 52px actions. Help's: "Ask on WhatsApp" (the general message) and "Clear search".
- **Policies:** six `PolicyCard`s (MIN 280, max 2, a text grid with bleed): title (`<h3>`, `stepTitle`), summary, the `RefundTable` from the settings schedule ("14 or more days" 100%, "7–13 days" 50%, "Under 7 days" None; `refundTableRows`), then "Read the full policy", the caret `Accordion` in its new `link` size, which reads "Hide the full policy" while open from the open state alone.
- **Closing CTAs:** `ClosingCta` reused. Help's "Ask on WhatsApp" (primary 56, general message) and "Call us" (secondary 56, `tel:`) **only with a real phone number** (`AskActions`). `TrustStrip` on Help and Contact.
- **Contact:** a hidden "Ways to reach us" `<h2>`, then three `ContactChannelCard`s (`<h3>`s) in a fixed text grid, `2fr 1fr 1fr` from 1100px (§5 item 27): WhatsApp's number at the `sectionLong` role and "Chat now" (`wa.me/?text=` with no number while a placeholder), the phone and email at the `destination` role. Values are links only once real; placeholders are plain text. `OnTripPanel` (`#on-trip`, light, 8px; *dark beside the route map since the owner's feedback, see below*) with the travel support line and "Call travel support" (56, `tel:`; 48 in its row since the owner's feedback) only once the number is real; `OnTripMobileBanner` below 820px scrolls it in below the header (smooth unless reduced motion) and focuses the button, or the panel's heading without one. `VisitOffice` gained its **two-row form** (Office, Open, "Get directions" only for a real address). `QuickLinks`: `SectionLabel` as the `<h2>`, 64px rows at the `trustValue` role to `/plan`, `/tours`, `/help` and `/help#policies` (`routes.policies`), then "Follow the trips" with the social profiles as quiet 44 buttons once real.
- **Legal:** `TableOfContents` is a sticky 240px nav from 820px and a one-item `compact` caret `Accordion` ("Contents (10)") below it, whose links close it on tap. `LegalSection` is an `<h2>` "1. Who we are" at the `cardTitle` role with the number in `--fg-3` (numbers stay: a real outline), paragraphs at `bodyLarge`; the article is at most 35em and ends with "Questions about this policy? Email …" (a `mailto:` link once real). The Privacy Policy has ten sections ("Third parties" on its own).
- **Type roles for the design's off-scale sizes** (settles §5 item 33 for Help, Legal and Contact): Help category headings `trustValue`; the no-results headline `section`; legal section headings `cardTitle`; Contact's WhatsApp number `sectionLong`, phone and email `destination`, on-trip line `trustValue`, its number `cardTitle` (`stepTitle` in its row since the owner's feedback), quick links `trustValue`.
- The design's annotation chips and the copy-pasted "09 Trust strip" and "11 Footer" labels are designer notes: these pages reuse the shared strip and footer (settles §5 item 38).
- Built here: `LastUpdated` (base); `components/help` (`CategoryNav`, `FaqCategory`, `HelpProvider`, `HelpSearch`, `MarkedText`, `PolicyCard`, `RefundTable`, `AskActions`), `components/contact` (`ContactChannelCard`, `OnTripPanel`, `OnTripMobileBanner`), `components/legal` (`TableOfContents`, `LegalSection`); `HelpFaqs`, `Policies`, `EmptyState`, `WaysToReachUs`, `OnTripNow`, `QuickLinks`, `LegalBody` (sections); `PageHeader`'s Help, Legal and Contact variants, `VisitOffice`'s two-row form, `Accordion`'s anchors, controlled open, callback and link size, `Chip`'s link name, `Input`'s search type; the shared label-column layout (`labelRow`, `labelColumn`, `labelContent`), now also used by Credentials and the footer.

**Decided in the Pre-launch audit PRD (#94, 2026-10-04):**

- **`pnpm launch:check`** (`lib/content/leftovers.ts`, `scripts/launch-check.ts`): validates content, then walks every JSON file under `content/` (not a list of fields, so new content is covered) and lists what must be real before launch, by file and field, in this order: the brand name, the site URL, every other `[placeholder]` whole or partial (#83's `hasPlaceholder`), every `sample: true` object (named by its title, name, id or slug), every image still `{ placeholder, alt }`, and the maps until `maps.surveyOfPakistanVetted` is `true` (a new settings section nothing on the site reads). It exits 1 until nothing is left. It's separate from the build, `pnpm test` and the pre-commit hook, replacing #32's planned build check. The hero video (#38) isn't a blocker.
- **ADR-0022:** ADR-0019's `sample: true` also marks each sample tour, destination, guide and review (top level), each tour's `rating` on its own, and the `booking`, `trust` and `policies` settings sections. Reviews and guides added with `/add-review` and `/add-guide` are real and never get it.
- **`pnpm audit:site`** (ADR-0021, ADR-0025; `lib/utils/audit.ts`, `scripts/audit-site.ts`): builds, serves `out/` over HTTP/2 with TLS and gzip from a server inside the script (`/path` → `path.html`, unknown paths → `404.html` with 404), and checks every built page: Lighthouse's default mobile settings (simulated slow 4G, 4x CPU), LCP over 2.5 s or CLS over 0.1 failing, a page over a limit run twice more and judged on the median of three; axe-core's default rules at 390 and 1440 with reduced motion; exactly one shown `<h1>` at each width, a `<title>` no other page shares, a meta description, `og:image` and `twitter:image` in the build, a canonical URL and `og:url` that are the page's own URL (not on the 404), and a sitemap listing exactly the built pages minus the 404. TBT over 200 ms is a warning only, the lab stand-in for INP, which is checked by hand. It uses the story tests' Chromium.
- **The URL rule** (`siteUrlFor`, `lib/utils/siteUrl.ts`): the settings site URL plus a path, or the path alone while the site URL is a placeholder. Share images, canonical URLs, `og:url`, the sitemap, robots.txt and JSON-LD all use it.
- **Structured data** (`lib/utils/structuredData.ts`, `components/seo/JsonLd`, one `<script type="application/ld+json">` per call, with `<` escaped): `TravelAgency` on the Homepage (brand as written; phone, email and address only once real; real social links as `sameAs`; "Cash, Bank transfer" and PKR; no rating); `TouristTrip` + `Product` on each tour page (typed as both, so its rating and reviews sit on a type that allows them, #117; summary, share image, trip types as labelled, provider, the itinerary as an `ItemList`, one `Offer` per upcoming departure with its twin price in PKR, availability from seats, `validThrough` the start date and a `Trip` with the dates; `aggregateRating` only when neither the tour nor its rating is sample and it has reviews; only unflagged reviews); `FAQPage` on `/help` (every question in page order) and on each tour page (the questions it shows). The phone, email, address and social links are left out while they have a `[placeholder]` part; the brand name shows as written. No `BreadcrumbList` or `Event`; `Product` only as the tour's second type (#117).
- **Canonical URLs, sitemap and robots:** `CanonicalMeta` (`components/seo`) writes `<link rel="canonical">` and `og:url` on every page except the 404, as React-hoisted tags like `ShareImageMeta` (Next's metadata would turn a root-relative URL into a localhost one); filtered `/tours?…` and `/plan?dest=` share their page's canonical. `app/sitemap.ts` and `app/robots.ts` are static metadata routes: every route-map page plus each tour and destination, no anchors, queries, 404, `lastmod`, `changefreq` or `priority`; robots.txt allows everything and names the sitemap only once the site URL is real.
- **Not-found page** (`app/not-found.tsx`, `content/pages/not-found.json`, `lib/content/notFoundPage.ts`): `PageHeader` (dark, the `<h1>` "We can’t find that page" and a lead), the shared `EmptyState` ("Looking for a trip?", "Browse tours" and "Ask on WhatsApp" with the general message) in the text pages' body shell, then Contact's `QuickLinks`, which takes its rows as props (Contact's four unchanged; the 404's four to `/plan`, `/destinations`, `/about` and `/help`, named in copy by their route-map page). Its own title and description, the Homepage's share crop, `noindex` (from Next), not in the sitemap, no nav item marked.
- **Lists of cards** get `cardTour` (`lib/utils/cardTour.ts`): the card's fields and what the lists filter on, never the whole tour, since everything passed to a client component is written into the page's HTML.
- Built here: `JsonLd`, `CanonicalMeta` (`components/seo`); `RouteText` (`components/tour`: a route shown with arrows, read as "Lahore to Hunza"); the not-found page; `quickLinksSection` and `notFoundPage` (`lib/content`).

**Decided in the page-only navigation PRD (#118, 2026-10-04):**

- **Destinations page** (`app/destinations/page.tsx`, `content/pages/destinations.json`, `lib/content/destinationsPage.ts`): every destination on one page, built only from existing parts: the dark `PageHeader` (Tours' variant, the `<h1>` and lead), `DestinationsGrid`'s home variant (its `<h2>`, then the six cards in content order, each an `<h3>` linking to `/destinations/{slug}`; the first two load their photos straight away, since on phones the first row's photo is the LCP element, the rest lazily), then `PrivateTripBanner` as its own section (the Tours banner's photo, `/plan` and WhatsApp with the general message). Its own title and description; the share image is the first destination's 1200×630 crop (the Homepage's while it has no photo). `routes.destinations` is now this page, so "← All destinations", the Planner's "Explore destinations", the 404's quick link, the sitemap and the canonical URL all use it.
- **The main nav links only to pages (ADR-0026):** Tours, Destinations, Private trips, About and Contact, one list (`mainNav`) for the header, the mobile menu and the footer's large links (`NavLinks`' `footer` variant, named "Footer"). The footer's "About us" is now "About", and its small links are Help, Privacy, Terms and Photo credits after social. Help stays a footer link; the header keeps five items so it fits at 820px beside the brand and "WhatsApp us". *(Changed by ADR-0027; see the owner's first feedback round below.)*
- **Active item from the URL only** (`activeNavItem`): an item marks its own page, and Tours and Destinations also every page under them. The Homepage's scroll-spy (#46) is gone, with `routes.how`, `routes.reviews` and the `how`, `reviews` and `destinations` section ids nothing links to any more. `useScrollSpy` and `sectionInView` (now `lib/utils/scrollSpy.ts`) stay for the itinerary's current day, which passes its own line.
- **In-content links to a section of another page stay:** the Homepage's "Meet the team →" (`/about#guides`), guide cards (`/about#guide-{slug}`) and Help answers (`/help#{id}`). The pages-only rule is for the nav.
- Built here: the destinations page; `getDestinationsPage` (`lib/content`); `NavLinks`' footer variant.

**Decided in the owner's first feedback round (2026-10-04, no issue):**

- **The Trip Planner is dark** (owner decision from the prototypes, "Direction 3"; the light planner of PRD #71 is reversed): no `data-surface="light"`. Step 1 opens on a photo band (`PageHeader`'s `planner` variant now takes `image`: `clamp(360px, 30cqi, 460px)`, sliding under the header, the `<h1>` and lead on the hero scrim drawn taller, the photo the page's LCP and share image, from `planner.json`'s `header.image`, Skardu's Shangrila). From step 2 the band goes and the slim `<h1>` stays, so the step change is calm. The progress, summary and bottom bars are the dark frosted bar (`--filter-bar-bg`, `data-surface="dark"`); `--light-bar-bg` and the light placeholder stripes are gone ("Help me choose" uses the dark stripes). The summary bar now follows the header (no `order: -1`) and sticks once scrolled to. **`PlannerAside` is a postcard**: an 8px raised card with the first chosen destination's card photo (16:10, `MediaFrame` fill) and the places over it on the hero scrim (`postcard` in `lib/utils/plannerPostcard.ts`: "Hunza + Skardu", "Your trip" on `aside.image`, the Karakoram Highway, with none or only "Help me choose"), then "Your trip so far" and "2 of 9", the road from the departing city (`RouteText`), and the rows; empty rows read "Not yet" (`aside.notYet`) in `--fg-3`, also in the summary bar. The photo simply swaps. The aside is focusable, as it can scroll on a short screen. No thumbnail in the summary bar (kept simple).
- **Contact's "On a trip right now?" panel sits on the route map** (owner decision from the prototypes, "Direction 3"): `OnTripPanel` is a raised dark panel (`--bg-raised`, hairline border, 8px), no longer light. Left: the `<h2>` "On a trip right now?" (the eyebrow look, which the phones' banner still focuses without a number), the line "Call your guide, or our travel support line." (`trustValue`), then two hairline rows: "Your guide" with "Number in your trip confirmation", and "Travel support · 24/7" with the number as written, and a 48px "Call travel support" (`tel:`) only once it's real. Right: `RouteMap` with the new `decorative` prop (hidden from screen readers, no legend; the existing route content, so the Survey of Pakistan vetting flag covers it) at `--map-min-w` 440px, the narrowest the labels fit; it wraps under the words below about 980px (where the 360px words, the gutter and the map no longer fit in the panel), and is left out on phones (below 820px), where it would be a tall drawing under the words. Copy: `onTrip.guide` and `onTrip.support`; the props come from `getContactPage`'s `routeMap`.
- **Home joins the main nav (ADR-0027):** Home (`/`), Tours, Destinations, Private trips, About, Contact, in the header, the menu and the footer's large links. Home is gold with `aria-current="page"` on the Homepage only. Six items need about 880px beside the brand and "WhatsApp us", so the header's nav collapses below **960px** (it was 820px); between 820 and 960 the header shows the WhatsApp icon and the menu, as on phones. `--nav-gap` is unchanged. The other 820px switches (sheets, Tours columns, calendar) stay.

**Decided in the owner's second feedback round (PRD #124, 2026-10-05):**

- **Photo card grids have gaps, not hairlines** (#125): destinations (Homepage, `/destinations`, other valleys), guides (Homepage, About), highlights, hotels and About's vehicles. `photoGrid` (24px between cards, 48px between rows) and `photoGridDense` (16px and 32px, the six and five destinations across) with `cardCell` in `styles/layout.module.css`, sharing the tour cards' gap tokens (`--grid-tours-gap` and `--grid-tours-row-gap` are now `--grid-card-gap` and `--grid-card-row-gap`); the open hairline grid (`openGrid`/`openCell`) is gone. Each card stands on its own with its photo at 8px; About's guide card takes the card radius for its raised surface; Hotels' width cap allows for the gaps; the fleet's age is a row under the vehicles, its hairlines clear of the photos. The text-cell hairline grids are unchanged.
- **The planner's rhythm, one length question and a "Help me choose" photo** (#126): every question on every step has `--form-question-y` (32px) above and below the hairline between questions, and every label or legend sits `--form-label-gap` (16px) above its control. The fieldset reset in `FormField` is now weightless (`:where(.group)`), so the step body's padding and hairline reach group questions too; before, a group (Dates, Trip length, every chip question) lost them and sat tight under the question above. "Roughly … days" goes with its stepper, the auto-filled length and its hint, and the saved `days` and `lengthAuto` (old saved data with them still reads, the extra fields ignored); the dates line is the month alone ("Jun 2027"), and the message, review and "Your trip so far" use the picked length. The "Help me choose" card shows `whereWhen.destinations.unsureImage` (K2 and the Karakoram from the air, Khankayani512, CC BY-SA 4.0, cropped), credited on `/credits` with the planner's other photos.
- **Several answers to most planner questions** (#127): months (Flexible; at least one, none past), trip lengths, group type, hotels, transport, budget and the best time to call take any number of chips. Each is a list kept in its options' order (`toggled` in `lib/utils/plannerOptions.ts`; months earliest first), whatever order they were pressed in, and a second press unpicks a chip. `ChoiceChips` takes the picked options as a list; the chips stay `aria-pressed` toggles with the same selected look. **Departing from stays one city** (owner decision, 2026-10-05): Lahore by default, another replaces it, "Other city" shows its field. The date mode and the counters are unchanged. Several picks are joined in the review, "Your trip so far", the WhatsApp message and the call back: "Jun, Jul 2027", "Dec 2026, Jan 2027" (`shortMonthsYears`), "Comfortable, Upgraded", "best time morning, evening"; the summary bar shows the first month. Saved answers moved to `planner-answers-v2` (ADR-0018's rule: a new shape starts clean, v1 is never read); the parser keeps only known options, once each, in order.
- **The office's real address and phone, and a map** (#128, ADR-0029): `contact.officeAddress` is "3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000" and `contact.phone` "+92 42 3725 2511", from the owner's Google Maps listing (both confirmed by the owner, 2026-10-05). Every place that reads them picks them up: the footer (the phone a `tel:` link), "Visit the office" on About and Contact, Contact's ways to reach us, Help's "Call us" (now shown), the Privacy Policy and Terms (`{officeAddress}`, `{phone}`) and the TravelAgency structured data. The 24/7 travel support line and the office hours stay placeholders. "Get directions" opens Google Maps directions (`/maps/dir/`). The map, its link and the directions come from one helper, `officeOnMaps` (none of them while the address or the query has a placeholder), and use `contact.officeMapQuery` ("Codeupnow, Ex Air Avenue, Block R, DHA Phase 8, Lahore"): Google doesn't know the plot or the floor, so the owner's listing name pins the exact building, and the map's card names it "Codeupnow" (owner's choice, 2026-10-05). The office photo slot is `OfficeMap` (`components/contact`): Google's keyless embed of the address in an `<iframe>` (`loading="lazy"`, a `title` from `visitOffice.mapTitle`), 4:3 at 8px, then "Open in Google Maps"; the loaders build it (`officeMap`, typed `OfficeMapData`, in `lib/utils/contact.ts`), and stories pass a stand-in page so tests never load google.com. `visitOffice.image` is gone (`ownerImageSchema` stays for the guides and the founder). The Privacy Policy says About and Contact load a Google map that may set Google cookies and receives the visitor's IP address, and its date moved to 2026-10-05.
- **The footer without its label, and About's photo cover** (#129): the footer's "Contact" `SectionLabel` and its label column go; the large page links start at the left margin and the contact column stays on the right (under the links on phones). `SectionLabel` stays for About's Credentials and Contact's Quick links. About's `PageHeader` is a full-bleed cover, built like the planner's photo band: the same photo and credit fill a header as tall as the tour hero (`--photo-hero-h`, `clamp(600px, 50cqi, 740px)`) that slides under the sticky header, on the hero scrim drawn taller at every width, as on the planner's band (at its plain size the long `<h1>`'s top line met lighter rock, under 3:1 at 1366; drawn taller, the lightest pixel behind it measures 8:1), with the one `<h1>` (the long size) and the lead in `--fg` over its lower part. The photo stays the LCP image: eager, `fetchpriority="high"`, its width and height set. `MediaFrame`'s 21:9 wide ratio and `--page-header-media-top` went with the old wide photo.

**Decided in the owner's third feedback round (2026-10-05, no issue):**

- **Hairline grids never paint an empty cell:** the grid's 1px gap over a `--hairline` background left a solid grey block wherever the last row wasn't full (a lone review beside nothing on Fairy Meadows, four notes or steps in three columns, three reviews in two, five quick facts in four). Now each `cell` draws its lines with a 1px `--hairline` outline that meets its neighbour's in the gap, and `grid` paints nothing: its top and bottom borders are transparent and hold the outer lines, and `textGrid`'s clip takes off the outer side lines (and the top and bottom ones where a grid sets `border-block: none`, as the trust strip and About's numbers do). Full rows look as before; a part-filled row simply ends, and a single review is one card in the first column. The season calendar's months and Contact's ways to reach us, which built their own hairline grids, draw them the same way. The stories check it (`expectOpenHairlines` in `.storybook/gridColumns.ts`: ReviewsSection's `OneCardInThreeColumns` and `ThreeCardsInTwoColumns`, GoodToKnow's `FourNotes`).
- **The places map draws a route line:** the destination PRD (#63, #67) left lines out, as content has no road geometry; the owner expects one, as on the itinerary maps. It's a schematic, not the roads: straight legs joining the places in visiting order, the numbers on the pins and in the list (`placesRoute` in `lib/utils/placesMap.ts`), drawn like the route map's main route (`--fg`, `--map-route-width`, round joins, a non-scaling stroke) under the pins. A map label marked `entry: true` in content is the way in (at most one): the line starts at the edge beside it ("↑ Raikot Bridge" on Fairy Meadows, "↓ Gilgit" on Hunza; `entryPoint`), or at its place when it's on the map. Context labels now sit on a chip of the page's colour (`--bg`), like the lit pin's name, so the line passes under a name rather than through it; the chip also hides the graticule under a name. Every one is 8px clear of its point (the top and bottom edge ones were flush). Places are in visiting order in content: Hunza's now run up the valley from Gilgit (the Rakaposhi viewpoint first, Passu last); the other four already did, and two place lines were reworded to match it (Skardu's Shangrila, Fairy Meadows' Beyal Camp). Murree has no places and no map. The lit pin and its row work as before; the stories check that the line's corners are the pins' centres in order and that each pin sits over it.

**Decided in the owner's fourth feedback round (2026-10-05, no issue):**

- **"Help me choose":** the destination card that asks for advice (until now "Not sure, suggest something") reads "Help me choose" on the card, in the review, "Your trip so far", the WhatsApp message ("• Destinations: Help me choose") and the error ("Choose at least one destination, or “Help me choose”."). The saved id stays `unsure`, so saved answers still read. The compact summary bar reads it too ("Help me choose · Dates? · 2 people"; owner, 2026-10-05).
- **The same visible gap between every letter of "NORTH":** one tracking value (`--ls-display`, now gone) left the gaps uneven, as each glyph carries its own side space: at 1366 N–O and O–R were 25.5px, R–T 6.5px and T–H 14.5px. Now `HomeHero` sets a `<span>` per letter (`displayLetters` in `lib/utils/displaySpacing.ts`), each cancelling its measured side space with negative inline margins (`--lsb`, `--rsb`), and the word is a flex row with `--display-gap` (.05em) between the letters' ink: about 18px at 1366, all four within 1px at 390, 1366 and 1440, the word as wide as before. The side space is Geist semibold's, measured in the browser at 1000px; the R's right side is measured where the hero's bottom edge cuts its leg, as that is the ink that shows. The N's ink now starts on the margin, so the word no longer takes `--indent-display`. `pnpm content:check` rejects a display word with a letter missing from the table.

**Decided in the altitude ticker nav PRD (#135, 2026-10-05, ADR-0030):**

- **Heroes start below the nav** (#136; owner: “nav doesn't cut the hero image”): the Homepage hero, `PhotoHero` (tour and destination), About's cover and the planner's band lost their `margin-top: calc(-1 * var(--header-h))` and the top padding that only cleared the header. Each starts at the header's bottom edge. The Homepage hero is the first screen, clamped to 700–980px as before, less the header (`--hero-h`), so it still ends at the fold; the other heroes keep their heights, measured from below the header, and their text keeps its place (`PhotoHero`'s top padding is 24px, About's cover 96px and the planner's band 48px, as before from the header's edge). The scrims are unchanged.
- **The 2f header** (#137): `SiteHeader` is a solid `--ink-900` bar (no blur, no hairline; the `@supports` fallback is gone), `--header-h` 76px from 1200px and 64px below, so the sticky offsets and scroll padding follow. `BrandMark` is 30px/800, −.05em (24px below 1200px) with a gold `aria-hidden` ▲; the link is named "[BRAND NAME]". The header's links are 18/700, −.02em, 36px apart (`--nav-gap`); the menu's take 700. The full bar's "WhatsApp" link (52px, 16/700) and, below 1200px, the 48px "Chat on WhatsApp" square and the "Menu" text button (48px, 15/700) share one bordered style, `barControl` in `SiteHeader.module.css` (2px `--fg` border, `--bar-border-width`), which `MobileMenu` composes; they're the header's own, not `Button` or `IconButton` variants. The full bar needs about 1,154px with "[BRAND NAME]▲" at 48px margins (measured on the built site), so it shows from **1200px** (ADR-0030, superseding ADR-0027's 960px); the 820px switches are unchanged. `mainNav` and the active rule are unchanged. The menu icon went with the icon button. `--header-bg` and `--header-backdrop` stay for the frosted bars that still use them. Storybook's `headerBreakpoint` viewport is now 1200 and `belowHeaderBreakpoint` 1199; `parkPointer` moved to `.storybook/` for the header's colour checks.
- **The altitude strip** (#138): `AltitudeStrip` (`sections/AltitudeStrip`, a client component) renders on the Homepage only, before `<main>` (so the skip link passes it), as a `<nav>` named "Altitudes of our destinations". Its places come from `altitudePlaces` (`lib/utils/altitudeStrip.ts`): one per destination in content order, the name, `/destinations/{slug}` and `formatElevation(altitude)`; no destinations, no strip. Each place is one link (the name at 600, then the decorative ▲ and the altitude). The list is drawn twice for the loop; the copy is `aria-hidden` and `inert`. `hooks/useTicker` runs it only when the visitor allows motion and the script has run: it measures one drawing (each at least the strip's width, so the loop never shows a gap) and the CSS animation moves it at `--ticker-speed`. Hover and focus among the places pause it (`animation-play-state`); a place with a keyboard focus ring stops it (`:has(:focus-visible)`) and the hook scrolls the place into view, then resets when focus leaves. The pause button is a 44px square at the end: a standard toggle with one name, "Pause the altitude strip", and `aria-pressed="true"` while paused (the icon switches between pause and play; the name never does), from `home.json`'s `altitudes` with the strip's name. *(The tickets had the label switch to "Play the altitude strip" as well; changed before merge so the name stays fixed, the usual toggle pattern.)* The strip is `--tap` (44px) tall on both widths, not the drawing's 36/32px, so the button fits. Reduced motion, or no script: no copy, no button, a still strip that scrolls sideways (its scrollbar hidden). Geist Mono is loaded for it with `next/font` (Homepage only, `display: optional`). The Homepage hero subtracts the strip (`--hero-h`). New icons: `pause`, `play`.

Open questions are in §6, grouped by the PRD that settles them.

Token names used below: `ink-900 #0C1216`, `ink-800 #121A1F`, `line #253038`, `line-strong #5C6871`, `text #F1EEE8`, `text-2 #B7BFC5`, `text-3 #8F9AA2`, `gold #D9B44A`, `gold-hover #E3C366`, `gold-pressed #C9A43C`, `on-gold #10161A`, `mist-50 #EEF1F3`, `mist-100 #E2E7EB`, `line-light #CBD2D8`, `line-strong-light #7D8992`, `ink-text #10161A`, `ink-text-2 #46525C`, `ink-text-3 #5B6770`, `gold-deep #7A5A12`.

Breakpoints that recur in page scripts: **mobile < 820px** (sheets replace dropdowns). **header < 1200px** (the full bar gives way to the WhatsApp square and Menu; ADR-0030, 960px under ADR-0027). **compact < 1100px** (Tour Detail and Planner drop their side column and use bars and sheets instead). **≥ 1280px** (Tour Detail shows the side map). Tour Detail also switches the booking panel to its compact form when **viewport height < 920px**.

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
| 17 | `SectionLabel` (13px label, text only) | footer (all), About, Contact | static | 2+ pages |
| 18 | `BrandMark` (brand name and a gold ▲, no logo) | header (all) | static | shared |
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
  - **header**: "WhatsApp us", 44px, padding `0 18px`, 14/500, border `rgba(241,238,232,.5)`, WhatsApp icon. This style is not in DESIGN §7 (see Inconsistencies). *(Replaced by the 2f header's bordered controls, PRD #135; DESIGN §7.)*
- **Sizes found:** 56 (closing CTAs, footer, mobile menu, Contact support), 52 (standard), 48 (TourCard, BookingPanel's secondary, TD sticky bar, planner mobile bar, TD departure rows, About profile share), 44 (header, Contact social). At 48px the label is usually 15px. At 52 and 56 it is 16px.
- **States:** default, hover (gold-hover plus arrow +4px, shown in DS and TourCard), pressed (gold-pressed, DS only), focus (2px outline in the text colour, 3px offset, DS only), **disabled**. Disabled is the line fill with `text-3` text and `cursor:not-allowed` (BookingPanel "Reserve" with no date, `BookingPanel:88`). It also appears as the look-alike "No trips match" in the Tours filter sheet (`Tours:287`). Selected: TD's "Selected ✓" is a gold fill with a `gold-deep` border on light (`Tour Detail:329`). Hover for secondary and quiet buttons is not designed.
- **Layout props seen:** `flex:1 1 auto` pairs that wrap (hero, CTAs, banners), full width (sheet, footer, menu), `align-self:flex-start`, `white-space:nowrap`.
- **Behaviour:** renders as `<a>` or `<button>`. Every WhatsApp button links to `wa.me` with a pre-filled message (Planner annotation "WHATSAPP · Standard wa.me link with the message pre-filled"). Buttons are never animated (RULE annotations on Home, TD, Tours, Destination and Planner).
- **Client?** No. It stays static, and the parent passes `onClick` where needed.

#### 2 `IconButton` — `components/ui/IconButton`
- 44×44 (header, sheets, stepper, accordion, profile nav) or 48×48 (TourCard and TD sticky-bar WhatsApp). Radius 6px.
- **Border variants:** `rgba(241,238,232,.5)` (header WhatsApp and menu; *the header's own 2px controls since PRD #135*), `line-strong` (dark: close, prev/next, steppers, TourCard WhatsApp), `text` (TD sticky bar WhatsApp), `line-strong-light` (light: steppers, accordion +), **none** (Help search clear, `Help:72`).
- **Glyphs:** WhatsApp icon, menu (two 16×1.5px lines, gap 6; *gone with PRD #135: the header's Menu is a word*), `×` (22/300), `←`/`→`, `−`/`+` (20px), accordion `+` (22/300, rotates 45° when open).
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
- `−` [value] `+`: two 44px `IconButton`s (6px radius), value 18/500 tabular, min-width 32, gap 6. *(The planner's "Roughly N days" row, at 28, is gone since the owner's second feedback round.)*
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
- 13/500 `text-2`, height 28, `flex:0 0 240px`. *(The design's 11×10 triangle before it was removed, owner feedback 2026-10-04: text only.)*
- Used in the footer "Contact" (all pages), About "07 Credentials", Contact "05 Quick links". Static. *(Contact "01 Header" had one too, removed by the owner on 2026-10-04.)*

#### 18 `BrandMark` — `components/ui/BrandMark`
- "[BRAND NAME]" 16/600 (`-.01em`), min-height 44, links home. Static. *(The design's 16×14 triangle stand-in for a logo is removed, owner feedback 2026-10-04: the brand shows its name only until the owner supplies a logo.)* *(PRD #135, 2f: 30px/800, −.05em, 24px below 1200px, then a gold ▲ the owner kept, `aria-hidden`, so the link is named by the brand alone. Header only.)*

#### 19 `KeyValueRow` / `ListRows` — `components/ui/KeyValueRow`
- **Justified pair** (label `text-3` left, value right, 15px, padding `14px 0`, bottom hairline, top border on the list): footer contact rows (all pages), About "Visit us", Contact "Visit the office".
- **Label-column pair** (fixed label column 100–200px): Credentials (200px), Destination getting-there (120px), Planner summary (100/110px grid), Planner review (110–180px), About profile (120px), TD itinerary `<dl>`.
- **Room-price row** (TD "Room sharing", light): title 16/500 plus sub 13, price right 16/500.
- Surface follows the parent: `line` on dark, `line-light` on light. Static.

#### 20 `FormField` (+ `FieldError`) — `components/ui/FormField`
- **Field heading:** label 20/500 plus hint 13 `ink-text-3` ("Required", "Optional", "Required · choose one or more", "Lahore by default"). *("Optional · filled from your flexible dates" went with the days, owner feedback 2026-10-05.)*
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
- **Tour card grids have gaps, not hairlines** (owner feedback, 2026-10-04): `--grid-card-gap` 24px between cards side by side and `--grid-card-row-gap` 48px between rows, no lines on the list or the cells, everywhere tour cards are listed (`tourGrid` and `cardGrid` in `styles/layout.module.css`). The capped auto-fill columns take the gap from `--grid-gap` (1px unless a grid sets it, so the hairline grids are unchanged). A card's raised hover surface has the 8px card radius; Destination's see-all cell is an 8px block with a hairline border; Tours' banner sits between the rows with no line. Earlier notes: a hairline grid of TourCards. Home uses max 4 columns (MIN 280). TD uses max 3 (MIN 280). *(Built in PRD #63: Destination uses Tours' explicit 1/2/3 columns with per-card hairlines, `cardGrid` in `styles/layout.module.css`, so the see-all cell on a short row leaves no grey cell.)* Tours uses explicit 1/2/3 columns (< 820 / < 1100 / else), in **two chunks around `PrivateTripBanner`**: the first row (2 cards on mobile, n columns otherwise), then the banner, then the rest. Sold-out trips sort last.
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
- *(Built in PRD #47: hotels are never named; the title is generic, "Hotel in Karimabad", over a photo of the town or valley. The grid is capped auto-fill, MIN 160 so five fit beside the aside, never more columns than stays and at most 320px per stay, drawn as an open hairline grid so a wrapped row leaves no filled empty cells.)* *(Owner feedback, 2026-10-05: a photo card grid with 24px/48px gaps; the width cap allows for the gaps.)*

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
- **DestinationChoiceCard:** a grid MIN 150 of `<button aria-pressed>` cards with a 1px border (0 radius), a light `MediaFrame` 16:10, a checkbox and a label 15/500. Off: `line-light` border, `mist-50` fill. On: `ink-text` border, `mist-100` fill. Error: `gold-deep` border. The 7th card is "Not sure, suggest something" ("WE'LL SUGGEST"). Multi-select. *(Owner feedback, 2026-10-05: it has a photo of its own, Karakoram peaks from the air, from page copy, and reads "Help me choose", with no caption.)*
- **StepWhereWhen:** Destinations (required), Dates (required: an "Exact dates / Flexible" chip pair. Exact shows From/To date `Input`s. Flexible shows month chips), Trip length (optional chips, the only length question). *(The design's "Roughly [Stepper] days" and the length auto-filled from it were built in PRD #71 and removed by the owner on 2026-10-05.)*
- **StepWhosComing:** Group size `CounterRow`s (Adults "18 and over", Children "Under 18"). `ChildAgeSelects` (one per child, "Under 2"…17) appears when children > 0. Then the chip groups: Group type, Hotels, Transport and Budget per person take any number of chips (owner feedback, 2026-10-05; the design had one each), and Departing from takes one city (default Lahore; "Other city" shows a text `Input`).
- **StepDetails:** Name (required), WhatsApp number (`PhoneField`, required), Best time to reach you (chips, any number since the owner's second feedback round), Anything else? (`Textarea`), and a privacy line with a link.
- **Validation (Views 1e, 2d):** shown after the user presses Next. Messages: "Choose at least one destination, or 'Not sure, suggest something'."; "Pick a month, or switch to exact dates."; "Add a start and an end date."; "The end date is before the start date."; "Add an age for each child."; "Add your name so we know who to reply to."; "Add your WhatsApp number so we can reply."; "This number looks incomplete (N of 10 digits). Pakistani mobile numbers have 10 digits after +92, for example 3XX XXX XXXX." On failure the page scrolls to the first invalid field (with the sticky offset) and focuses it. *(Owner feedback, 2026-10-05: the first reads "Choose at least one destination, or “Help me choose”.")*
- **StepReview / ReviewSummary:** a bordered box (0 radius) with three sections (title 17/500 plus an "Edit" text button that jumps to that step and focuses its first field) and label/value rows ("Not given" in `ink-text-3`). Then **WhatsAppMessagePreview** (icon plus "Message preview", a `mist-100` box with `pre-wrap` 14/1.6, and "Opens WhatsApp with this message ready to send. Nothing is sent until you press send there."). Desktop actions: Back (quiet light 52), **Send on WhatsApp** (primary 52 with icon, `wa.me` link), **Request a call back** (secondary light 52 → **opens WhatsApp**, override). On mobile only the call-back button is inline; Send lives in the bottom bar.
- **PlannerSuccess:** a 44px round ✓ (`ink-text` fill), H2 "Thanks, {first name}." (focused on arrival), a line, primary "Browse tours →" plus secondary "Explore destinations", and the "Plan another trip" text button (resets).
- **StepNav** (≥ 1100, steps 1–3): a hairline, then Back (quiet light 52, hidden on step 1), a spacer, and primary 52 "Next: Who's coming →" / "Review →".
- **PlannerBottomBar** (compact, steps 1–4): sticky to the bottom, **dark** frosted `rgba(12,18,22,.92)`. Back (quiet dark 48) plus a primary 48 "Next →" / "Review →" or "Send on WhatsApp".
- **Behaviour:** "SAVE · Answers are kept when going back a step or reloading the page" (localStorage key `planner-answers-v1`, answers plus step; `planner-answers-v2` since the answers became lists, owner feedback 2026-10-05). "URL · ?dest= from Destination and Tour pages pre-selects that destination". "MOTION · Steps slide gently (translateX 28px → 0, .35s); reduced motion: steps simply swap". "RULE · Buttons and error messages are never hidden by animation". After a step change the page scrolls the main column to the top (minus the sticky offset) and focuses the step heading. Header copy changes: the H1 intro shows on step 1 only, and steps 2+ show the slim "Planning your private trip".
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
- **OnTripPanel** ("03 On a trip right now"): a **light** block with **8px radius** inside the dark page (`role="region"`). *(Owner feedback, 2026-10-04: a raised dark panel with the route map; see the owner's first feedback round.)* Eyebrow 13/600, H `clamp(26px,3cqi,40px)`, number `clamp(22px,2.4cqi,32px)`/600, primary 56 "Call travel support" (`tel:`).
- **OnTripMobileBanner:** mobile only. A full-width 52px `mist-50` strip below the header: "On a trip right now? Get help ↓". Clicking it scrolls to `#on-trip` (offset 88) and focuses the call button. Client.
- **QuickLinks** ("05 Quick links"): a `SectionLabel`, then big link rows (min-height 64, `clamp(22px,2.4cqi,32px)`/500 with →, hairlines) plus "Follow the trips" with three quiet 44px social buttons.
- Annotations: "NO FORM · WhatsApp and phone are the main channels for now"; "MATCH · Reply time must match the planner, Help and Tour Detail".

#### About components — `components/about`
- **PrincipleCell** ("03 How we travel"): number 13 `text-3` "01", title 20/500, text 15. Text grid MIN 240, max 4 columns.
- **VehicleCard** ("05 Vehicles and safety"): `MediaFrame` 4:3, name 18/500, desc 14. A 2-column hairline grid plus a full-width row "Average age of our fleet: [X] years". *(Owner feedback, 2026-10-05: the vehicles are photo cards with gaps, and the fleet's age a row under them.)*
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
| `SiteHeader` (+ `MobileMenu`) | ✓ (no active) | ✓ active Tours | ✓ active Tours | ✓ active Destinations | ✓ active Private trips (the design's menu lacks the WhatsApp CTA, added in PRD #32) | ✓ active About | ✓ | ✓ active Contact | ✓ |
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
- Sticky, 72px, `rgba(12,18,22,.86)` with `backdrop-filter: blur(18px) saturate(140%)` (M3 "frosted"; solid `ink-900` when unsupported), bottom hairline, `data-surface="dark"`. Contents: `BrandMark`, then on desktop a nav (14/500, gap 32, min-height 44 per link, active item gold) and the header WhatsApp button. `SiteHeader` is server-rendered; only `NavLinks` (reads the path) and `MobileMenu` (open state) are client components. *(PRD #135, 2f, ADR-0030: solid `ink-900`, no blur, no hairline, 76px from 1200px and 64px below; links 18/700, −.02em, 36px apart; a bordered 52px "WhatsApp" link, 2px `--fg` border, 16/700.)*
- **Below 960** (820 before ADR-0027): a WhatsApp `IconButton` 44 plus the menu `IconButton` 44. *(PRD #135: below 1200, a 48px bordered WhatsApp square, "Chat on WhatsApp", and a bordered "Menu" text button, 48px, 15/700. Both share the header's `barControl` style; the menu icon is gone.)*
- **MobileMenu:** the `Sheet` drawer (side), titled "Menu", with the nav links in the `footerNav` role (min-height 44, hairlines, active item gold; 700 since PRD #135) and a primary 56 "Plan on WhatsApp" on every page. It closes on link tap, the close button, the backdrop and Escape, returning focus to the menu button. *(The design shows a panel below the header with no Escape or focus handling and no WhatsApp button on the Planner; PRD #32 replaced it.)*
- **Nav items** (ADR-0026, ADR-0027, `mainNav` in `lib/utils/nav.ts`): Home (→ `/`), Tours (→ `/tours`), Destinations (→ `/destinations`), Private trips (→ `/plan`), About (→ `/about`), Contact (→ `/contact`), the same list in the header, the menu and the footer's large links. Every item is a page, never a section. The current page's item is gold with `aria-current="page"`, from the URL alone: Tours on `/tours` and `/tours/*`, Destinations on `/destinations` and `/destinations/*`, Home on `/` only, and the other three on their own page; none on Help, Privacy, Terms, Photo credits or the 404. *(PRD #118 replaces the design's section-anchor nav: How it works, Destinations and Reviews jumped to Homepage sections, Guides to `/about#guides`, with scroll-spy on the Homepage.)*

#### `SiteFooter` — `components/layout/SiteFooter` (static apart from `NavLinks`, built in PRD #32)
- Identical on all 9 pages. `SectionLabel` "Contact" (240 column; *removed by the owner, 2026-10-05: the links start at the left margin*), then large nav links `clamp(40px,5.2cqi,76px)`/500 (`NavLinks`' footer variant: the main nav's six pages, the current one gold; PRD #118 replaced the design's Tours, Destinations, Private trips, About us, Reviews), then a right column (`flex:0 1 380px`) with an intro 17, primary 56 "Chat on WhatsApp" and `KeyValueRow`s (WhatsApp, Phone, Email, Office with address and hours).
- Bottom bar (margin-top 96, hairline, 13px `text-2`): "© {build year} {brand} · DTS Licence No. {licence}" and links (Instagram, Facebook, YouTube, Help, Privacy, Terms, Photo credits; Contact is a large link since PRD #118). Placeholder phone, email and social values show as plain text.
- The design's `id="whatsapp"` anchor isn't used: every WhatsApp link goes to `wa.me`.

#### `HomeHero` — `sections/HomeHero` (client for scroll effect)
- `clamp(700px,100vh,980px)`, `margin-top:-72px`. *(PRD #135: it starts below the header, its height the clamped screen less the header, so it ends at the fold; nothing slides under the header.)* Layers: video (placeholder stripes 12/24), scrim gradient, `ink-900` dim layer (opacity 0 animated to .8), "VIDEO PLACEHOLDER" note box. At the bottom: a lead (max 460) and buttons (`flex:0 1 420px`; primary "Explore Tours →" and secondary "Plan on WhatsApp" with the .25 fill), then the Display word "NORTH" (27cqi/600/.74). *(Owner feedback: 26cqi, a span per letter cancelling its side space and `--display-gap` between them, so every gap is the same ink to ink; DESIGN.md §3.)*
- **M1:** the video blurs 0 → 16px, scales to 1.08 and darkens to 80% as it scrolls away. Reduced motion keeps it static.

#### `PhotoHero` — `sections/PhotoHero`
- TD: min-height `clamp(600px,50cqi,740px)`. Destination: `clamp(620px,52cqi,780px)`. Both use `margin-top:-72px`, a scrim gradient variant, and padding-top 96. *(PRD #135: no negative margin; they start below the header with padding-top 24, so the back link keeps its place.)* At the top: back `TextLink`, PHOTO note box, annotation chips. At the bottom: the route line (TD, 15/500 `text-2`) or region (Destination), an H1, an optional lead (Destination), and `FactsRow`.
- **TD H1:** `clamp(48px,7.2cqi,108px)`/500/.95/−.05em. **Destination H1:** display-like `min(20cqi, 150/len cqi)`/600/.8/−.065em, nowrap. Static.

#### `PageHeader` — `sections/PageHeader`
- Padding `clamp(64px,8cqi,128px) P clamp(40–48px…)`, a headline-row layout, H1 `clamp(40px,6.4cqi,92px)` and a lead 17.
- **Variants:** Tours (dark). Planner (light; slim "Planning your private trip" after step 1, padding 28). About (H1 at **long H2 size** plus a full-width `MediaFrame` 21:9 or 4:3; *a full-bleed photo cover since the owner's second feedback round*). Help (light plus `HelpSearch`). Contact (the `<h1>` and lead; its "Contact" `SectionLabel` was removed by the owner, 2026-10-04). Legal (light plus "Last updated [date]").

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
- About "08 Visit us" and Contact "04 Visit the office". Same H2 (long size) "Plan your trip over chai at our Lahore office", `KeyValueRow`s, a buttons row, and a 4:3 photo on the right *(a Google map of the address since the owner's second feedback round, ADR-0029)*.
- About: 4 rows (Office, Open, Phone, WhatsApp) plus "Get directions →" and secondary "WhatsApp first". Contact: 2 rows plus "Get directions →" (Google Maps, new tab).

#### `GuidesGrid` / `DestinationsGrid` — `sections/…`
- H2 plus an image-card hairline grid *(a photo card grid with gaps since the owner's second feedback round)*. Guides: MIN 150, max 4 columns, 8 cards. Destinations: MIN 160, max 6 columns (Home) or 5 columns (Destination "Other valleys").

#### `EmptyState` — `sections/EmptyState` (or per-feature)
- Tours no results and Help no results share the pattern: fixed wording H2, a lead, then primary plus secondary 52. Sizes differ (Tours standard H2; Help `clamp(28px,3cqi,40px)`).

### 3.3 Page-specific sections (one page each)
- **Home:** `BrandStatement` (long H2 with **word-by-word reveal M2**, 16% → 100% opacity on scroll, homepage only; body 17 plus "Meet the team →" aligned right, max 500), `RouteMapSection` (`RouteMap` plus `RouteStopList`).
- **Tour Detail:** `QuickFacts`, `TripOverview` (long H2, two paragraphs, `SuitabilityList`), `Highlights`, `Itinerary`, `Included` (light; **bleeds full width** to cover the main column only: `margin-right: calc(-1 * (444px + P))` when the aside is shown), `Hotels`, `DatesAndPrices` (light, same bleed), `BookingAside`, `BookingStickyBar` and `BookingSheet`. Main column sections use `clamp(64px,8cqi,120px)` padding and an H2 margin-top of 20.
- **Destination:** `DestinationOverview` (H2 plus right-aligned paragraphs, max 560), `SeasonCalendar`, `PlacesToSee`, `GettingThere`, `GoodToKnow` (light hairline grid MIN 260, max 3 columns, title 18/500 plus text 15). Template annotation: "One template filled from data: hero, facts, season months, attractions with coordinates, route legs, notes, linked tours". "SEO · `<title>Hunza tours from Lahore | [BRAND NAME]</title>`". "Template check" Views (Murree) render the hero and calendar only.
- **Planner:** dark, like the rest of the site (owner feedback, 2026-10-04); until then the whole page was light (`data-surface="light"`) except the header, footer and mobile bottom bar.
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
| **Hairline grid, capped auto-fill** | `display:grid; gap:1px; background: line; border-top/bottom: 1px line; grid-template-columns: repeat(auto-fill, minmax(max(MIN, calc((100% - (N-1)px)/N)), 1fr))`. Cells `ink-900` (or `mist-50` on light with `line-light` background). **Open variant** (TD highlights and hotels): each cell's 1px outline draws the lines, so a part-filled last row ends cleanly. *(Owner feedback, 2026-10-05: every hairline grid now works as the open variant, its top and bottom borders transparent and the grid painting nothing; highlights and hotels are photo card grids.)* | see table below |
| **Text-grid bleed** | `margin-left/right: calc(-1 * P); clip-path: inset(0 P)` with `P = clamp(16px,1.7cqi,24px)`; cells `padding: Y P` | steps, reviews, trust strip, facts, notes, policies, seasons, principles, stats, suitability, inclusions, Contact ways |
| **Image-card cells** | photo full-bleed in the square cell with an 8px frame; text block `padding: Y P` | destinations, guides, highlights, hotels, vehicles, other destinations |
| **List rows** | `padding:14px 0` (12–20 seen); `border-bottom: 1px line`; top border on the list. Justified pair, or fixed label column (100/110/120/200px) | footer, Visit us, Credentials, Getting there, summaries, profile, itinerary `<dl>` |
| **Two-column with sticky side** | flex, gap 48–64. Side column fixed width (240 nav, 340 map, 380 aside), `position:sticky; top: 88–104px` | TD (booking aside, itinerary map), Help (category nav), Legal (TOC), Planner (aside), Destination (places map) |
| **Media + text split** | `flex:1 1 320–440px` children, gap `32–56px`, wraps | Home route map, About story / visit, Contact visit, PrivateTripBanner, Destination places |
| **Light-surface section** | `data-surface="light"`, `mist-50` background, `ink-text` colour, `line-light` hairlines | TD 06 and 08 and 11, Destination 06, Help (01–03), Legal (01–02) (the Planner and Contact's on-trip panel were light until the owner's feedback, 2026-10-04) |
| **Frosted sticky bar** | `rgba(12,18,22,.82–.92)` + `blur(18px) saturate(140%)`, hairline `rgba(241,238,232,.12)` or `line` | header (*solid since PRD #135, ADR-0030*), Tours filter bar, TD sticky bar, Planner bottom, progress and summary bars (the light variant for the Planner's progress and summary went with the light planner, owner feedback) |
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
3. **Header "WhatsApp us"** is a 44px button with `rgba(241,238,232,.5)` border and 14px label, which is not one of the DESIGN §7 variants. The mobile header icon buttons use the same .5 border, not `line-strong`. *(Settled by PRD #135: the 2f header's bordered WhatsApp and Menu, DESIGN §7.)*
4. **Font size and padding drift:** 48px buttons use 15px text (DESIGN says 16/500). Secondary padding is `0 24px` and primary `0 28px`. TD departure-row buttons use `0 22px`. Homepage hero secondary alone has an `rgba(12,18,22,.25)` fill.
5. **Join waitlist has three looks:** quiet (TourCard, `line-strong`), **gold primary** (BookingPanel sold-out), quiet-light (TD departure rows). DESIGN lists Join waitlist as Quiet.
6. **"Selected ✓"** in TD departure rows uses a gold fill with a `gold-deep` border as a *selection state* (`Tour Detail:329`). This conflicts with "gold means action" and with every other selected state (ink-800 or inverse fill).
7. **Quiet buttons on light** use `line-strong-light` (Back, Join waitlist). Secondary on light uses `ink-text`. Both appear side by side in Planner review (Back quiet, Request a call back secondary) with no documented rule for when to use which. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
8. **Disabled look-alike:** the Tours filter sheet "No trips match" is styled as disabled (`line` fill, `text-3`) but stays an active button that closes the sheet (`Tours:287,538`). *(Settled in PRD #56: a secondary button, enabled and labelled.)*

**Radius (DESIGN §7: 2 / 6 / 8 / 999)**
9. **Selectable option boxes with 0 radius:** BookingPanel date options and room options (`BookingPanel:40,62`), Planner destination cards (`Trip Planner:128`), Tours dropdown rows (fine as rows, but the panel itself is 0). Decide whether these are "inputs" (2px) or "cards" (8px). *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
10. **Panels with 0 radius:** Tours dropdown panels (`Tours:91,113`), Planner aside boxes, review box and message preview (`Trip Planner:259,271,313,319,332`). All four sheets and the About drawer have no radius, only a border-top or border-left. DESIGN says panels, drawers, sheets and dropdowns are 8px. By contrast, the BookingPanel aside (`Tour Detail:346`) and Contact on-trip panel (`Contact:102`) **are** 8px. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
11. **Checkbox radius:** 0 in the Tours dropdown (`boxRadius:'0'`, `Tours:494`) and 2px in Planner cards (`Trip Planner:131`). About safety ✓ badges are 0. *(Settled for the Planner in PRD #71, and for About's safety list in PRD #78: the same 2px indicator; see the decisions at the top of this file.)*
12. **Route map frame** (Home) has a 1px border with no radius. TD and Destination maps have no frame at all.
13. **Help search clear** is an icon button with **no border**. Every other icon button has one. *(Settled in PRD #86: the standard bordered 44px icon button.)*
14. Design System page still says "Radius 0 on surfaces · 999 on buttons + chips" (`Design System:90`). Stale.

**Chips and tags**
15. *(Decided: every tag is 28px, padding 0 12px; see the decisions at the top.)* **Status tag heights:** urgent is 28px with padding 10. Sold out is **30px** with padding 12 (`TourCard:21,24`). The Destination category tag is 26px.
16. *(Settled in PRD #56: the shared selected state everywhere.)* **Three different "selected" chip styles:** desktop filter trigger and removable chip use an `ink-800` fill with a `text` border. Mobile filter-sheet option uses a **solid `text` fill with ink text**. Light-surface planner chips use a solid `ink-text` fill with `mist-50` text. The first two are both on dark on the same Tours page.
17. Chip and dropdown **hover and focus states** are not designed anywhere. *(Settled in PRD #56: the raised hover surface and the standard focus ring.)*

**Accordion and disclosure**
18. **Two expand idioms:** the 44px `+` icon box that rotates 45° (TD FAQ, Help FAQ: identical, good) and a **caret ▾ that rotates 180°** (Help policy "Read the full policy", Legal mobile contents, Planner summary bar, Tours dropdown triggers). TD opens the first FAQ by default; Help opens none. *(Settled in PRD #86: Help opens none, one at a time outside a search; the caret is `Accordion`'s caret marker, in its `compact` and `link` sizes.)*

**Inputs**
19. **Control borders on light:** default input, select and textarea borders use the hairline `line-light #CBD2D8` (`Trip Planner:146,193,216,228,237,251`, `Help:70`). DESIGN specifies control borders on light = `line-strong-light #7D8992` (3.2:1). `#CBD2D8` likely fails 3:1 for non-text contrast on mist-50. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
20. **Input heights:** 52 (planner), 56 (Help search), 44 (age select), 52 (dark booking select). *(Settled for the Planner in PRD #71, and for Help in PRD #86: the search is the shared 52px input.)*
21. **Error colour** is `gold-deep` (border plus "!" badge). DESIGN has no error token, and gold is reserved for action and highlights. It needs a decision. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
22. **Date inputs** set `color-scheme:dark` on a light field (`Trip Planner:146-147`), which is likely a bug (it gives a dark native picker on a light form). *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*
23. **Focus states** for inputs, chips and rows are not drawn anywhere. Only the DS shows the button focus ring. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*

**Cards and grids**
24. *(Settled in PRD #56: the compact card sets each part on the nearest role and spacing token.)* **ReviewCard:** two specs. Default (15px stars, clamp 19–23 quote, 32/36 padding) vs Tours compact (13px stars, 17px quote, 24/28 padding, 14/13 caption). DESIGN §9 only describes 15px stars.
25. *(Settled in PRD #63: the "other" card uses the `destination` role for its name.)* **DestinationCard:** Homepage is 3:4, 22px name, "Best season" plus months. Destination "Other valleys" is 4:3, 20px name, "Best · …" plus tour count. The Planner choice card is 16:10 light.
26. **GuideCard:** Homepage cards are non-interactive; the same people on About open profiles (with "View profile"). Homepage nav "Guides" goes to About#guides, but the Homepage cards don't link. *(Settled in PRD #39: Homepage cards link to `/about#guide-{slug}`; in PRD #78 that link opens the profile on About.)*
27. **Hairline grid implementation:** the Tours results grid uses per-card `border-right`/`border-bottom` (computed from column count) instead of `gap:1px` on a line background (`Tours:154-156,473`). *(Settled in PRD #56: kept for the results, set in CSS per breakpoint, since their count varies.)* TD Hotels uses a fixed `repeat(5,…)`/`1fr` (no capped auto-fill, so nothing between 1 and 5 columns). Contact ways uses a fixed `2fr 1fr 1fr`.
28. **Bleed bug:** the Homepage "How it works" `<ol>` sets the bleed margins and then `margin:64px 0 0`, which resets them (`Homepage:138`). The first and last step text therefore sits P inside the page margin, unlike every other text grid. *(Fixed in PRD #39: the shared text-grid bleed holds.)*
29. **Caption insets** on placeholders vary: 20/16, 16/14, 14/12, 12/10, 10/8, 6/5.
30. **Price sizes:** 24 (TourCard), **30** (BookingPanel, not in the type scale), 18 (hero, sticky bar, rows), 16 (room rows).
31. **Seats copy varies:** "3 of 16 seats left" (card), "Only 3 seats left" (tag, panel, TD hero, TD row), "14 seats left" (panel), "14 of 16 seats left" (TD row), "Sold out" (panel), "Sold out · waitlist open" (TD row), "0 of 12 seats · waitlist open" (card). Pick one formatter in `lib/utils`.

**Sections and typography**
32. **Section labels:** DESIGN §6 says labels appear only on About Credentials, Contact Quick links and the footer. **Contact "01 Header" also has a "Contact" label** beside H1 "Talk to a person" (`Contact:66`). *(Settled in PRD #86: kept, an owner-approved exception recorded in DESIGN.md §6. Reversed by the owner on 2026-10-04: removed, since it repeated the headline.)*
33. **Headline sizes outside the scale:** TD hero H1 `clamp(48px,7.2cqi,108px)`. Destination name `min(20cqi,150/len cqi)`/600. Help category H2 `clamp(26px,2.6cqi,36px)`. Help no-results H2 `clamp(28px,3cqi,40px)`. Legal section H2 `clamp(22px,2.2cqi,28px)`. Contact numbers `clamp(28px,3.4cqi,48px)` / `clamp(22px,2.4cqi,32px)`. About profile H2 32px. About stats `clamp(40px,4.4cqi,64px)`/300. *(Settled in PRD #78 for About: the profile's name is the sheet's title, and the stats use the `numeral` role; in PRD #86 for Help, Legal and Contact: see the decisions at the top of this file.)*
34. *(Settled in PRD #63 for Destination: the standard size, no rating summary; in PRD #78 for About: the long size, no rating summary.)* **Reviews H2 sizes:** Home and About use the long size; TD and Destination use the standard size. The rating summary appears on Home, TD and Tours but not Destination or About.
35. *(Settled in PRD #56 for Tours reviews: the standard section padding.)* **Section padding:** TD main-column sections use `clamp(64px,8cqi,120px)` with an odd H2 `margin-top:20px`. Tours reviews use `clamp(64px,7cqi,112px)`. The standard is `clamp(72px,9cqi,144px)`.
36. **Decorative numbering:** About "How we run every trip" numbers four principles 01–04 (`About:99-102`). These are not a sequence, which conflicts with CLAUDE.md §8 "no decorative numbering". *(Settled in PRD #78: no numbers.)*
37. **Mono in UI:** Help "Link to this answer · /help#id" (`Help:127`) and the About profile URL line (`About:265`) use Geist Mono in production UI. DESIGN §3 says mono is placeholders only. *(Settled in PRD #78 for About: the URL line is Geist; in PRD #86 for Help's answer links.)*
38. **Screen-label numbering:** the Help and Contact trust strips are labelled "09 Trust strip" and their footers "11 Footer" (copy-paste). Harmless, but don't rely on the numbers. *(Settled in PRD #86: Help and Contact reuse the shared strip and footer.)*

**Header, menu, overlays**
39. **Planner mobile menu has no "Plan on WhatsApp" button** (`Trip Planner:51-57`). Every other page has it. *(Fixed in PRD #32: every page's menu has it.)*
40. The **Homepage** header and footer use the simple-icons CDN WhatsApp image with `filter:invert(1)`. Other pages use local `icons/whatsapp-light|dark.svg`. The README notes `icons/whatsapp.svg` is missing.
41. **Sheet anatomy differs:** TD and Tours sheets have a grab handle and a title header. The About profile sheet has no handle and a counter, prev/next and close header. **Escape / focus-return / scroll-lock are only implemented for the About profile and Tours dropdowns.** The TD booking sheet, Tours filter and sort sheets and the mobile menu have none. *(The `Sheet` base component (PRD #8) adds them to every sheet; the mobile menu uses it since PRD #32, and the About profile since PRD #78, with its counter, previous and next as the sheet's header actions.)*
42. **Light-on-dark backgrounds:** the planner progress and summary bar use a light frosted bar, while the planner bottom bar on the same page is dark frosted. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*

**Stale content (apply the overrides)**
43. **Payments:** "Bank transfer · JazzCash · Easypaisa · Card" appears in the BookingPanel (`BookingPanel:72`), TrustStrip on Home, Tours, Help and Contact, the TD Final CTA mini trust, Home step 3 ("bank transfer, JazzCash or Easypaisa"), the TD FAQ "How do payment and the advance work?" and the Help FAQ "How can I pay?" and policy "Payments and the advance". All become cash and bank transfer only. *(Settled for Help and Contact in PRD #86: their answers, policies and trust strips read cash and bank transfer from settings.)*
44. **Apricot:** DS tour-card spec rows "Apricot star", "apricot when ≤ 3" (`Design System:122-123`), DS don'ts "The old apricot #D9B44A" (typo), and Views pages `a:hover{color:#F4A66A}`. Use gold.
45. **Reserve / call back:** the TD Final CTA "Reserve with [X]% advance" links to `#dates` (desktop) or opens the booking sheet (compact). The BookingPanel Reserve links to `#reserve`. Planner "Request a call back" jumps straight to success. Per the override, each opens WhatsApp with a pre-filled message. *(Settled for the Planner in PRD #71; see the decisions at the top of this file.)*

---

## 6. Open decisions, by the PRD that settles them

Each one is asked (grilled) at the start of its PRD. A recommendation is noted where one is obvious.

**Base components PRD**
- All settled (see the decisions at the top of this file).

**Trip Planner and Help PRDs (inputs)**
- *(Settled in PRD #71: `Input`'s hover and focus follow #51's `Select`; and in PRD #86 for Help's search, the same 52px `Input` with `type="search"`; see the decisions at the top of this file.)*

**Content system PRD**
- One seats-copy formatter for all the variants in §5 item 31.
- "We accept" copy read from `content/settings.json`: "Cash · Bank transfer".

**Layout shell PRD**
- All settled (see the decisions at the top of this file).

**Homepage PRD**
- All settled (see the decisions at the top of this file).

**Tour Detail PRD**
- All settled (see the decisions at the top of this file).

**Tours PRD**
- All settled (see the decisions at the top of this file).

**Destination PRD**
- All settled (see the decisions at the top of this file).

**Trip Planner PRD**
- All settled (see the decisions at the top of this file).

**About PRD**
- All settled (see the decisions at the top of this file).

**Help, Contact and Legal PRD**
- All settled (see the decisions at the top of this file), including the input states for Help's search.
