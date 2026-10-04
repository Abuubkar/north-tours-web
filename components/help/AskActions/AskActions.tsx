import { Button } from '@/components/ui/Button/Button';
import type { AskActionsProps } from './AskActions.types';
import styles from './AskActions.module.css';

/**
 * Help's closing pair, both 56px: "Ask on WhatsApp" (primary, with the general message) and
 * "Call us" (secondary), only once the phone number is real, so nobody calls a made-up number.
 */
export function AskActions({ askLabel, askHref, callLabel, callHref }: AskActionsProps) {
  return (
    <div className={styles.actions}>
      <Button href={askHref} size={56} icon="whatsapp" className={styles.action}>
        {askLabel}
      </Button>
      {callHref && (
        <Button href={callHref} variant="secondary" size={56} className={styles.action}>
          {callLabel}
        </Button>
      )}
    </div>
  );
}
