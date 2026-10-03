import { Icon } from '../Icon/Icon';
import type { TagProps } from './Tag.types';
import styles from './Tag.module.css';

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
