import { Icon } from '@/components/ui/Icon/Icon';
import type { WhatsAppMessagePreviewProps } from './WhatsAppMessagePreview.types';
import styles from './WhatsAppMessagePreview.module.css';

const ICON_SIZE = 18;

/** The exact WhatsApp message, as it will be sent, with a note that nothing goes until the visitor sends it there. */
export function WhatsAppMessagePreview({ title, message, note }: WhatsAppMessagePreviewProps) {
  return (
    <figure className={styles.preview}>
      <figcaption className={styles.title}>
        <Icon name="whatsapp" size={ICON_SIZE} />
        {title}
      </figcaption>
      <p className={styles.message}>{message}</p>
      <p className={styles.note}>{note}</p>
    </figure>
  );
}
