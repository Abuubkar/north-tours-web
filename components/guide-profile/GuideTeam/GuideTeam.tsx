'use client';

import { useRef } from 'react';
import { useGuideProfile } from '@/hooks/useGuideProfile';
import { useRiseOnView } from '@/hooks/useRiseOnView';
import { GuideCard } from '../GuideCard/GuideCard';
import { GuideProfileDialog } from '../GuideProfileDialog/GuideProfileDialog';
import type { GuideTeamProps } from './GuideTeam.types';
import styles from './GuideTeam.module.css';

/**
 * About's guides and drivers: a card per guide, each opening their profile in the sheet. The
 * cards rise once (M4), the page's one entrance animation. Closing returns focus to the card
 * that opened the profile (the dialog does that), even after moving through other guides.
 */
export function GuideTeam({ profiles, copy }: GuideTeamProps) {
  const list = useRef<HTMLUListElement>(null);
  useRiseOnView(list);
  const { shown, stepped, open, step, close } = useGuideProfile(profiles.length);

  return (
    <>
      <ul ref={list} className={styles.grid}>
        {profiles.map((profile, i) => (
          <li key={profile.slug} className={styles.cell}>
            <GuideCard variant="button" guide={profile} viewLabel={copy.viewProfile} selected={shown === i} onOpen={() => open(i)} />
          </li>
        ))}
      </ul>
      <GuideProfileDialog profiles={profiles} shown={shown} stepped={stepped} copy={copy.profile} onStep={step} onClose={close} />
    </>
  );
}
