import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { ROOM_TYPES } from '@/lib/utils/booking';
import { formatPkr } from '@/lib/utils/price';
import type { RoomSharingListProps } from './RoomSharingList.types';
import styles from './RoomSharingList.module.css';

/** "Room sharing": twin, triple and quad with the tour's price per person, then what the prices mean. */
export function RoomSharingList({ copy, note, prices }: RoomSharingListProps) {
  return (
    <div>
      <h3 className={styles.heading}>{copy.heading}</h3>
      <dl>
        {ROOM_TYPES.map((room) => (
          <KeyValueRow key={room} label={copy[room].label} note={copy[room].note}>
            {formatPkr(prices[room])}
          </KeyValueRow>
        ))}
      </dl>
      <p className={styles.note}>{note}</p>
    </div>
  );
}
