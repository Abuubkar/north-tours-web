import type { AboutCopy } from '@/lib/content/pages';
import type { GuideProfile } from '@/lib/utils/guideProfile';

export type GuideTeamProps = {
  /** Every guide, in the loader's order. */
  profiles: GuideProfile[];
  copy: Pick<AboutCopy['guides'], 'viewProfile' | 'profile'>;
};
