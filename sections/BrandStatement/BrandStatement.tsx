import { TextLink } from '@/components/ui/TextLink/TextLink';
import { routes } from '@/lib/routes';
import type { BrandStatementProps } from './BrandStatement.types';
import styles from './BrandStatement.module.css';

/** The Homepage's brand statement: the page's only <h1>, then a short paragraph and "Meet the team". */
export function BrandStatement({ copy }: BrandStatementProps) {
  return (
    <section className={styles.statement}>
      <h1 className={styles.headline}>{copy.headline}</h1>
      <div className={styles.body}>
        <p className={styles.text}>{copy.body}</p>
        <TextLink href={routes.guides}>{copy.linkLabel}</TextLink>
      </div>
    </section>
  );
}
