import type { ContentImage } from '@/lib/content/images';

export type DestinationChoicesProps = {
  /** The destinations, in the loader's order; "Not sure" follows them. */
  destinations: readonly { slug: string; name: string; image: ContentImage }[];
  copy: { label: string; hint: string; unsure: string };
};
