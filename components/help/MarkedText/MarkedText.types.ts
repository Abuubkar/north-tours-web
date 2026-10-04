export type MarkedTextProps = {
  text: string;
  /** The search's words, folded; with none, the text shows as it is. */
  terms: readonly string[];
};
