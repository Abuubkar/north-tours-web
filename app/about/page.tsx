import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getAboutPage } from '@/lib/content/aboutPage';
import { getAboutCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { Credentials } from '@/sections/Credentials/Credentials';
import { GuidesGrid } from '@/sections/GuidesGrid/GuidesGrid';
import { HowWeTravel } from '@/sections/HowWeTravel/HowWeTravel';
import { InNumbers } from '@/sections/InNumbers/InNumbers';
import { OurStory } from '@/sections/OurStory/OurStory';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { VehiclesAndSafety } from '@/sections/VehiclesAndSafety/VehiclesAndSafety';

export function generateMetadata(): Metadata {
  return pageMetadata(getAboutCopy(), getSettings());
}

/** Who runs the company, who guides and drives, and how every trip is run (PRD #78). */
export default function AboutPage() {
  const { copy, settings, sharePhoto, profiles, stats } = getAboutPage();

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader variant="about" headline={copy.header.headline} lead={copy.header.lead} image={copy.header.image} />
      <OurStory copy={copy.story} />
      <HowWeTravel copy={copy.principles} />
      <GuidesGrid variant="about" copy={copy.guides} profiles={profiles} />
      <VehiclesAndSafety copy={copy.vehicles} />
      <InNumbers headline={copy.numbers.headline} stats={stats} />
      <Credentials copy={copy.credentials} licenceNote={settings.trust.licence.note} companyRegistration={settings.legal.companyRegistration} />
    </PageMain>
  );
}
