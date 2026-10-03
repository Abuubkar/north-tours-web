import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icons';
import styles from './IconButton.module.css';

type IconButtonOwnProps = {
  icon: IconName;
  /** Accessible name, e.g. "Menu", "Close", "Ask about this trip on WhatsApp". */
  label: string;
  /** Square size in px: 44 by default, 48 in tour cards and bars. */
  size?: 44 | 48;
  className?: string;
};

type IconLinkProps = IconButtonOwnProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof IconButtonOwnProps | 'children'> & {
    href: string;
  };

type IconActionProps = IconButtonOwnProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof IconButtonOwnProps | 'children'> & {
    href?: never;
  };

export type IconButtonProps = IconLinkProps | IconActionProps;

const GLYPH_SIZE = 20;

export function IconButton(props: IconButtonProps) {
  const { icon, label, size = 44, className, ...rest } = props;
  const classes = [styles.iconButton, styles[`size${size}`], className].filter(Boolean).join(' ');
  const glyph = <Icon name={icon} size={GLYPH_SIZE} />;

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} aria-label={label} className={classes}>
        {glyph}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} type={type} aria-label={label} className={classes}>
      {glyph}
    </button>
  );
}
