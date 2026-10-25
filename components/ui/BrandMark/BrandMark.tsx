import { Fragment } from 'react';
import { routes } from '@/lib/routes';
import { brandLogo } from '@/lib/utils/brandLogo';
import type { BrandMarkProps } from './BrandMark.types';
import styles from './BrandMark.module.css';

/**
 * The owner's badge, then the brand name in tracked capitals with a decorative gold dot between its
 * words, linking home. The badge is decorative (empty alt), so the link is named by the brand; the
 * words keep their spaces, so the name reads as written.
 */
export function BrandMark({ name }: BrandMarkProps) {
  return (
    <a href={routes.home} className={styles.brandMark}>
      {/* eslint-disable-next-line @next/next/no-img-element -- a static export, no image optimisation */}
      <img src={brandLogo.src} width={brandLogo.size} height={brandLogo.size} alt="" className={styles.logo} />
      <span>
        {name.split(' ').map((word, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <>
                {' '}
                <span className={styles.dot} aria-hidden="true">
                  ·
                </span>{' '}
              </>
            )}
            {word}
          </Fragment>
        ))}
      </span>
    </a>
  );
}
