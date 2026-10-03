/** A `[placeholder]` value: the whole value in square brackets (ADR-0010). */
export const PLACEHOLDER = /^\[[^\]]+\]$/;

/** True while a value is still a `[placeholder]`, e.g. "[+92 3XX XXX XXXX]". */
export function isPlaceholder(value: string): boolean {
  return PLACEHOLDER.test(value);
}
