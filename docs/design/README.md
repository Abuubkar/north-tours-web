# Design reference

Exported from the Claude Design project "North Pakistan Tour Operator Design" on 2026-10-03. It isn't a design-system project, so `/design-sync` can't reach it; this export is the synced copy.

Read-only reference. Do not edit these files and do not import them into the app. Build from `DESIGN.md` and use these pages for exact layout, copy and states.

## Precedence

When these files disagree with the docs, the docs win:

1. ADRs in `docs/adr/` (latest first)
2. `CLAUDE.md`
3. `DESIGN.md`
4. These files

Known stale details in these files:

- **Accent:** "apricot" and `#F4A66A` are stale. Gold `#D9B44A` (deep gold `#7A5A12` on light) is the only accent.
- **Radius:** "0 on surfaces, 999 on buttons" in `Design System.dc.html` is stale. Use 2px inputs, 6px buttons, 8px cards and panels, 999px chips only (DESIGN.md §7).
- **Payments:** "Card", "JazzCash" and "Easypaisa" are stale. Cash and bank transfer only (ADR-0008).
- **Reserve / call back:** "Reserve with [X]% advance" and "Request a call back" open WhatsApp (ADR-0008).
- **Content:** sample content may be invented, but contact details and legal identifiers stay as placeholders (ADR-0010). Images follow ADR-0009.

## Files

| File | What it shows |
|---|---|
| `Design System.dc.html` | Tokens, type, buttons, tour card states |
| `Homepage.dc.html` | Homepage, with motion |
| `Tour Detail.dc.html` | Tour Detail page |
| `Tours.dc.html` | Tours listing, filters, empty state |
| `Destination.dc.html` | Destination template (`dest=hunza`, `dest=murree`) |
| `Trip Planner.dc.html` | 5-step planner, review, success |
| `About.dc.html` | About, guides, vehicles, credentials |
| `Help.dc.html`, `Contact.dc.html`, `Legal.dc.html` | Help/FAQ and policies, contact, privacy and terms |
| `TourCard.dc.html`, `BookingPanel.dc.html` | Components on their own |
| `* Views.dc.html` | Canvases showing each page at 390px and 1440px in its key states |

`support.js` is the Claude Design runtime the pages need. `icons/` holds the icons the pages use; `icons/whatsapp.svg` (referenced by the Homepage) was not in the export.

## Viewing

The pages load `support.js`, so open them over a local server rather than as files:

```bash
python3 -m http.server 8765 --directory docs/design
```

Then open http://127.0.0.1:8765/Homepage.dc.html.
