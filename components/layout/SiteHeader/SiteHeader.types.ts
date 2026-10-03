import type { Settings } from '@/lib/content/settings';

export type SiteHeaderProps = {
  /** From getSettings() in the root layout; components never call loaders. */
  settings: Pick<Settings, 'brand'>;
};
