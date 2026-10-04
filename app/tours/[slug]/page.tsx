import type { Metadata } from 'next';
import { BookingPanel } from '@/components/booking-panel/BookingPanel/BookingPanel';
import { BookingProvider } from '@/components/booking-panel/BookingProvider/BookingProvider';
import { HeroFacts } from '@/components/facts/HeroFacts/HeroFacts';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getTour, getTours } from '@/lib/content/catalog';
import { isPhoto } from '@/lib/content/images';
import { getHomeCopy, getTourCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import type { Tour } from '@/lib/content/tours';
import { routes } from '@/lib/routes';
import { dayCount } from '@/lib/utils/dates';
import { todayInKarachi } from '@/lib/utils/departures';
import { pageMetadata } from '@/lib/utils/metadata';
import { routeLine } from '@/lib/utils/route';
import { fillTokens, settingsTokens } from '@/lib/utils/tokens';
import { whatsappLink } from '@/lib/utils/whatsapp';
import { BookingLayout } from '@/sections/BookingLayout/BookingLayout';
import { DatesAndPrices } from '@/sections/DatesAndPrices/DatesAndPrices';
import { PhotoHero } from '@/sections/PhotoHero/PhotoHero';
import { QuickFacts } from '@/sections/QuickFacts/QuickFacts';

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
  const messages = { contact: settings.contact, whatsapp: settings.whatsapp };

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
          aside={
            <BookingPanel
              tour={{ title, rating, prices }}
              copy={copy.booking}
              tokens={tokens}
              settings={{ ...messages, booking: settings.booking, payments: settings.payments }}
            />
          }
        >
          <DatesAndPrices
            tour={{ title, days, nights, prices }}
            copy={copy.dates}
            settings={messages}
            roomsNote={fillTokens(copy.dates.rooms.note, tokens)}
          />
        </BookingLayout>
      </BookingProvider>
    </PageMain>
  );
}
