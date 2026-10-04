export type SectionLabelProps = {
  /** Short name of a section that has no headline, e.g. "Contact" (DESIGN.md §6). */
  children: string;
  /**
   * p by default. h2 where the label is all the heading its section has (About's "Credentials"),
   * so heading navigation reaches the section; it keeps the label's look.
   */
  as?: 'p' | 'h2';
};
