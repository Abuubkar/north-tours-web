import { Button } from '@/components/ui/Button/Button';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { TextOrLink } from '@/components/ui/TextOrLink/TextOrLink';
import { directionsHref, phoneHref, whatsappHref } from '@/lib/utils/contact';
import { whatsappLink } from '@/lib/utils/whatsapp';
import type { VisitOfficeProps } from './VisitOffice.types';
import styles from './VisitOffice.module.css';

/** Beside the text from wide screens (about half the page), the full width below. */
const PHOTO_SIZES = '(width >= 820px) 50vw, 100vw';

/**
 * "Plan your trip over chai at our Lahore office", shared by About and Contact: the office's
 * address, hours, phone and WhatsApp from settings (placeholders as plain text), "Get directions"
 * once the address is real, "WhatsApp first", and the office photo (the owner's to supply).
 */
export function VisitOffice({ settings }: VisitOfficeProps) {
  const { visitOffice: copy, contact, whatsapp } = settings;
  const directions = directionsHref(contact.officeAddress);
  return (
    <section className={styles.section}>
      <div className={styles.split}>
        <div className={styles.text}>
          <h2 className={styles.headline}>{copy.headline}</h2>
          <dl>
            <KeyValueRow label={copy.rows.office}>{contact.officeAddress}</KeyValueRow>
            <KeyValueRow label={copy.rows.open}>{contact.officeHours}</KeyValueRow>
            <KeyValueRow label={copy.rows.phone}>
              <TextOrLink href={phoneHref(contact.phone)} className={styles.rowLink}>
                {contact.phone}
              </TextOrLink>
            </KeyValueRow>
            <KeyValueRow label={copy.rows.whatsapp}>
              <TextOrLink href={whatsappHref(contact.whatsapp, whatsapp.generalMessage)} className={styles.rowLink}>
                {contact.whatsapp}
              </TextOrLink>
            </KeyValueRow>
          </dl>
          <div className={styles.actions}>
            {directions && (
              <Button href={directions} arrow target="_blank" rel="noopener">
                {copy.directionsLabel}
              </Button>
            )}
            <Button href={whatsappLink(contact.whatsapp, whatsapp.generalMessage)} variant="secondary" icon="whatsapp">
              {copy.whatsappLabel}
            </Button>
          </div>
        </div>
        <MediaFrame image={copy.image} ratio="4:3" sizes={PHOTO_SIZES} className={styles.photo} />
      </div>
    </section>
  );
}
