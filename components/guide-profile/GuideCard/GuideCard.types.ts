import type { Guide } from '@/lib/content/guides';

export type GuideCardProps = {
  guide: Pick<Guide, 'slug' | 'name' | 'role' | 'base' | 'portrait'>;
};
