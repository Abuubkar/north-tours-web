# ADR-0008: WhatsApp-first bookings, advance paid in cash or by bank transfer

- **Status:** Accepted
- **Date:** 2026-10-03
- **Supersedes:** ADR-0006

## Context
ADR-0006 made WhatsApp the booking channel and listed bank transfer, JazzCash and Easypaisa for the advance. The owner has narrowed payment to cash and bank transfer only. The designs also show "Card" in the "We accept" rows, and two actions with no defined behaviour on a static site: "Reserve with [X]% advance" (Tour Detail, booking panel) and "Request a call back" (Trip Planner).

## Decision
- All booking and enquiry actions open WhatsApp with a pre-filled message built on the client. This includes "Reserve with [X]% advance" and "Request a call back". No payment code, no forms posting to a server.
- The advance and balance are paid **in cash (at the Lahore office) or by bank transfer**, and confirmed manually. Card, JazzCash and Easypaisa are not offered.
- Accepted payment methods live only in `content/settings.json`. Every "We accept" row and payment FAQ reads from there.
- Where the designs show "Card", "JazzCash" or "Easypaisa", the build shows the methods from settings instead.

## Alternatives considered
- Keep JazzCash and Easypaisa (ADR-0006): dropped by the owner.
- Card payments: not available without a local payment gateway and merchant onboarding; needs server code.

## Consequences
- No backend needed; fits the static export (ADR-0002).
- Seat counts are updated manually via content (ADR-0003).
- "Reserve" does not hold a seat by itself; the seat is held once the advance is confirmed on WhatsApp. Copy near the button should not suggest otherwise.
- Adding a payment method later is a settings change. Online payments later need a server component and a new ADR.
