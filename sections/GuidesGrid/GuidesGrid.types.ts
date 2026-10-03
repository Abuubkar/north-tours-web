import type { GuideCardProps } from '@/components/guide-profile/GuideCard/GuideCard.types';

export type GuidesGridProps = {
  copy: { headline: string };
  guides: GuideCardProps['guide'][];
};
