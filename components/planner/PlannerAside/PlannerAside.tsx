'use client';

import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { RouteText } from '@/components/tour/RouteText/RouteText';
import { usePlanner } from '@/hooks/usePlanner';
import { answeredCount } from '@/lib/utils/plannerBar';
import { postcard } from '@/lib/utils/plannerPostcard';
import { fillTokens } from '@/lib/utils/tokens';
import { TripSummaryRows } from '../TripSummaryRows/TripSummaryRows';
import { WhatHappensNext } from '../WhatHappensNext/WhatHappensNext';
import type { PlannerAsideProps } from './PlannerAside.types';
import styles from './PlannerAside.module.css';

/** The postcard's photo shows at the side column's width. */
const PHOTO_SIZES = '380px';

/**
 * From 1100px, beside the form: "Your trip so far" as a postcard (owner feedback): the first
 * chosen destination's photo with the places named over it, the road from the departing city,
 * how many of the nine rows are answered and the rows. Then "What happens next". Sticky under the
 * header, scrolling inside when taller than the screen.
 */
export function PlannerAside({ copy, next, destinations, barWords }: PlannerAsideProps) {
  const { trip, answers } = usePlanner();
  const card = postcard(answers, trip.from, barWords);
  const photo = destinations.find(({ slug }) => slug === card.photo)?.image ?? copy.image;
  return (
    // Focusable, so a keyboard can scroll it when it's taller than the screen (a 768px-high laptop).
    <aside aria-label={copy.label} tabIndex={0} className={styles.aside}>
      <section className={styles.postcard}>
        <div className={styles.photo}>
          <MediaFrame key={card.photo ?? ''} image={photo} ratio="fill" sizes={PHOTO_SIZES} />
          <div className={styles.scrim} />
          <p className={styles.place}>{card.title}</p>
        </div>
        <div className={styles.body}>
          <div className={styles.head}>
            <h2 className={styles.title}>{copy.label}</h2>
            <span className={styles.count}>{fillTokens(copy.answered, { count: String(answeredCount(trip)) })}</span>
          </div>
          {card.route.length > 0 && (
            <p className={styles.route}>
              <RouteText stops={card.route} />
            </p>
          )}
          <div className={styles.rows}>
            <TripSummaryRows copy={copy} />
          </div>
        </div>
      </section>
      <WhatHappensNext copy={next} />
    </aside>
  );
}
