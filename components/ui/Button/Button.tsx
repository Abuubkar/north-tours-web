import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icons';
import styles from './Button.module.css';

type ButtonOwnProps = {
  variant?: 'primary' | 'secondary' | 'quiet';
  /** Height in px: 44 header and social, 48 cards and panels, 52 default, 56 closing CTAs. */
  size?: 44 | 48 | 52 | 56;
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

export type ButtonProps = LinkButtonProps | ActionButtonProps;

const ICON_SIZE = 18;

export function Button(props: ButtonProps) {
  const { variant = 'primary', size = 52, icon, arrow = false, children, className, ...rest } = props;
  const classes = [styles.button, styles[variant], styles[`size${size}`], className]
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
