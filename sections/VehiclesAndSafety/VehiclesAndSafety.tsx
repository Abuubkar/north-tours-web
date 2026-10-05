import { CheckList } from '@/components/about/CheckList/CheckList';
import { VehicleCard } from '@/components/about/VehicleCard/VehicleCard';
import { headlineSize } from '@/lib/utils/headline';
import type { VehiclesAndSafetyProps } from './VehiclesAndSafety.types';
import styles from './VehiclesAndSafety.module.css';

const headlineClass = { standard: styles.headline, long: styles.longHeadline };

/**
 * "Our vehicles, and how we keep you safe": the fleet as photo cards with gaps and its average age
 * in a full-width row under them, beside the safety practices (above them on phones).
 */
export function VehiclesAndSafety({ copy }: VehiclesAndSafetyProps) {
  return (
    <section className={styles.section}>
      <h2 className={headlineClass[headlineSize(copy.headline)]}>{copy.headline}</h2>
      <div className={styles.split}>
        <div className={styles.fleet}>
          <ul className={styles.vehicles}>
            {copy.items.map((vehicle) => (
              <VehicleCard key={vehicle.name} vehicle={vehicle} />
            ))}
          </ul>
          <p className={styles.age}>
            {copy.fleetAge.label} <span className={styles.ageValue}>{copy.fleetAge.value}</span>
          </p>
        </div>
        <div className={styles.safety}>
          <CheckList title={copy.safety.title} items={copy.safety.items} />
        </div>
      </div>
    </section>
  );
}
