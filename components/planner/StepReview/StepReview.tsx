'use client';

import { Button } from '@/components/ui/Button/Button';
import { usePlanner } from '@/hooks/usePlanner';
import { ReviewSummary } from '../ReviewSummary/ReviewSummary';
import { WhatsAppMessagePreview } from '../WhatsAppMessagePreview/WhatsAppMessagePreview';
import type { StepReviewProps } from './StepReview.types';
import styles from './StepReview.module.css';

/**
 * Review · Check and send: every answer, the exact message, then Back (quiet, as navigation),
 * "Send on WhatsApp" and "Request a call back" (secondary, as an action). Both WhatsApp actions
 * open `wa.me` in a new tab with their message, and following either shows the thank-you.
 * Nothing is sent anywhere else.
 */
export function StepReview({ copy, steps, backLabel }: StepReviewProps) {
  const { message, sendHref, callBackHref, back, sent } = usePlanner();
  return (
    <>
      {/* Each part is a section of the step body, which pads and divides them; the box sits inside. */}
      <div>
        <ReviewSummary copy={copy} steps={steps} />
      </div>
      <WhatsAppMessagePreview title={copy.previewTitle} message={message} note={copy.previewNote} />
      <div className={styles.actions}>
        <Button variant="quiet" onClick={back}>
          {backLabel}
        </Button>
        <Button href={sendHref} target="_blank" rel="noopener" icon="whatsapp" onClick={sent}>
          {copy.send}
        </Button>
        <Button href={callBackHref} target="_blank" rel="noopener" variant="secondary" onClick={sent}>
          {copy.callBack}
        </Button>
      </div>
    </>
  );
}
