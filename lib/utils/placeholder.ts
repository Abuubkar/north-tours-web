/** A `[placeholder]` value: the whole value in square brackets (ADR-0010). */
export const PLACEHOLDER = /^\[[^\]]+\]$/;

/** True while a value is still a `[placeholder]`, e.g. "[+92 3XX XXX XXXX]". */
export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}

/**
 * True while any part of a value is still a `[placeholder]`, e.g. "[Office address], Lahore,
 * Punjab", which `isPlaceholder` (the whole value only) lets through.
 */
export function hasPlaceholder(value: string): boolean {
  return PLACEHOLDER_PART.test(value);
}

/** A `[placeholder]` anywhere in a value: PLACEHOLDER without its anchors. */
const PLACEHOLDER_PART = new RegExp(PLACEHOLDER.source.slice(1, -1));
