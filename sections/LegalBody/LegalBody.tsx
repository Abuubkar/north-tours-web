import { LegalSection } from '@/components/legal/LegalSection/LegalSection';
import { TableOfContents } from '@/components/legal/TableOfContents/TableOfContents';
import { TextLink } from '@/components/ui/TextLink/TextLink';
import { emailHref } from '@/lib/utils/contact';
import { splitAtToken } from '@/lib/utils/tokens';
import type { LegalBodyProps } from './LegalBody.types';
import styles from './LegalBody.module.css';

/**
 * A legal document's text (light), one template for /privacy and /terms: the contents beside it
 * from 820px (above it on phones), the numbered sections, then who to email with questions.
 */
export function LegalBody({ contents, sections, closing, email }: LegalBodyProps) {
  const [before, after] = splitAtToken(closing, 'email');
  const href = emailHref(email);
  return (
    <section data-surface="light" className={styles.body}>
      <div className={styles.layout}>
        <TableOfContents label={contents.label} countLabel={contents.countLabel} sections={sections} />
        <article className={styles.article}>
          {sections.map((section) => (
            <LegalSection key={section.id} {...section} />
          ))}
          <p className={styles.closing}>
            {before}
            {href ? (
              <TextLink variant="inline" href={href}>
                {email}
              </TextLink>
            ) : (
              email
            )}
            {after}
          </p>
        </article>
      </div>
    </section>
  );
}
