import { RouteMap } from '@/components/route-map/RouteMap/RouteMap';
import { RouteStopList } from '@/components/route-map/RouteStopList/RouteStopList';
import type { RouteMapSectionProps } from './RouteMapSection.types';
import styles from './RouteMapSection.module.css';

/** The road north: the schematic map beside the main route's stops, wrapping under it on phones. */
export function RouteMapSection({ copy, map }: RouteMapSectionProps) {
  return (
    <section id="route" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.split}>
        <div className={styles.map}>
          <RouteMap map={map} />
        </div>
        <div className={styles.list}>
          <RouteStopList list={map.list} stops={map.stops} />
        </div>
      </div>
    </section>
  );
}
