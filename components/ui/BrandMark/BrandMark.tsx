import { routes } from '@/lib/routes';
import type { BrandMarkProps } from './BrandMark.types';
import styles from './BrandMark.module.css';

/** The brand name, linking home, text only until the owner supplies a logo. */
export function BrandMark({ name }: BrandMarkProps) {
  return (
    <a href={routes.home} className={styles.brandMark}>
      {name}
    </a>
  );
}
