# ADR-0018: Planner answers stay in the visitor's browser

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #71, #76

## Context
The Trip Planner (PRD #71) asks for a trip over three steps, then a review. The design asks that answers survive going back a step or reloading the page, and visitors on mid-range phones often lose a tab or reload by accident. This is the first time the site keeps anything a visitor types.

Two things pull against keeping everything:
- Many visitors share a family phone. A name, a WhatsApp number, a best time to call and free-text notes left behind would show the next person who opens the planner.
- The site has no server (ADR-0002), and nothing a visitor types should leave the browser except the WhatsApp message they choose to send (ADR-0008).

Stored data also comes back on a later visit, after content may have changed (a destination removed) and dates have passed, and it can be edited by hand. It must be checked before use. ADR-0013 keeps Zod to build time and tests, so no schema code ships to visitors.

## Decision
- **The trip answers and the step go to `localStorage`** under one key, `planner-answers-v1`: destinations, date mode, dates, month, days, the trip length and whether it's still filled in from the days, adults, children, ages, group type, hotels, transport, where the trip starts, the other city and the budget. Every change is written at once.
- **Your details are never stored:** the name, the phone number (in either mode), the best time and the notes live in memory only. A reload on Your details or the review returns to Your details with the trip kept and the details empty. The success screen is never stored.
- **Nothing is sent to a server.** The answers leave the browser only in the `wa.me` link the visitor opens.
- **A hand-written, tested parser** (`lib/utils/plannerStorage.ts`) reads the stored data. Each field is checked on its own against the options, today in Karachi and the content's destinations; an invalid field falls back to its default (unknown or removed destinations, a past month or date, out-of-range numbers, unknown option ids, ages that don't match the children), and unreadable data gives the defaults. The stored step moves back to the first step that doesn't pass.
- **Storage errors are ignored** (private mode, a full quota): the planner works in memory.
- **"Plan another trip" removes the key.** The key's `-v1` lets a later change of shape start clean instead of misreading old data.

## Alternatives considered
- **No saving:** simplest, but a reload or a lost tab loses every answer, which the design asks us to prevent.
- **Saving everything, details included:** leaves a name and number on a shared family phone.
- **`sessionStorage`:** lost when the tab closes, which is when a returning visitor needs it most.
- **The URL:** answers would travel in every shared link and in browser history.
- **Zod in the browser for parsing:** adds tens of KB to the planner's JavaScript, against ADR-0013.

## Consequences
- A returning visitor finds their trip and step as they left them; the page hides the planner until it's restored, so step 1 never flashes.
- Personal details never outlive the visit, so they must be typed again after a reload.
- The parser must change with the answers: a new answer needs a field check and a test, or it falls back to its default on load.
- Revisit if the planner ever sends answers to a server, or if visitors ask to keep their details on their own device.
