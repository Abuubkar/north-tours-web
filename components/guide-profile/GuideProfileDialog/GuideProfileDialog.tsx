'use client';

import { Button } from '@/components/ui/Button/Button';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { MediaFrame } from '@/components/ui/MediaFrame/MediaFrame';
import { Sheet } from '@/components/ui/Sheet/Sheet';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useShownProfile } from '@/hooks/useShownProfile';
import { PROFILE_DRAWER_QUERY, profileCounter } from '@/lib/utils/guideProfile';
import { fillTokens } from '@/lib/utils/tokens';
import type { GuideProfileDialogProps } from './GuideProfileDialog.types';
import styles from './GuideProfileDialog.module.css';

/** The portrait fills the sheet: the drawer's width (`--drawer-w`) from 820px, the screen's below. */
const PORTRAIT_SIZES = `${PROFILE_DRAWER_QUERY} 460px, 100vw`;

/**
 * A guide's profile in the Sheet: from the bottom on phones, the side drawer from 820px. The
 * name is the sheet's title; the counter, previous and next sit beside it. Moving to another
 * guide swaps the content in place, scrolls it back to the top and announces the new guide.
 */
export function GuideProfileDialog({ profiles, shown, stepped, copy, onStep, onClose }: GuideProfileDialogProps) {
  const wide = useMediaQuery(PROFILE_DRAWER_QUERY);
  const { index, content } = useShownProfile(shown);
  const profile = profiles[index];
  const counter = profileCounter(copy.counter, index, profiles.length);

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
