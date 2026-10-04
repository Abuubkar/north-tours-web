import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { nightsLabel } from '@/lib/utils/stays';
import { fillTokens } from '@/lib/utils/tokens';
import type { HotelCardProps } from './HotelCard.types';
import styles from './HotelCard.module.css';

/** The photo's width: up to five columns from about 1100px, one or two below. */
const PHOTO_SIZES = '(width >= 1100px) 15vw, (width >= 480px) 50vw, 100vw';

/** Where you stay: a photo of the town or valley, the nights, a generic title (never a hotel's name) and what it's like. */
export function HotelCard({ stay, descriptionTemplate }: HotelCardProps) {
  return (
    <div className={styles.card}>
      <MediaFrame image={stay.image} ratio="4:3" sizes={PHOTO_SIZES} />
      <div className={styles.text}>
        <p className={styles.nights}>{nightsLabel(stay.nights, stay.place)}</p>
        <h3 className={styles.title}>{stay.title}</h3>
        <p className={styles.description}>{fillTokens(descriptionTemplate, { description: stay.description })}</p>
      </div>
    </div>
  );
}
