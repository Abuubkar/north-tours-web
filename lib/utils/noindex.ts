/**
 * `NOINDEX=1` at build: the GitHub Pages preview, which search engines must not index
 * (ADR-0032). Every page gets a robots noindex meta and robots.txt disallows everything.
 * Unset in every other build.
 */
export const NOINDEX = process.env.NOINDEX === '1';
