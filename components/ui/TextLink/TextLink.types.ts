export type TextLinkProps = {
  href: string;
  /** The link's words; the arrow is added after them, or before them on a back link. */
  children: string;
  /** A back link, e.g. "← All tours": smaller, not underlined, the arrow pointing back. */
  back?: boolean;
};
