export type SuitabilityListProps = {
  /** "Who this trip is for", over its lines. */
  suited: { heading: string; lines: string[] };
  /** "Who it may not suit", over its lines. */
  notSuited: { heading: string; lines: string[] };
};
