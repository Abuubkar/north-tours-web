import { ContactChannelCard } from '@/components/contact/ContactChannelCard/ContactChannelCard';
import { Button } from '@/components/ui/Button/Button';
import type { WaysToReachUsProps } from './WaysToReachUs.types';
import styles from './WaysToReachUs.module.css';

/**
 * WhatsApp first, as the fastest way, then the phone and email, in a hairline grid: 2fr 1fr 1fr
 * from 1100px, one column below. A visually hidden <h2> heads the section, so heading navigation
 * reaches the channels' <h3>s.
 */
export function WaysToReachUs({ copy, channels }: WaysToReachUsProps) {
  const { whatsapp, phone, email } = channels;
  return (
    <section className={styles.section}>
      <h2 className={styles.headline}>{copy.headline}</h2>
      <ul className={styles.grid}>
        <li className={styles.cell}>
          <ContactChannelCard label={copy.whatsapp.label} icon="whatsapp" value={whatsapp.value} href={whatsapp.href} size="feature" line={copy.whatsapp.line}>
            <Button href={whatsapp.chatHref} icon="whatsapp">
              {copy.whatsapp.chatLabel}
            </Button>
          </ContactChannelCard>
        </li>
        <li className={styles.cell}>
          <ContactChannelCard label={copy.phone.label} value={phone.value} href={phone.href} line={phone.hours} />
        </li>
        <li className={styles.cell}>
          <ContactChannelCard label={copy.email.label} value={email.value} href={email.href} line={copy.email.line} />
        </li>
      </ul>
    </section>
  );
}
