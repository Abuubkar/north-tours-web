import type { RoomType } from '@/lib/utils/booking';

export type RoomOptionProps = {
  /** The radio group's name, unique to this panel. */
  name: string;
  room: RoomType;
  /** As shown, e.g. "Twin". */
  label: string;
  /** Per person, for the chosen date. */
  price: number;
  checked: boolean;
  onChoose: (room: RoomType) => void;
};
