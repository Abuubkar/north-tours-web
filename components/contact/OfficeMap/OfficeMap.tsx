import { TextLink } from '@/components/ui/TextLink/TextLink';
import type { OfficeMapProps } from './OfficeMap.types';
import styles from './OfficeMap.module.css';

/**
 * Where the office is (ADR-0029): Google's map of the address in a 4:3 frame at the card radius,
 * loaded only as it nears the screen so it never competes with the page's main image, and a link
 * to the full map under it.
 */
export function OfficeMap({ src, title, href, linkLabel, className }: OfficeMapProps) {
  return (
    <div className={[styles.map, className].filter(Boolean).join(' ')}>
      <iframe src={src} title={title} loading="lazy" className={styles.frame} />
      <TextLink href={href}>{linkLabel}</TextLink>
    </div>
  );
}
