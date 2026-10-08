import { Button } from '@/components/ui/Button/Button';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { TextOrLink } from '@/components/ui/TextOrLink/TextOrLink';
import { routes } from '@/lib/routes';
import { emailHref, phoneHref, socialLinks } from '@/lib/utils/contact';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { NavLinks } from '../NavLinks/NavLinks';
import type { SiteFooterProps } from './SiteFooter.types';
import styles from './SiteFooter.module.css';

/** The small links after social. Contact is one of the main nav's large links above. */
const smallPages = [
  { label: 'Help', href: routes.help },
  { label: 'Privacy', href: routes.privacy },
  { label: 'Terms', href: routes.terms },
  { label: 'Photo credits', href: routes.credits },
];

/**
 * The footer on every page, built from settings: the main nav's pages as large links from the
 * left margin, and the contact column on the right (under them on phones). No section label
 * (owner feedback, 2026-10-05). Placeholders show as written, unlinked.
 */
export function SiteFooter({ settings }: SiteFooterProps) {
  const { brand, contact, legal, social, whatsapp } = settings;
  const chatHref = whatsappLink(contact.whatsapp, whatsapp.generalMessage);

  return (
    <footer data-surface="dark" className={styles.footer}>
      <div className={styles.columns}>
        <NavLinks variant="footer" />
        <div className={styles.contact}>
          <p className={styles.intro}>{whatsapp.footerIntro}</p>
          <Button href={chatHref} size={56} icon="whatsapp">
            Chat on WhatsApp
          </Button>
          <dl>
            <KeyValueRow label="Mobile">
              <TextOrLink href={phoneHref(contact.phone)} className={styles.rowLink}>
                {contact.phone}
              </TextOrLink>
            </KeyValueRow>
            <KeyValueRow label="Email">
              <TextOrLink href={emailHref(contact.email)} className={styles.rowLink}>
                {contact.email}
              </TextOrLink>
            </KeyValueRow>
            <KeyValueRow label="Office">
              {contact.officeAddress}
              <br />
              {contact.officeHours}
            </KeyValueRow>
          </dl>
        </div>
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} {brand.name} · DTS Licence No. {legal.dtsLicence}
        </p>
        <ul className={styles.smallLinks}>
          {[...socialLinks(social), ...smallPages].map(({ label, href }) => (
            <li key={label} className={styles.smallItem}>
              <TextOrLink href={href} className={styles.smallLink}>
                {label}
              </TextOrLink>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
