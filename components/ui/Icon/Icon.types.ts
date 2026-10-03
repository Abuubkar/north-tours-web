import type { ReactNode } from 'react';
import type { icons } from './icons';

/** One icon: a stroked outline (Lucide) or a filled shape (star, WhatsApp). */
export type IconDefinition = { kind: 'stroke' | 'fill'; body: ReactNode };

export type IconName = keyof typeof icons;

export type IconProps = {
  name: IconName;
  /** Rendered width and height in px. */
  size: number;
  /** Accessible name. Without it the icon is decorative and hidden from assistive tech. */
  label?: string;
  className?: string;
};
