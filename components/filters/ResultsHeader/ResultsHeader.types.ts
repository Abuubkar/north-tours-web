import type { RefObject } from 'react';

export type ResultsHeaderProps = {
  /** The results' <h2>: "8 trips". */
  count: string;
  /** Beside it from 820px: "Sorted by soonest departure · sold-out trips last". */
  sortedBy: string;
  /** The heading, so focus can move to it when the filters are cleared. */
  headingRef?: RefObject<HTMLHeadingElement | null>;
};
