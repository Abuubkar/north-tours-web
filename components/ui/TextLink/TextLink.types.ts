type LinkForm = {
  href: string;
  /** arrow: underlined, "Meet the team →". back: smaller and not underlined, "← All tours". inline: a link inside a sentence, "Privacy policy". */
  variant?: 'arrow' | 'back' | 'inline';
  onClick?: never;
};

/** A text button: the underlined look on a <button>, with no arrow, e.g. "Clear all". */
type ButtonForm = {
  variant: 'button';
  onClick: () => void;
  /** Its accessible name, when the words alone don't say enough: "Edit" named "Edit where and when". */
  label?: string;
  href?: never;
};

export type TextLinkProps = (LinkForm | ButtonForm) & {
  /** The link's words; the arrow is added after them, or before them on a back link. */
  children: string;
};
