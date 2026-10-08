import { Button } from '@/components/ui/Button/Button';
import { OfficeMap } from '@/components/contact/OfficeMap/OfficeMap';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { TextOrLink } from '@/components/ui/TextOrLink/TextOrLink';
import { officeOnMaps, phoneHref } from '@/lib/utils/contact';
import { whatsappLink } from '@/lib/utils/whatsapp';
import type { VisitOfficeProps } from './VisitOffice.types';
import styles from './VisitOffice.module.css';

/**
 * "Plan your trip over chai at our Lahore office", shared by About and Contact: the office's
 * address and hours from settings, on About its mobile number too (placeholders as plain
 * text), "Get directions" once the address is real, on About "WhatsApp first", and the office on
 * a Google map (ADR-0029) beside them, under them on phones.
 */
export function VisitOffice({ settings, form = 'four-row', map }: VisitOfficeProps) {
  const { visitOffice: copy, contact, whatsapp } = settings;
  // Shown only once the office is real, to it as Google Maps knows it (ADR-0029).
  const directions = officeOnMaps(contact)?.directions;
  // The four-row form adds the mobile row and "WhatsApp first".
  const showNumbers = form === 'four-row';
  return (
    <section className={styles.section}>
      <div className={styles.split}>
        <div className={styles.text}>
          <h2 className={styles.headline}>{copy.headline}</h2>
          <dl>
            <KeyValueRow label={copy.rows.office}>{contact.officeAddress}</KeyValueRow>
            <KeyValueRow label={copy.rows.open}>{contact.officeHours}</KeyValueRow>
            {showNumbers && (
              <KeyValueRow label={copy.rows.mobile}>
                <TextOrLink href={phoneHref(contact.phone)} className={styles.rowLink}>
                  {contact.phone}
                </TextOrLink>
              </KeyValueRow>
            )}
          </dl>
          {(directions || showNumbers) && (
            <div className={styles.actions}>
              {directions && (
                <Button href={directions} arrow target="_blank" rel="noopener">
                  {copy.directionsLabel}
                </Button>
              )}
              {showNumbers && (
                <Button href={whatsappLink(contact.whatsapp, whatsapp.generalMessage)} variant="secondary" icon="whatsapp">
                  {copy.whatsappLabel}
                </Button>
              )}
            </div>
          )}
        </div>
        {map && <OfficeMap {...map} className={styles.map} />}
      </div>
    </section>
  );
}
