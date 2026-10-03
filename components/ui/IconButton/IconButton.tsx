import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconButtonProps, IconButtonSize } from './IconButton.types';
import styles from './IconButton.module.css';

const sizeClass: Record<IconButtonSize, string> = { 44: styles.size44, 48: styles.size48 };

const ICON_SIZE = 20;

export function IconButton(props: IconButtonProps) {
  const { icon, label, size = 44, className, ...rest } = props;
  const classes = [styles.iconButton, sizeClass[size], className].filter(Boolean).join(' ');
  const glyph = <Icon name={icon} size={ICON_SIZE} />;

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
