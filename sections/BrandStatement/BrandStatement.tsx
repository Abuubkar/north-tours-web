import { TextLink } from '@/components/ui/TextLink/TextLink';
import { routes } from '@/lib/routes';
import { Fragment, type CSSProperties } from 'react';
import type { BrandStatementProps } from './BrandStatement.types';
import styles from './BrandStatement.module.css';

/**
 * The Homepage's brand statement: the page's only <h1>, then a short paragraph and "Meet the
 * team". The headline lights up word by word as it scrolls into view (M2, the site's only word
 * reveal); each word is an inline span, so its accessible name stays the full sentence.
 */
export function BrandStatement({ copy }: BrandStatementProps) {
  const words = copy.headline.split(' ');
  return (
    <section className={styles.statement}>
      <h1 className={styles.headline} style={{ '--words': words.length } as CSSProperties}>
        {words.map((word, i) => (
          <Fragment key={i}>
            {i > 0 && ' '}
            <span className={styles.word} style={{ '--word': i } as CSSProperties}>
              {word}
            </span>
          </Fragment>
        ))}
      </h1>
      <div className={styles.body}>
        <p className={styles.text}>{copy.body}</p>
        <TextLink href={routes.guides}>{copy.linkLabel}</TextLink>
      </div>
    </section>
  );
}
