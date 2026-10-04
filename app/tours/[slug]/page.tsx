import type { Metadata } from 'next';
import { BookingCtaActions } from '@/components/booking-panel/BookingCtaActions/BookingCtaActions';
import { BookingPanel } from '@/components/booking-panel/BookingPanel/BookingPanel';
import { BookingProvider } from '@/components/booking-panel/BookingProvider/BookingProvider';
import { BookingSheet } from '@/components/booking-panel/BookingSheet/BookingSheet';
import { BookingStickyBar } from '@/components/booking-panel/BookingStickyBar/BookingStickyBar';
import { HeroFacts } from '@/components/facts/HeroFacts/HeroFacts';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getTour, getTours } from '@/lib/content/catalog';
import { isPhoto } from '@/lib/content/images';
import { getHomeCopy, getTourCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';
import { routes } from '@/lib/routes';
import { dayCount, tripLength } from '@/lib/utils/dates';
import { todayInKarachi } from '@/lib/utils/departures';
import { pageMetadata } from '@/lib/utils/metadata';
import { paymentMethodsLabel } from '@/lib/utils/payments';
import { routeLine } from '@/lib/utils/route';
import { fillTokens, settingsTokens } from '@/lib/utils/tokens';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { BookingLayout } from '@/sections/BookingLayout/BookingLayout';
import { ClosingCta } from '@/sections/ClosingCta/ClosingCta';
import { DatesAndPrices } from '@/sections/DatesAndPrices/DatesAndPrices';
import { Highlights } from '@/sections/Highlights/Highlights';
import { Hotels } from '@/sections/Hotels/Hotels';
import { Included } from '@/sections/Included/Included';
import { PhotoHero } from '@/sections/PhotoHero/PhotoHero';
import { QuickFacts } from '@/sections/QuickFacts/QuickFacts';
import { TripOverview } from '@/sections/TripOverview/TripOverview';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';

type TourPageProps = { params: Promise<{ slug: string }> };

/** One page per tour in content; any other slug isn't built. */
export const dynamicParams = false;

export function generateStaticParams() {
  return getTours().map((tour) => ({ slug: tour.slug }));
}

/** The tour for this page; the static params only name tours that exist. */
async function pageTour({ params }: TourPageProps): Promise<Tour> {
  return getTour((await params).slug)!;
}

export async function generateMetadata(props: TourPageProps): Promise<Metadata> {
  const tour = await pageTour(props);
  const title = fillTokens(getTourCopy().title, { tour: tour.title, duration: dayCount(tour.days) });
  return pageMetadata({ title, description: tour.summary }, getSettings());
}

export default async function TourPage(props: TourPageProps) {
  const tour = await pageTour(props);
  const copy = getTourCopy();
  const settings = getSettings();
  // The share image is the tour's photo; until it has one, the Homepage's.
  const sharePhoto = isPhoto(tour.image) ? tour.image : getHomeCopy().hero.image;
  const builtOn = todayInKarachi(new Date());
  const tokens = { ...settingsTokens(settings), licence: settings.legal.dtsLicence };
  // Client components get only what they use; everything passed to them is sent to the browser.
  const { title, days, nights, rating, prices, departures } = tour;
  const whatsapp = { contact: settings.contact, whatsapp: settings.whatsapp };
  const panel = {
    tour: { title, rating, prices },
    copy: copy.booking,
    tokens,
    settings: { ...whatsapp, booking: settings.booking },
    paymentMethods: paymentMethodsLabel(settings),
  };

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
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
          <Included copy={copy.included} tour={tour} />
          <Hotels copy={copy.hotels} stays={tour.stays} />
          <DatesAndPrices
            tour={{ title, days, nights, prices }}
            copy={copy.dates}
            settings={whatsapp}
            roomsNote={fillTokens(copy.dates.rooms.note, tokens)}
          />
        </BookingLayout>
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
        <BookingStickyBar tour={{ title, prices }} copy={copy.bar} priceNote={copy.booking.priceNote} settings={whatsapp} />
        <BookingSheet subtitle={fillTokens(copy.sheet.subtitle, { tripLength: tripLength(days, nights) })} {...panel} />
      </BookingProvider>
    </PageMain>
  );
}
