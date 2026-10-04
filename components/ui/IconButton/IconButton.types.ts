import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from 'react';
import type { IconName } from '../Icon/Icon.types';

/** Square size in px: 44 by default, 48 in tour cards and bars. */
export type IconButtonSize = 44 | 48;

type IconButtonOwnProps = {
  icon: IconName;
  /** Accessible name, e.g. "Menu", "Close", "Ask about this trip on WhatsApp". */
  label: string;
  size?: IconButtonSize;
  className?: string;
};

type IconLinkProps = IconButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof IconButtonOwnProps | 'children'> & {
    href: string;
  };

type IconActionProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps | 'children'> & {
    href?: never;
    /** The button, e.g. for a sheet to focus its Close. */
    ref?: Ref<HTMLButtonElement>;
  };

/** A link when given an href, otherwise a button. The label is required. */
export type IconButtonProps = IconLinkProps | IconActionProps;
