/** Headlines longer than this many characters take the long size (DESIGN.md §6). */
const LONG_HEADLINE = 44;

/** A section headline's size: the standard one, or the long one past ~44 characters (DESIGN.md §6). */
export function headlineSize(headline: string): 'standard' | 'long' {
  return headline.length > LONG_HEADLINE ? 'long' : 'standard';
}
