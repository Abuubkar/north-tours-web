import { routes } from '@/lib/routes';
import type { BrandMarkProps } from './BrandMark.types';
import styles from './BrandMark.module.css';

/** The logo triangle and the brand name, linking home. */
export function BrandMark({ name }: BrandMarkProps) {
  return (
    <a href={routes.home} className={styles.brandMark}>
      <span className={styles.mark} aria-hidden="true" />
      <span className={styles.name}>{name}</span>
    </a>
  );
}
