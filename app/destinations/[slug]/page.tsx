import type { Metadata } from 'next';
import { DestinationFacts } from '@/components/facts/DestinationFacts/DestinationFacts';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getDestination, getDestinations } from '@/lib/content/catalog';
import { destinationPageTitle, getDestinationPage } from '@/lib/content/destinationPage';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { destinationSections } from '@/lib/utils/destination';
import { pageMetadata } from '@/lib/utils/metadata';
import { fillTokens } from '@/lib/utils/tokens';
import { DestinationOverview } from '@/sections/DestinationOverview/DestinationOverview';
import { GettingThere } from '@/sections/GettingThere/GettingThere';
import { GoodToKnow } from '@/sections/GoodToKnow/GoodToKnow';
import { PhotoHero } from '@/sections/PhotoHero/PhotoHero';
import { PlacesToSee } from '@/sections/PlacesToSee/PlacesToSee';
import { SeasonCalendarSection } from '@/sections/SeasonCalendarSection/SeasonCalendarSection';

type DestinationPageProps = { params: Promise<{ slug: string }> };

/** One page per destination in content; any other slug isn't built. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getDestinations().map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: DestinationPageProps): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({ title: destinationPageTitle(slug), description: getDestination(slug)!.description }, getSettings());
}

export default async function DestinationPage({ params }: DestinationPageProps) {
  const page = getDestinationPage((await params).slug);
  const { destination, copy, settings } = page;
  const shows = new Set(destinationSections(destination));
  const tokens = { destination: destination.name };

  return (
    <PageMain>
      <ShareImageMeta photo={page.sharePhoto} siteUrl={settings.site.url} />
      <PhotoHero
        variant="destination"
        image={destination.image}
        back={{ href: routes.destinations, label: copy.hero.backLabel }}
        kicker={destination.region}
        title={destination.name}
        lead={destination.lead}
      >
        <DestinationFacts destination={destination} tourCount={page.tours.length} copy={copy.facts} />
      </PhotoHero>
      <DestinationOverview overview={destination.overview} />
      <SeasonCalendarSection destination={destination} copy={copy.calendar} />
      {shows.has('places') && (
        <PlacesToSee
          headline={fillTokens(copy.places.headline, tokens)}
          places={destination.places ?? []}
          labels={destination.mapLabels ?? []}
          copy={copy.places}
        />
      )}
      {shows.has('gettingThere') && <GettingThere gettingThere={destination.gettingThere} copy={copy.gettingThere} />}
      {shows.has('goodToKnow') && <GoodToKnow copy={copy.goodToKnow} notes={destination.notes ?? []} />}
    </PageMain>
  );
}
