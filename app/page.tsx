import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getHomeCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { BrandStatement } from '@/sections/BrandStatement/BrandStatement';
import { HomeHero } from '@/sections/HomeHero/HomeHero';

export function generateMetadata(): Metadata {
  return pageMetadata(getHomeCopy(), getSettings());
}

export default function HomePage() {
  const copy = getHomeCopy();
  const settings = getSettings();
  const generalWhatsApp = whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage);

  return (
    <PageMain>
      <ShareImageMeta photo={copy.hero.image} siteUrl={settings.site.url} />
      <HomeHero copy={copy.hero} whatsappHref={generalWhatsApp} />
      <BrandStatement copy={copy.statement} />
    </PageMain>
  );
}
