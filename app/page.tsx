import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { UpcomingDepartures } from '@/components/tour-card/UpcomingDepartures/UpcomingDepartures';
import { getTours } from '@/lib/content/catalog';
import { getHomeCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { todayInKarachi } from '@/lib/utils/departures';
import { pageMetadata } from '@/lib/utils/metadata';
import { BrandStatement } from '@/sections/BrandStatement/BrandStatement';
import { HomeHero } from '@/sections/HomeHero/HomeHero';
import { TourCardsSection } from '@/sections/TourCardsSection/TourCardsSection';

/** The Homepage shows the four soonest departures, one per tour. */
const DEPARTURE_CARDS = 4;

export function generateMetadata(): Metadata {
  return pageMetadata(getHomeCopy(), getSettings());
}

export default function HomePage() {
  const copy = getHomeCopy();
  const settings = getSettings();

  return (
    <PageMain>
      <ShareImageMeta photo={copy.hero.image} siteUrl={settings.site.url} />
      <HomeHero copy={copy.hero} settings={settings} />
      <BrandStatement copy={copy.statement} />
      <TourCardsSection id="departures" copy={copy.departures}>
        <UpcomingDepartures
          tours={getTours()}
          builtOn={todayInKarachi(new Date())}
          limit={DEPARTURE_CARDS}
          settings={{ contact: settings.contact, whatsapp: settings.whatsapp }}
        />
      </TourCardsSection>
    </PageMain>
  );
}
