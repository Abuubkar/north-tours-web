import type { Destination } from '@/lib/content/destinations';

export type GoodToKnowProps = {
  /** "Good to know before you go". */
  headline: string;
  notes: NonNullable<Destination['notes']>;
};
