import type { AboutCopy } from '@/lib/content/pages';

export type OurStoryProps = {
  /** The headline with its year filled in, the paragraphs and the founder. */
  copy: Pick<AboutCopy['story'], 'headline' | 'paragraphs' | 'founder'>;
};
