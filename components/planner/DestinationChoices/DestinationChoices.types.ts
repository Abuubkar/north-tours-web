import type { ContentImage } from '@/lib/content/images';
import type { PlannerCopy } from '@/lib/content/pages';

export type DestinationChoicesProps = {
  /** The destinations, in the loader's order; "Not sure" follows them. */
  destinations: readonly { slug: string; name: string; image: ContentImage }[];
  /** The label, hint, and the "Not sure" card's words and photo. */
  copy: PlannerCopy['whereWhen']['destinations'];
};
