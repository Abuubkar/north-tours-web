export type OnTripPanelProps = {
  /** "On a trip right now?": the section's <h2>. */
  heading: string;
  /** "Call your guide, or our travel support line." */
  line: string;
  /** The travel support number from settings, shown as written. */
  number: string;
  /** "Call travel support", shown only once the number is real (`callHref`). */
  callLabel: string;
  callHref: string | undefined;
};
