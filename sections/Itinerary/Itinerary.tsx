import { DayMiniMap } from '@/components/itinerary/DayMiniMap/DayMiniMap';
import { ItineraryTimeline } from '@/components/itinerary/ItineraryTimeline/ItineraryTimeline';
import { drawItinerary, ITINERARY_MAP_FRAME, MINI_MAP_FRAME } from '@/lib/utils/itinerary';
import type { ItineraryProps } from './Itinerary.types';
import styles from './Itinerary.module.css';

/**
 * "The route, day by day" (#itinerary). The maps are schematic, drawn from the tour's stops
 * (CLAUDE.md §8: no basemap, no borders; Survey of Pakistan vetting before launch). The mini
 * maps are drawn here, on the server; only the day being read changes in the browser.
 */
export function Itinerary({ copy, tour }: ItineraryProps) {
  const mini = drawItinerary(tour.stops, tour.itinerary, MINI_MAP_FRAME);
  return (
    <section id="itinerary" className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <div className={styles.timeline}>
        <ItineraryTimeline
          days={tour.itinerary}
          copy={copy}
          drawing={drawItinerary(tour.stops, tour.itinerary, ITINERARY_MAP_FRAME)}
          miniMaps={tour.itinerary.map((day, i) => (
            <DayMiniMap key={i} drawing={mini} day={i} stops={day.stops} />
          ))}
        />
      </div>
    </section>
  );
}
