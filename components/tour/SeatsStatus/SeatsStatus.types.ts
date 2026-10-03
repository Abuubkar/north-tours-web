import type { Departure } from '@/lib/content/tours';

export type SeatsStatusProps = {
  departure: Pick<Departure, 'seatsLeft' | 'seatsTotal'>;
};
