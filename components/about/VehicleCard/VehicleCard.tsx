import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import type { VehicleCardProps } from './VehicleCard.types';
import styles from './VehicleCard.module.css';

/** At most two across beside the safety list (half the width of the column), one on phones. */
const PHOTO_SIZES = '(width >= 820px) 25vw, 100vw';

/** One vehicle in the fleet: its photo, its name and what it's for ("22 seats · air-conditioned · group departures"). */
export function VehicleCard({ vehicle }: VehicleCardProps) {
  return (
    <li className={styles.card}>
      <MediaFrame image={vehicle.image} ratio="4:3" sizes={PHOTO_SIZES} />
      <div className={styles.text}>
        <h3 className={styles.name}>{vehicle.name}</h3>
        <p className={styles.line}>{vehicle.line}</p>
      </div>
    </li>
  );
}
