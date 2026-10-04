import type { Metadata } from 'next';
import { FilterBar } from '@/components/filters/FilterBar/FilterBar';
import { MobileFilterBar } from '@/components/filters/MobileFilterBar/MobileFilterBar';
import { TourFiltersProvider } from '@/components/filters/TourFiltersProvider/TourFiltersProvider';
import { TourResults } from '@/components/filters/TourResults/TourResults';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { getToursCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { getToursPage } from '@/lib/content/toursPage';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { PENDING_SCRIPT } from '@/lib/utils/toursSearch';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { PrivateTripBanner } from '@/sections/PrivateTripBanner/PrivateTripBanner';
import { ReviewsSection } from '@/sections/ReviewsSection/ReviewsSection';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';

export function generateMetadata(): Metadata {
  return pageMetadata(getToursCopy(), getSettings());
}

/**
 * Every trip, soonest first, filtered and sorted in the browser from the link (PRD #56), with a
 * private trip offered after the first row, then reviews and the trust strip. It has no photo of
 * its own, so it shares the Homepage's image.
 */
export default function ToursPage() {
  const page = getToursPage();
  const { copy, settings, builtOn, sharePhoto, whatsapp, tours, destinations, optionLabels } = page;

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.tours} siteUrl={settings.site.url} />
      {/* Before the results are painted: a linked view keeps them hidden until it's applied. */}
      <script dangerouslySetInnerHTML={{ __html: PENDING_SCRIPT }} />
      <PageHeader headline={copy.header.headline} lead={copy.header.lead} />
      <TourFiltersProvider tours={tours} destinations={destinations} builtOn={builtOn}>
        <FilterBar copy={{ filters: copy.filters, sortLabel: copy.sortLabel, sorts: copy.sorts, results: copy.results }} labels={optionLabels} />
        <MobileFilterBar copy={{ filters: copy.filters, mobile: copy.mobile, results: copy.results, sorts: copy.sorts }} labels={optionLabels} />
        <TourResults
          copy={{ results: copy.results, sorts: copy.sorts, empty: copy.empty, filters: copy.filters }}
          labels={optionLabels}
          settings={whatsapp}
          banner={<PrivateTripBanner copy={copy.banner} planHref={routes.plan} whatsappHref={page.askHref} />}
        />
      </TourFiltersProvider>
      <ReviewsSection variant="compact" copy={copy.reviews} reviews={page.reviews} summary={page.ratingSummary} />
      <TrustStrip settings={settings} year={new Date().getFullYear()} />
    </PageMain>
  );
}
