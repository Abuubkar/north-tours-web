import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { JsonLd } from '@/components/seo/JsonLd/JsonLd';
import { UpcomingDepartures } from '@/components/tour-card/UpcomingDepartures/UpcomingDepartures';
import { getDestinations, getTour, getTours } from '@/lib/content/catalog';
import { getGuides } from '@/lib/content/guides';
import { getHomeCopy } from '@/lib/content/pages';
import { getReviews } from '@/lib/content/reviews';
import { getRouteMap } from '@/lib/content/routeMap';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { altitudePlaces } from '@/lib/utils/altitudeStrip';
import { cardTour } from '@/lib/utils/cardTour';
import { todayInKarachi } from '@/lib/utils/departures';
import { pageMetadata } from '@/lib/utils/metadata';
import { ratingSummary } from '@/lib/utils/rating';
import { travelAgency } from '@/lib/utils/structuredData';
import { fillTokens, settingsTokens } from '@/lib/utils/tokens';
import { AltitudeStrip } from '@/sections/AltitudeStrip/AltitudeStrip';
import { BrandStatement } from '@/sections/BrandStatement/BrandStatement';
import { DestinationsGrid } from '@/sections/DestinationsGrid/DestinationsGrid';
import { GuidesGrid } from '@/sections/GuidesGrid/GuidesGrid';
import { HomeHero } from '@/sections/HomeHero/HomeHero';
import { HowBookingWorks } from '@/sections/HowBookingWorks/HowBookingWorks';
import { ReviewsSection } from '@/sections/ReviewsSection/ReviewsSection';
import { RouteMapSection } from '@/sections/RouteMapSection/RouteMapSection';
import { TourCardsSection } from '@/sections/TourCardsSection/TourCardsSection';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';

/** The Homepage shows the four soonest departures, one per tour. */
const DEPARTURE_CARDS = 4;

/** And the three most recent reviews. */
const REVIEW_CARDS = 3;

export function generateMetadata(): Metadata {
  return pageMetadata(getHomeCopy(), getSettings());
}

export default function HomePage() {
  const copy = getHomeCopy();
  const settings = getSettings();
  const tours = getTours();
  const destinations = getDestinations();
  const tokens = settingsTokens(settings);
  const steps = copy.how.steps.map((step) => ({ ...step, text: fillTokens(step.text, tokens) }));
  const reviews = getReviews()
    .slice(0, REVIEW_CARDS)
    .map((review) => ({ review, tourTitle: getTour(review.tour)!.title }));

  return (
    <>
      {/* Under the header, before <main>, so the skip link passes it (Homepage only, ADR-0030). */}
      <AltitudeStrip places={altitudePlaces(destinations)} copy={copy.altitudes} />
      <PageMain>
      <ShareImageMeta photo={copy.hero.image} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.home} siteUrl={settings.site.url} />
      <JsonLd data={travelAgency(settings, { description: copy.description, image: copy.hero.image.src })} />
      <HomeHero copy={copy.hero} settings={settings} />
      <BrandStatement copy={copy.statement} />
      <TourCardsSection id="departures" copy={copy.departures}>
        <UpcomingDepartures
          tours={tours.map(cardTour)}
          builtOn={todayInKarachi(new Date())}
          limit={DEPARTURE_CARDS}
          settings={{ contact: settings.contact, whatsapp: settings.whatsapp }}
        />
      </TourCardsSection>
      <HowBookingWorks copy={{ ...copy.how, steps }} />
      <RouteMapSection copy={copy.route} map={getRouteMap()} />
      <DestinationsGrid copy={copy.destinations} destinations={destinations} />
      <GuidesGrid copy={copy.guides} guides={getGuides()} />
      <ReviewsSection copy={copy.reviews} reviews={reviews} summary={ratingSummary(tours.map((tour) => tour.rating))} />
      <TrustStrip settings={settings} year={new Date().getFullYear()} />
      </PageMain>
    </>
  );
}
