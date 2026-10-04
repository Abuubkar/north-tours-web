import type { ReactNode } from 'react';
import type { IconName } from '@/components/ui/Icon/Icon.types';

export type ContactChannelCardProps = {
  /** The channel's name, an <h3>: "WhatsApp · fastest", "Phone", "Email". */
  label: string;
  /** Shown before the name (WhatsApp's). */
  icon?: IconName;
  /** The number or address from settings, shown as written. */
  value: string;
  /** Its link once it's real; plain text while it's a placeholder. */
  href: string | undefined;
  /** feature: WhatsApp's large number. default: the phone and email. */
  size?: 'feature' | 'default';
  /** Under the value: the reply time, the hours, what email is for. */
  line: string;
  /** A button after the line ("Chat now"). */
  children?: ReactNode;
};
