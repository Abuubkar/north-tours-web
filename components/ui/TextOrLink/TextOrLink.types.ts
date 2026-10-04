import type { ReactNode } from 'react';

/** A link when there's an href, plain text when the value is still a placeholder. */
export type TextOrLinkProps = {
  href: string | undefined;
  /** The link's look; plain text takes its parent's. */
  className: string;
  children: ReactNode;
};
