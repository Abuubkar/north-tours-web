import type { Settings } from '@/lib/content/settings';

export type SiteFooterProps = {
  /** From getSettings() in the root layout; components never call loaders. */
  settings: Pick<Settings, 'brand' | 'contact' | 'legal' | 'social' | 'whatsapp'>;
};
