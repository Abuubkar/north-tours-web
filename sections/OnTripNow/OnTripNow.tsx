import { OnTripPanel } from '@/components/contact/OnTripPanel/OnTripPanel';
import type { OnTripNowProps } from './OnTripNow.types';
import styles from './OnTripNow.module.css';

/**
 * Contact's "On a trip right now?" panel as a page section: in the page's margins under the ways
 * to reach us (the panel itself is a block that could sit anywhere).
 */
export function OnTripNow(props: OnTripNowProps) {
  return (
    <div className={styles.section}>
      <OnTripPanel {...props} />
    </div>
  );
}
