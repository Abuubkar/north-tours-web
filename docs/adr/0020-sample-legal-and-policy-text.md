# ADR-0020: Sample legal and policy text, flagged for review

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #86, #87

## Context
The footer links to Help, Privacy and Terms, and the planner's privacy line links to the Privacy Policy, but none of them exists. The design's Help, Privacy and Terms pages are prototypes: every policy and legal line is a `[placeholder]`, and the refund table shows day ranges that don't match settings.

The owner has no lawyer-reviewed text yet. ADR-0010 lets invented content stand in until real content arrives, and ADR-0019 marks invented claims about the company with `sample: true`. Legal and policy text is a sharper case: a family reads the refund rules before paying an advance, and a sample Privacy Policy or set of Terms that reaches launch unreviewed misstates the company's obligations.

A Privacy Policy copied from a template would also misdescribe the site: it would claim cookies, analytics and forms that send data, which the site doesn't have, and miss what it does do (the planner keeps trip answers in the browser, ADR-0018; WhatsApp and Google Maps are other companies).

## Decision
- **We write plain, sensible sample text** for the Help policies, the Privacy Policy and the Terms (ADR-0010), in the site's tone, with every figure from settings written as a `{token}` (the advance, the refund schedule and refund timing, the balance, the children's age, the reply time, the payment methods). No figure from settings is typed into the text.
- **Each document carries ADR-0019's `sample: true`:** each Help policy card, the Privacy Policy and the Terms. There is no sibling flag. The owner removes the field once a lawyer has reviewed the text; any other value fails `content:check` and the build. PRD 12's `launch:check` lists these documents with the other sample items.
- **The Privacy Policy describes the site as built:** no cookies, no analytics or tracking, fonts and images served by the site itself, no form that sends data; the planner keeps trip answers in this browser and never stores a name, number or notes (ADR-0018); WhatsApp and Google Maps are separate companies, reached only when the visitor taps. **Any change that adds a cookie, analytics, a form that sends data or a request to another host updates the Privacy Policy in the same PR.**
- Contact details and legal identifiers inside the text stay `[placeholders]` (ADR-0010), filled in as written.

## Alternatives considered
- **A separate `legalReview: "pending"` flag:** two mechanisms for the same "the owner must confirm this" gate, and two lists in `launch:check`.
- **`[placeholder]` text:** what the design does. ADR-0010 moved away from brackets, and a page of brackets can't be reviewed for tone or length.
- **A notice on the pages** ("sample text, under review"): shows visitors something they can't act on, and could reach launch as easily as the text.

## Consequences
- The pages read as finished during development, and the owner can see, file by file, which text still needs the lawyer.
- Changing a figure in settings changes it everywhere: tour pages, the planner, Help, the Privacy Policy and the Terms always agree.
- Every PR that changes what the site sends, stores or loads from elsewhere has a documentation duty: the Privacy Policy follows the code.
- Revisit if the owner wants the review recorded per section, or if the site starts collecting data.
