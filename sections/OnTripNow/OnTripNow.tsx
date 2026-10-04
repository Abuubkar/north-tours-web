import { OnTripPanel } from '@/components/contact/OnTripPanel/OnTripPanel';
import type { OnTripNowProps } from './OnTripNow.types';
import styles from './OnTripNow.module.css';

/** Contact's "On a trip right now?" panel, in the page's margins under the ways to reach us. */
export function OnTripNow(props: OnTripNowProps) {
  return (
    <div className={styles.section}>
      <OnTripPanel {...props} />
    </div>
  );
}
