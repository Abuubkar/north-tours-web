import type { AboutCopy } from '@/lib/content/pages';

export type VehicleCardProps = {
  vehicle: Pick<AboutCopy['vehicles']['items'][number], 'name' | 'summary' | 'image'>;
};
