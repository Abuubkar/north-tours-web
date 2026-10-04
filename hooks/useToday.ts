import { useSyncExternalStore } from 'react';
import { todayInKarachi } from '@/lib/utils/departures';

/** Today's date isn't watched: a page left open past midnight keeps the day it was opened. */
const noUpdates = () => () => {};

/**
 * Today in Pakistan (YYYY-MM-DD) for the departure rules: the build's date while hydrating, so
 * the first render matches the built HTML, then the browser's. A page built days ago then drops
 * departures that have left since.
 */
export function useToday(builtOn: string): string {
  return useSyncExternalStore(
    noUpdates,
    () => todayInKarachi(new Date()),
    () => builtOn,
  );
}
