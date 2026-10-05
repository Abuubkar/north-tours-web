import type { Metadata } from 'next';
import { PlanningActions } from '@/components/about/PlanningActions/PlanningActions';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { getAboutPage } from '@/lib/content/aboutPage';
import { getAboutCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { ClosingCta } from '@/sections/ClosingCta/ClosingCta';
import { Credentials } from '@/sections/Credentials/Credentials';
import { GuidesGrid } from '@/sections/GuidesGrid/GuidesGrid';
import { HowWeTravel } from '@/sections/HowWeTravel/HowWeTravel';
import { InNumbers } from '@/sections/InNumbers/InNumbers';
import { OurStory } from '@/sections/OurStory/OurStory';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { ReviewsSection } from '@/sections/ReviewsSection/ReviewsSection';
import { VehiclesAndSafety } from '@/sections/VehiclesAndSafety/VehiclesAndSafety';
import { VisitOffice } from '@/sections/VisitOffice/VisitOffice';

export function generateMetadata(): Metadata {
  return pageMetadata(getAboutCopy(), getSettings());
}

/** Who runs the company, who guides and drives, and how every trip is run (PRD #78). */
export default function AboutPage() {
  const { copy, settings, sharePhoto, profiles, stats, credentials, reviews, officeMap } = getAboutPage();

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.about} siteUrl={settings.site.url} />
      <PageHeader variant="about" headline={copy.header.headline} lead={copy.header.lead} image={copy.header.image} />
      <OurStory copy={copy.story} />
      <HowWeTravel copy={copy.principles} />
      <GuidesGrid variant="about" copy={copy.guides} profiles={profiles} />
      <VehiclesAndSafety copy={copy.vehicles} />
      <InNumbers headline={copy.numbers.headline} stats={stats} />
      <Credentials credentials={credentials} />
      <VisitOffice settings={settings} map={officeMap} />
      <ReviewsSection copy={copy.reviews} headlineSize="long" reviews={reviews} summary={null} />
      <ClosingCta
        headline={copy.cta.headline}
        actions={<PlanningActions exploreLabel={copy.cta.exploreLabel} planLabel={copy.cta.planLabel} />}
      />
    </PageMain>
  );
}
