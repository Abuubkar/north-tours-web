import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon } from '../Icon/Icon';
import type { ButtonProps, ButtonSize } from './Button.types';
import styles from './Button.module.css';

const sizeClass: Record<ButtonSize, string> = {
  44: styles.size44,
  48: styles.size48,
  52: styles.size52,
  56: styles.size56,
};

const ICON_SIZE = 18;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 52, icon, arrow = false, children, className, ...rest } = props;
  const classes = [styles.button, styles[variant], sizeClass[size], className]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {icon && <Icon name={icon} size={ICON_SIZE} />}
      <span>{children}</span>
      {arrow && <Icon name="arrowRight" size={ICON_SIZE} className={styles.arrow} />}
    </>
  );

  if (rest.href !== undefined) {
    return (
      <a {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)} className={classes}>
        {content}
      </a>
    );
  }

  const { type = 'button', ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button {...buttonRest} type={type} className={classes}>
      {content}
    </button>
  );
}
