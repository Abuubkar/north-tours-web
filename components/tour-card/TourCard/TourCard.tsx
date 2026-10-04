import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { RatingInline } from '@/components/ui/RatingInline/RatingInline';
import { Tag } from '@/components/ui/Tag/Tag';
import { routes } from '@/lib/routes';
import { dateRange, tripLength } from '@/lib/utils/dates';
import { seatStatus, urgencyText } from '@/lib/utils/departures';
import { departureMessage, whatsappLink } from '@/lib/utils/whatsapp';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { SeatsStatus } from '../../tour/SeatsStatus/SeatsStatus';
import type { TourCardProps } from './TourCard.types';
import styles from './TourCard.module.css';

/**
 * The photo's width in a grid of at most four columns, each at least 280px (DESIGN.md §5):
 * four columns from about 1200px (4 × 280 plus the page margins), two from about 600px.
 */
const PHOTO_SIZES = '(width >= 1200px) 25vw, (width >= 600px) 50vw, 100vw';

/**
 * One tour and the departure it shows (DESIGN.md §8). Urgent at 3 seats or fewer; sold out
 * swaps View Trip for the waitlist. Each link names the tour for screen readers.
 */
export function TourCard({ tour, departure, settings }: TourCardProps) {
  const status = seatStatus(departure);
  const soldOut = status === 'soldout';
  // Sold out, the card offers the waitlist instead of the trip.
  const action = soldOut
    ? {
        template: settings.whatsapp.waitlistMessage,
        whatsappLabel: `Join the waitlist for ${tour.title} on WhatsApp`,
      }
    : {
        template: settings.whatsapp.tourMessage,
        whatsappLabel: `Ask about ${tour.title} on WhatsApp`,
      };
  const whatsapp = whatsappLink(settings.contact.whatsapp, departureMessage(action.template, tour.title, departure.start));

  return (
    <article className={`${styles.card} ${soldOut ? styles.soldOut : styles.live}`}>
      <div className={styles.media}>
        <MediaFrame image={tour.image} ratio="4:3" sizes={PHOTO_SIZES} className={styles.photo} />
        {status === 'urgent' && (
          <div className={styles.tag}>
            <Tag variant="urgent">{urgencyText(departure)}</Tag>
          </div>
        )}
        {soldOut && (
          <div className={styles.tag}>
            <Tag variant="soldout">Sold out</Tag>
          </div>
        )}
      </div>
      <div className={styles.body}>
        <p className={styles.route}>{tour.route.join(' → ')}</p>
        <h3 className={styles.title}>{tour.title}</h3>
        <p className={styles.dates}>
          {dateRange(departure.start, departure.end)} · {tripLength(tour.days, tour.nights)}
        </p>
        <div className={styles.priceRow}>
          <div className={styles.price}>
            <PriceBlock amount={departure.price ?? tour.priceFrom} />
          </div>
          <RatingInline score={tour.rating.score} count={tour.rating.count} />
        </div>
        <div className={styles.seats}>
          <SeatsStatus departure={departure} />
        </div>
        <div className={styles.actions}>
          {soldOut ? (
            <Button href={whatsapp} variant="quiet" size={48} className={styles.main} aria-label={`Join waitlist, ${tour.title}`}>
              Join waitlist
            </Button>
          ) : (
            <Button href={routes.tour(tour.slug)} size={48} arrow className={styles.main} aria-label={`View Trip, ${tour.title}`}>
              View Trip
            </Button>
          )}
          <IconButton
            href={whatsapp}
            icon="whatsapp"
            size={48}
            label={action.whatsappLabel}
            className={styles.whatsapp}
          />
        </div>
      </div>
    </article>
  );
}
