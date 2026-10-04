import { Button } from '@/components/ui/Button/Button';
import { SectionLabel } from '@/components/ui/SectionLabel/SectionLabel';
import type { QuickLinksProps } from './QuickLinks.types';
import styles from './QuickLinks.module.css';

/**
 * Contact's "Quick links": a section with a label for its heading (DESIGN.md §6), large link rows
 * to carry on from the page, then the social links, as quiet buttons once real and plain text
 * while they're placeholders (as in the footer).
 */
export function QuickLinks({ label, links, follow, social }: QuickLinksProps) {
  return (
    <section className={styles.section}>
      <div className={styles.row}>
        <div className={styles.labelColumn}>
          <SectionLabel as="h2">{label}</SectionLabel>
        </div>
        <div className={styles.content}>
          <nav aria-label={label} className={styles.nav}>
            <ul className={styles.list}>
              {links.map(({ label: text, href }) => (
                <li key={href}>
                  <a href={href} className={styles.link}>
                    {text}
                    <span aria-hidden="true">→</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.follow}>
            <p className={styles.followLabel}>{follow}</p>
            <ul className={styles.social}>
              {social.map(({ label: name, href }) => (
                <li key={name}>
                  {href ? (
                    <Button href={href} variant="quiet" size={44}>
                      {name}
                    </Button>
                  ) : (
                    <span className={styles.socialText}>{name}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
