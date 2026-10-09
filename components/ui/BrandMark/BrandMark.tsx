import { Fragment } from 'react';
import { routes } from '@/lib/routes';
import type { BrandMarkProps } from './BrandMark.types';
import styles from './BrandMark.module.css';

/**
 * The brand name, linking home, in tracked capitals with a decorative gold dot between its words.
 * Text only until the owner supplies a logo. The words keep their spaces, so the name reads as written.
 */
export function BrandMark({ name }: BrandMarkProps) {
  return (
    <a href={routes.home} className={styles.brandMark}>
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
