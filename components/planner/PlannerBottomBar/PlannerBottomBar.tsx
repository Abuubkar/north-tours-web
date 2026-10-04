import { Button } from '@/components/ui/Button/Button';
import type { PlannerBottomBarProps } from './PlannerBottomBar.types';
import styles from './PlannerBottomBar.module.css';

/**
 * Below 1100px, Back and Next under the thumb: a dark frosted bar stuck to the bottom of the
 * screen (and of the planner, so it never covers the footer). On review, Next becomes "Send on
 * WhatsApp". Never animated.
 */
export function PlannerBottomBar({ backLabel, nextShort, nextLabel, send, onBack, onNext, onSend }: PlannerBottomBarProps) {
  return (
    <div className={styles.bar} data-surface="dark">
      {backLabel && (
        <Button variant="quiet" size={48} onClick={onBack}>
          {backLabel}
        </Button>
      )}
      {send ? (
        <Button href={send.href} target="_blank" rel="noopener" icon="whatsapp" size={48} onClick={onSend} onAuxClick={onSend} className={styles.next}>
          {send.label}
        </Button>
      ) : (
        <Button size={48} arrow onClick={onNext} className={styles.next}>
          <span className={styles.short}>{nextShort}</span>
          <span className={styles.long}>{nextLabel}</span>
        </Button>
      )}
    </div>
  );
}
