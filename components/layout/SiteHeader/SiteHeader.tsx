import { BrandMark } from '@/components/ui/BrandMark/BrandMark';
import { Icon } from '@/components/ui/Icon/Icon';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { NavLinks } from '../NavLinks/NavLinks';
import type { SiteHeaderProps } from './SiteHeader.types';
import styles from './SiteHeader.module.css';

const ICON_SIZE = 20;

/**
 * The sticky header on every page: 2f's solid Ink bar (ADR-0030), always dark. From 1200px: the
 * brand, the nav and a bordered "WhatsApp" button. Below: the brand, a WhatsApp square and Menu.
 */
export function SiteHeader({ settings }: SiteHeaderProps) {
  const whatsapp = whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage);

  return (
    <header data-surface="dark" className={styles.header}>
      <BrandMark name={settings.brand.name} />
      <div className={styles.wide}>
        <NavLinks variant="header" />
      </div>
      <div className={styles.actions}>
        <div className={styles.wide}>
          <a href={whatsapp} className={styles.whatsapp}>
            <Icon name="whatsapp" size={ICON_SIZE} />
            WhatsApp
          </a>
        </div>
        <div className={styles.narrow}>
          <a href={whatsapp} className={styles.whatsappSquare} aria-label="Chat on WhatsApp">
            <Icon name="whatsapp" size={ICON_SIZE} />
          </a>
        </div>
        <MobileMenu whatsappHref={whatsapp} />
      </div>
    </header>
  );
}
