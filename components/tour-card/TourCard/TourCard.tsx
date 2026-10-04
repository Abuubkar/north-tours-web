import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { RatingInline } from '@/components/ui/RatingInline/RatingInline';
import { Tag } from '@/components/ui/Tag/Tag';
import { routes } from '@/lib/routes';
import { dateRange, tripLength } from '@/lib/utils/dates';
import { NO_UPCOMING_DATES, seatStatus, urgencyText } from '@/lib/utils/departures';
import { cardPrice } from '@/lib/utils/price';
import { routeLine } from '@/lib/utils/route';
import { cardMessage, whatsappLink } from '@/lib/utils/whatsapp';
import { PriceBlock } from '../../tour/PriceBlock/PriceBlock';
import { SeatsStatus } from '../../tour/SeatsStatus/SeatsStatus';
import type { TourCardProps } from './TourCard.types';
import styles from './TourCard.module.css';

/**
 * The photo's width in a grid of at most four columns, each at least 280px (DESIGN.md §5):
 * four columns from about 1200px (4 × 280 plus the page margins), two from about 600px. A list
 * with other columns gives its own.
 */
const PHOTO_SIZES = '(width >= 1200px) 25vw, (width >= 600px) 50vw, 100vw';

/**
 * One tour and the departure it shows (DESIGN.md §8), with that date's twin price. Urgent at 3
 * seats or fewer; sold out swaps View Trip for the waitlist. With no dates left it says so, shows
 * the tour's own "from" price (its twin price, ADR-0017) and asks on WhatsApp in general. Each
 * link names the tour for screen readers.
 */
export function TourCard({ tour, departure, priority = false, photoSizes = PHOTO_SIZES, settings }: TourCardProps) {
  const status = departure && seatStatus(departure);
  const soldOut = status === 'soldout';
  const whatsapp = whatsappLink(settings.contact.whatsapp, cardMessage(settings.whatsapp, tour.title, departure));

  return (
    <article className={`${styles.card} ${soldOut ? styles.soldOut : styles.live}`}>
      <div className={styles.media}>
        <MediaFrame image={tour.image} ratio="4:3" sizes={photoSizes} priority={priority} className={styles.photo} />
        {departure && status === 'urgent' && (
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
        <p className={styles.route}>{routeLine(tour.route)}</p>
        <h3 className={styles.title}>{tour.title}</h3>
        <p className={styles.dates}>
          {departure ? `${dateRange(departure.start, departure.end)} · ${tripLength(tour.days, tour.nights)}` : NO_UPCOMING_DATES}
        </p>
        <div className={styles.priceRow}>
          <div className={styles.price}>
            <PriceBlock amount={cardPrice(tour, departure)} />
          </div>
          <RatingInline score={tour.rating.score} count={tour.rating.count} />
        </div>
        {departure && (
          <div className={styles.seats}>
            <SeatsStatus departure={departure} />
          </div>
        )}
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
            label={soldOut ? `Join the waitlist for ${tour.title} on WhatsApp` : `Ask about ${tour.title} on WhatsApp`}
            className={styles.whatsapp}
          />
        </div>
      </div>
    </article>
  );
}
