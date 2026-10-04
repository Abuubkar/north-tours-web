'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { Sheet } from '@/components/ui/Sheet/Sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { profileCounter } from '@/lib/utils/guideProfile';
import { fillTokens } from '@/lib/utils/tokens';
import type { GuideProfileDialogProps } from './GuideProfileDialog.types';
import styles from './GuideProfileDialog.module.css';

/** The portrait fills the sheet: the drawer's width from 820px, the screen's below. */
const PORTRAIT_SIZES = '(width >= 820px) 460px, 100vw';

/**
 * A guide's profile in the Sheet: from the bottom on phones, the side drawer from 820px. The
 * name is the sheet's title; the counter, previous and next sit beside it. Moving to another
 * guide swaps the content in place, scrolls it back to the top and announces the new guide.
 */
export function GuideProfileDialog({ profiles, shown, stepped, copy, onStep, onClose }: GuideProfileDialogProps) {
  const wide = useMediaQuery('(width >= 820px)');
  const content = useRef<HTMLDivElement>(null);
  // The last guide shown stays in the sheet while it slides away.
  const [kept, setKept] = useState(0);
  if (shown !== null && shown !== kept) setKept(shown);
  const index = shown ?? kept;
  const profile = profiles[index];
  const counter = profileCounter(copy.counter, index, profiles.length);

  // A new guide starts at the top of the sheet's scrolling body (the content's parent).
  useEffect(() => {
    content.current?.parentElement?.scrollTo({ top: 0 });
  }, [index]);

  return (
    <Sheet
      open={shown !== null}
      onClose={onClose}
      title={profile.name}
      variant={wide ? 'drawer' : 'bottom'}
      actions={
        <>
          <span className={styles.counter}>{counter}</span>
          <IconButton icon="arrowLeft" label={copy.previous} onClick={() => onStep(-1)} />
          <IconButton icon="arrowRight" label={copy.next} onClick={() => onStep(1)} />
        </>
      }
    >
      <div ref={content} className={styles.profile}>
        <p aria-live="polite" className={styles.status}>
          {stepped && shown !== null ? fillTokens(copy.announcement, { name: profile.name, counter }) : ''}
        </p>
        <MediaFrame image={profile.portrait} ratio="4:3" wideRatio="4:5" sizes={PORTRAIT_SIZES} />
        <p className={styles.role}>
          {profile.role} · {profile.base}
        </p>
        <p className={styles.bio}>{profile.bio}</p>
        <dl className={styles.rows}>
          {profile.rows.map((row) => (
            <KeyValueRow key={row.label} label={row.label} layout="column">
              {row.value}
            </KeyValueRow>
          ))}
        </dl>
        <div className={styles.share}>
          <Button href={profile.shareHref} variant="secondary" size={48} icon="whatsapp" target="_blank" rel="noopener">
            {copy.share}
          </Button>
          <span className={styles.path}>{profile.path}</span>
        </div>
      </div>
    </Sheet>
  );
}
