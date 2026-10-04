export type TextLinkProps = {
  href: string;
  /** The link's words; the arrow is added after them, or before them on a back link. */
  children: string;
  /** arrow: underlined, "Meet the team →". back: smaller and not underlined, "← All tours". */
  variant?: 'arrow' | 'back';
};
