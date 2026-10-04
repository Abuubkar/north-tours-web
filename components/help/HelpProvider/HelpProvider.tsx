'use client';

import { HelpContext, useHelpState } from '@/hooks/useHelp';
import type { HelpProviderProps } from './HelpProvider.types';

/** Holds the Help page's search and open answers for the header's search field and the answers below it. */
export function HelpProvider({ categories, children }: HelpProviderProps) {
  return <HelpContext value={useHelpState(categories)}>{children}</HelpContext>;
}
