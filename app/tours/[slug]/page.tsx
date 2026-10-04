import type { Metadata } from 'next';
import { BookingCtaActions } from '@/components/booking-panel/BookingCtaActions/BookingCtaActions';
import { BookingPanel } from '@/components/booking-panel/BookingPanel/BookingPanel';
import { BookingProvider } from '@/components/booking-panel/BookingProvider/BookingProvider';
import { BookingSheet } from '@/components/booking-panel/BookingSheet/BookingSheet';
import { BookingStickyBar } from '@/components/booking-panel/BookingStickyBar/BookingStickyBar';
import { HeroFacts } from '@/components/facts/HeroFacts/HeroFacts';
import { RelatedTours } from '@/components/tour-card/RelatedTours/RelatedTours';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getTour, getTours } from '@/lib/content/catalog';
import { getSettings } from '@/lib/content/settings';
import { getTourPage, tourPageTitle } from '@/lib/content/tourPage';
import { routes } from '@/lib/routes';
import { tripLength } from '@/lib/utils/dates';
import { pageMetadata } from '@/lib/utils/metadata';
import { routeLine } from '@/lib/utils/route';
import { fillTokens } from '@/lib/utils/tokens';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { BookingLayout } from '@/sections/BookingLayout/BookingLayout';
import { ClosingCta } from '@/sections/ClosingCta/ClosingCta';
import { FaqSection } from '@/sections/FaqSection/FaqSection';
import { DatesAndPrices } from '@/sections/DatesAndPrices/DatesAndPrices';
import { Highlights } from '@/sections/Highlights/Highlights';
import { Hotels } from '@/sections/Hotels/Hotels';
import { Included } from '@/sections/Included/Included';
import { Itinerary } from '@/sections/Itinerary/Itinerary';
import { PhotoHero } from '@/sections/PhotoHero/PhotoHero';
import { QuickFacts } from '@/sections/QuickFacts/QuickFacts';
import { ReviewsSection } from '@/sections/ReviewsSection/ReviewsSection';
import { TourCardsSection } from '@/sections/TourCardsSection/TourCardsSection';
import { TripOverview } from '@/sections/TripOverview/TripOverview';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';

type TourPageProps = { params: Promise<{ slug: string }> };

/** One page per tour in content; any other slug isn't built. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getTours().map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { slug } = await params;
  return pageMetadata({ title: tourPageTitle(slug), description: getTour(slug)!.summary }, getSettings());
}

export default async function TourPage({ params }: TourPageProps) {
  const page = getTourPage((await params).slug);
  const { tour, copy, settings, tokens, builtOn, whatsapp } = page;
  const { title, days, nights, rating, prices, departures } = tour;
  const panel = {
    tour: { title, rating, prices },
    copy: copy.booking,
    tokens,
    settings: { ...whatsapp, booking: settings.booking },
    paymentMethods: page.paymentMethods,
  };

  return (
    <PageMain>
      <ShareImageMeta photo={page.sharePhoto} siteUrl={settings.site.url} />
      <PhotoHero
        image={tour.image}
        back={{ href: routes.tours, label: copy.hero.backLabel }}
        kicker={routeLine(tour.route)}
        title={tour.title}
      >
        <HeroFacts
          tour={{ days, nights, rating, prices, departures }}
          builtOn={builtOn}
          copy={copy.facts}
          whatsappHref={whatsappLink(settings.contact.whatsapp, settings.whatsapp.generalMessage)}
        />
      </PhotoHero>
      <QuickFacts copy={copy.quickFacts} tour={tour} pickupPoint={settings.booking.pickupPoint} />
      <BookingProvider departures={tour.departures} builtOn={builtOn}>
        <BookingLayout
          label={copy.booking.label}
          aside={<BookingPanel variant="aside" {...panel} />}
        >
          <TripOverview overview={tour.overview} copy={copy.overview} />
          <Highlights headline={copy.highlights.headline} highlights={tour.highlights} />
          <Itinerary copy={copy.itinerary} tour={tour} />
          <Included copy={copy.included} included={tour.included} notIncluded={tour.notIncluded} />
          <Hotels copy={copy.hotels} stays={tour.stays} />
          <DatesAndPrices
            tour={{ title, days, nights, prices }}
            copy={copy.dates}
            settings={whatsapp}
            roomsNote={fillTokens(copy.dates.rooms.note, tokens)}
          />
        </BookingLayout>
        <ReviewsSection copy={copy.reviews} headlineSize="standard" reviews={page.reviews} summary={rating} />
        <ClosingCta
          id="book"
          headline={fillTokens(copy.cta.headline, tokens)}
          lead={copy.cta.lead}
          actions={
            <BookingCtaActions
              tour={title}
              reserveLabel={fillTokens(copy.booking.reserveLabel, tokens)}
              askLabel={copy.booking.askLabel}
              settings={whatsapp}
            />
          }
        >
          <TrustStrip variant="mini" settings={settings} year={new Date().getFullYear()} />
        </ClosingCta>
        <FaqSection headline={copy.faqs.headline} questions={page.questions} />
        <TourCardsSection id="related" copy={copy.related}>
          <RelatedTours tour={{ slug: tour.slug, destinations: tour.destinations }} tours={page.others} builtOn={builtOn} settings={whatsapp} />
        </TourCardsSection>
        <BookingStickyBar tour={{ title, prices }} copy={copy.bar} priceNote={copy.booking.priceNote} settings={whatsapp} />
        <BookingSheet subtitle={fillTokens(copy.sheet.subtitle, { tripLength: tripLength(days, nights) })} {...panel} />
      </BookingProvider>
    </PageMain>
  );
}
