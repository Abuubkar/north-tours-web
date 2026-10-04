import { Button } from '@/components/ui/Button/Button';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { routes } from '@/lib/routes';
import type { PrivateTripBannerProps } from './PrivateTripBanner.types';
import styles from './PrivateTripBanner.module.css';

/** The photo's width: up to 560px, the full width on phones. */
const PHOTO_SIZES = '(width >= 640px) 560px, 100vw';

/**
 * The offer of a private trip (Tours variant), shown inside the results after the first row:
 * a photo, the headline and lead, then the planner and WhatsApp. A hairline below only.
 */
export function PrivateTripBanner({ copy, whatsappHref }: PrivateTripBannerProps) {
  return (
    <section className={styles.banner}>
      <MediaFrame image={copy.image} ratio="16:10" sizes={PHOTO_SIZES} className={styles.media} />
      <div className={styles.text}>
        <h2 className={styles.headline}>{copy.headline}</h2>
        <p className={styles.lead}>{copy.lead}</p>
        <div className={styles.actions}>
          <Button href={routes.plan} arrow className={styles.action}>
            {copy.planLabel}
          </Button>
          <Button href={whatsappHref} variant="secondary" icon="whatsapp" className={styles.action}>
            {copy.askLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
