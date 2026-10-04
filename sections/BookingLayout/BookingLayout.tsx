import type { BookingLayoutProps } from './BookingLayout.types';
import styles from './BookingLayout.module.css';

/**
 * Tour Detail's two columns: from 1100px the sections sit beside a sticky booking aside. Below
 * that the aside isn't rendered at all (the sticky bar and sheet take over), so only one booking
 * panel is ever in use.
 */
export function BookingLayout({ label, aside, children }: BookingLayoutProps) {
  return (
    <div className={styles.layout}>
      <div className={styles.main}>{children}</div>
      <aside aria-label={label} className={styles.aside}>
        {aside}
      </aside>
    </div>
  );
}
