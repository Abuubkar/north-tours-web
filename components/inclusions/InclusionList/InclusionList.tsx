import { Icon } from '@/components/ui/Icon/Icon';
import type { IconName } from '@/components/ui/Icon/Icon.types';
import type { Tour } from '@/lib/content/tours';
import type { InclusionListProps } from './InclusionList.types';
import styles from './InclusionList.module.css';

/** Each inclusion's icon in the set (the design's nine, from Lucide). */
const ICONS: Record<Tour['included'][number]['icon'], IconName> = {
  hotel: 'bedDouble',
  meals: 'utensils',
  transport: 'bus',
  guide: 'compass',
  jeep: 'carFront',
  lunch: 'sandwich',
  personal: 'wallet',
  tickets: 'ticket',
  flights: 'plane',
};

const ICON_SIZE = 22;

/** "Included" and "Not included", side by side: each a heading over rows with a decorative icon, a title and a line. */
export function InclusionList({ included, notIncluded }: InclusionListProps) {
  return (
    <div className={styles.grid}>
      {[included, notIncluded].map(({ heading, rows }) => (
        <div key={heading} className={styles.cell}>
          <h3 className={styles.heading}>{heading}</h3>
          <ul className={styles.list}>
            {rows.map((row) => (
              <li key={row.title} className={styles.row}>
                <Icon name={ICONS[row.icon]} size={ICON_SIZE} className={styles.icon} />
                <div>
                  <p className={styles.title}>{row.title}</p>
                  <p className={styles.text}>{row.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
