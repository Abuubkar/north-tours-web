import type { ReactNode } from 'react';
import type { Settings } from '@/lib/content/settings';

export type SiteFooterProps = {
  /** From getSettings() in the root layout; components never call loaders. */
  settings: Pick<Settings, 'brand' | 'contact' | 'legal' | 'social' | 'whatsapp'>;
};

/** A link when there's an href, plain text when the value is still a placeholder. */
export type TextOrLinkProps = {
  href: string | undefined;
  className: string;
  children: ReactNode;
};
