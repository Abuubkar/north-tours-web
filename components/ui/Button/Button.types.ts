import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import type { IconName } from '../Icon/Icon.types';

export type ButtonVariant = 'primary' | 'secondary' | 'quiet';

/** Height in px: 44 header and social, 48 cards and panels, 52 default, 56 closing CTAs. */
export type ButtonSize = 44 | 48 | 52 | 56;

type ButtonOwnProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Leading icon, e.g. WhatsApp. */
  icon?: IconName;
  /** Trailing arrow that nudges right on hover. */
  arrow?: boolean;
  children: ReactNode;
  className?: string;
};

type LinkButtonProps = ButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonOwnProps> & { href: string };

type ActionButtonProps = ButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonOwnProps> & { href?: never };

/** A link when given an href, otherwise a button. A link can't be disabled. */
export type ButtonProps = LinkButtonProps | ActionButtonProps;
