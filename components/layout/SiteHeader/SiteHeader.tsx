import { BrandMark } from '@/components/ui/BrandMark/BrandMark';
import type { SiteHeaderProps } from './SiteHeader.types';
import styles from './SiteHeader.module.css';

/** The sticky, frosted header on every page. Always dark, even over a light section. */
export function SiteHeader({ settings }: SiteHeaderProps) {
  return (
    <header data-surface="dark" className={styles.header}>
      <BrandMark name={settings.brand.name} />
    </header>
  );
}
