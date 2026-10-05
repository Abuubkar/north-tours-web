export type OfficeMap = {
  /**
   * The map frame's address: Google's embed of the office (`officeMapSrc`, ADR-0029) on the
   * pages; a stand-in in stories, so tests never call Google.
   */
  src: string;
  /** The frame's name for screen readers: "Map of our office in DHA Phase 8, Lahore". */
  title: string;
  /** The link under it, to the address in Google Maps, and its words. */
  href: string;
  linkLabel: string;
};

export type OfficeMapProps = OfficeMap & { className?: string };
