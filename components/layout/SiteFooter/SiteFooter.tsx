import { Button } from '@/components/ui/Button/Button';
import { KeyValueRow } from '@/components/ui/KeyValueRow/KeyValueRow';
import { SectionLabel } from '@/components/ui/SectionLabel/SectionLabel';
import { TextOrLink } from '@/components/ui/TextOrLink/TextOrLink';
import { routes } from '@/lib/routes';
import { emailHref, phoneHref, webHref } from '@/lib/utils/contact';
import { whatsappLink } from '@/lib/utils/whatsapp';
import type { SiteFooterProps } from './SiteFooter.types';
import styles from './SiteFooter.module.css';

const footerNav = [
  { label: 'Tours', href: routes.tours },
  { label: 'Destinations', href: routes.destinations },
  { label: 'Private trips', href: routes.plan },
  { label: 'About us', href: routes.about },
  { label: 'Reviews', href: routes.reviews },
];

const legalLinks = [
  { label: 'Help', href: routes.help },
  { label: 'Contact', href: routes.contact },
  { label: 'Privacy', href: routes.privacy },
  { label: 'Terms', href: routes.terms },
  { label: 'Photo credits', href: routes.credits },
];

/** The footer on every page, built from settings. Placeholders show as written, unlinked. */
export function SiteFooter({ settings }: SiteFooterProps) {
  const { brand, contact, legal, social, whatsapp } = settings;
  const whatsappHref = whatsappLink(contact.whatsapp, whatsapp.generalMessage);
  const socialLinks = [
    { label: 'Instagram', href: webHref(social.instagram) },
    { label: 'Facebook', href: webHref(social.facebook) },
    { label: 'YouTube', href: webHref(social.youtube) },
  ];

  return (
    <footer data-surface="dark" className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.labelColumn}>
          <SectionLabel>Contact</SectionLabel>
        </div>
        <div className={styles.columns}>
          <nav aria-label="Footer">
            <ul className={styles.list}>
              {footerNav.map(({ label, href }) => (
                <li key={label}>
                  <a href={href} className={styles.bigLink}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.contact}>
            <p className={styles.intro}>{whatsapp.footerIntro}</p>
            <Button href={whatsappHref} size={56} icon="whatsapp">
              Chat on WhatsApp
            </Button>
            <dl>
              <KeyValueRow label="WhatsApp">
                <TextOrLink href={whatsappHref} className={styles.rowLink}>
                  {contact.whatsapp}
                </TextOrLink>
              </KeyValueRow>
              <KeyValueRow label="Phone">
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
      </div>
      <div className={styles.bottom}>
        <p>
          © {new Date().getFullYear()} {brand.name} · DTS Licence No. {legal.dtsLicence}
        </p>
        <ul className={styles.smallLinks}>
          {[...socialLinks, ...legalLinks].map(({ label, href }) => (
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
