import type { GuideCardProps } from '@/components/guide-profile/GuideCard/GuideCard.types';
import type { GuideTeamProps } from '@/components/guide-profile/GuideTeam/GuideTeam.types';
import type { AboutCopy } from '@/lib/content/pages';

/** Homepage: a card per guide, each a link to their profile on About. */
type Home = {
  variant?: 'home';
  copy: { headline: string };
  guides: GuideCardProps['guide'][];
  profiles?: never;
};

/** About (#guides): the intro, then cards that open each guide's profile. */
type About = {
  variant: 'about';
  copy: AboutCopy['guides'];
  profiles: GuideTeamProps['profiles'];
  guides?: never;
};

export type GuidesGridProps = Home | About;
