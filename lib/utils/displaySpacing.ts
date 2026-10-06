/*
 * The Homepage's display word ("NORTH") has the same visible gap between every pair of letters,
 * measured ink to ink (owner feedback, 2026-10-05). Each glyph carries its own side space (a round
 * O little, a straight N a lot), so one tracking value can't even the gaps out. Instead each
 * letter cancels its side space and one `--display-gap` sits between the letters' ink.
 */

/** A letter's side space, left and right of its ink, as fractions of the font size (em). */
export type SideSpace = { left: number; right: number };

export type DisplayLetter = SideSpace & { char: string };

/**
 * Geist semibold (600), measured in the browser with the web font the site loads: canvas
 * `measureText` at 1000px, the advance width against `actualBoundingBoxLeft` and `Right`. The
 * whole word shows, a small gap above the hero's bottom edge (`--display-lift`), so these are the
 * letters' full ink: the R's leg, widest at its foot, ends 0.0544em short of its advance (a pixel
 * scan of the same canvas; 0.0578em while the edge cut the letters, before 2026-10-06). A new display
 * word needs its letters measured the same way and added here; `pnpm content:check` rejects a
 * word with a letter missing.
 */
const SIDE_SPACE: Readonly<Record<string, SideSpace>> = {
  N: { left: 0.08, right: 0.08 },
  O: { left: 0.043, right: 0.043 },
  R: { left: 0.08, right: 0.0544 },
  T: { left: 0.0112, right: 0.0112 },
  H: { left: 0.08, right: 0.08 },
};

/** The letters of `word` with no measured side space, each once, in order. */
export function unmeasuredLetters(word: string): string[] {
  return [...new Set(word)].filter((char) => !Object.hasOwn(SIDE_SPACE, char));
}

/** Each letter of `word` with its side space. Content is checked first, so every letter is measured. */
export function displayLetters(word: string): DisplayLetter[] {
  return [...word].map((char) => {
    if (!Object.hasOwn(SIDE_SPACE, char)) throw new Error(`No measured side space for "${char}" (lib/utils/displaySpacing.ts)`);
    return { char, ...SIDE_SPACE[char] };
  });
}
