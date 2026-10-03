import type { ReactNode } from 'react';
import { Icon } from '../Icon/Icon';
import styles from './Tag.module.css';

type TagProps = {
  /**
   * urgent: "Only 3 seats left", on a photo. soldout: "Sold out", on a photo.
   * category: a place type such as "Heritage", on the page surface.
   */
  variant: 'urgent' | 'soldout' | 'category';
  children: ReactNode;
};

const CLOCK_SIZE = 13;

export function Tag({ variant, children }: TagProps) {
  // Status tags sit on photos, so they always use the dark surface.
  const onPhoto = variant !== 'category';

  return (
    <span className={`${styles.tag} ${styles[variant]}`} data-surface={onPhoto ? 'dark' : undefined}>
      {variant === 'urgent' && <Icon name="clock" size={CLOCK_SIZE} />}
      {children}
    </span>
  );
}
