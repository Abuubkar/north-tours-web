import { Button } from '@/components/ui/Button/Button';
import { BrandMark } from '@/components/ui/BrandMark/BrandMark';
import { IconButton } from '@/components/ui/IconButton/IconButton';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { MobileMenu } from '../MobileMenu/MobileMenu';
import { NavLinks } from '../NavLinks/NavLinks';
import type { SiteHeaderProps } from './SiteHeader.types';
import styles from './SiteHeader.module.css';

/**
 * The sticky, frosted header on every page. Always dark, even over a light section.
 * From 820px: brand, nav and "WhatsApp us". Below: brand, a WhatsApp icon button and the menu.
 */
export function SiteHeader({ settings }: SiteHeaderProps) {
  const whatsapp = whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage);

  return (
    <header data-surface="dark" className={styles.header}>
      <BrandMark name={settings.brand.name} />
      <nav aria-label="Main" className={styles.wide}>
        <NavLinks variant="header" />
      </nav>
      <div className={styles.actions}>
        <div className={styles.wide}>
          <Button href={whatsapp} variant="secondary" size={44} icon="whatsapp">
            WhatsApp us
          </Button>
        </div>
        <div className={styles.narrow}>
          <IconButton href={whatsapp} icon="whatsapp" label="Chat on WhatsApp" />
        </div>
        <MobileMenu whatsappHref={whatsapp} />
      </div>
    </header>
  );
}
