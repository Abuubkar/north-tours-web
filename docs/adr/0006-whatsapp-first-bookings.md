# ADR-0006: WhatsApp-first bookings, no online payments in phase 1

- **Status:** Superseded by ADR-0008
- **Date:** 2026-10-03

## Context
Pakistani customers mainly enquire and book via WhatsApp. Stripe is not available for Pakistan-registered businesses. Local gateways (e.g. Safepay, PayFast) need merchant onboarding.

## Decision
Phase 1: all booking and enquiry actions open WhatsApp with a pre-filled message built on the client. The advance is paid by bank transfer, JazzCash or Easypaisa and confirmed manually. No payment code, no forms posting to a server.

## Consequences
- No backend needed; fits the static export (ADR-0002).
- Seat counts are updated manually via content (ADR-0003).
- Online payments later require a server component and a new ADR.
