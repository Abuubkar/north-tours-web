import { formatPkr } from '@/lib/utils/price';
import type { RoomOptionProps } from './RoomOption.types';
import styles from './RoomOption.module.css';

/** One room sharing as a radio tile: its name over its price per person, read together. */
export function RoomOption({ name, room, label, price, checked, onChoose }: RoomOptionProps) {
  return (
    <label className={styles.option}>
      <input
        type="radio"
        name={name}
        value={room}
        checked={checked}
        onChange={() => onChoose(room)}
        className={styles.radio}
      />
      <span className={styles.label}>{label}</span>
      <span className={styles.price}>{formatPkr(price)}</span>
    </label>
  );
}
