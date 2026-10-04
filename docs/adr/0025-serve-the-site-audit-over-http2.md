# ADR-0025: Serve the site audit over HTTP/2

- **Status:** Accepted
- **Date:** 2026-10-04
- **Related issue:** #94, #100

## Context
ADR-0021 has `pnpm audit:site` serve the static export "as a static host would" from a small server inside the script, and judge LCP with Lighthouse's simulated slow 4G. The first full run (#100) served plain HTTP/1.1 and failed LCP on 21 of 24 pages (2.6–3.4 s).

Lighthouse doesn't replay the load; it simulates it from the requests it saw, including their protocol. For HTTP/1.1 it models up to six connections to the host, each with its own handshake and TCP slow start, so a page with a dozen early requests reads up to a second slower than the same page over HTTP/2's one connection. The same build served over HTTP/2 read 2.2 s instead of 3.0 s on the Homepage and 2.3 s instead of 3.4 s on Tours. Every static host serves HTTP/2 or HTTP/3 over TLS, and browsers only speak HTTP/2 over TLS.

## Decision
- The audit's server speaks **HTTP/2 over TLS** (Node's `http2`), still with no npm dependency, still gzipping text.
- It makes a **throwaway certificate** for `127.0.0.1` with the system's `openssl` at the start of each run, and deletes the files straight away. `openssl` ships with macOS and Linux; the audit says so if it's missing.
- **Only the audit's own browsers trust it, by its public key** (`--ignore-certificate-errors-spki-list`), so no other certificate check is turned off.
- Lighthouse's settings, the limits, axe's rules and the page list don't change. This extends ADR-0021's server; the rest of ADR-0021 stands.

## Alternatives considered
- **Keep HTTP/1.1 and shrink the pages:** the framework's own script (about 145 KB gzipped) is most of the cost under the HTTP/1.1 model; removing every script still left the Homepage at 2.0 s. It would judge the site against a way of serving it that no visitor will see.
- **Lighthouse's DevTools throttling instead of simulation:** changes what the audit measures (ADR-0021 chose simulated slow 4G).
- **A certificate committed to the repo, or an npm package to make one:** a key in the repo, or a dependency for one command.

## Consequences
- LCP reads as it will from a real host; the slowest page is 2.4 s, so the margin is small and the framework's script is the main cost to watch.
- The audit needs `openssl` on the machine.
- Revisit if Lighthouse changes how it models connections, or if the site is ever served over HTTP/1.1.
