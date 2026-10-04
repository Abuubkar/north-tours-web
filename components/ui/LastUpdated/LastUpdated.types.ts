export type LastUpdatedProps = {
  /** The line's words, with the date's place: "Last updated {date}". */
  template: string;
  /** The date, YYYY-MM-DD; shown in full ("4 October 2026") in a <time>. */
  date: string;
  /** The line's look, from where it sits (a header's or a section's). */
  className?: string;
};
