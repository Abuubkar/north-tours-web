import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getAboutPage } from '@/lib/content/aboutPage';
import { getAboutCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { HowWeTravel } from '@/sections/HowWeTravel/HowWeTravel';
import { OurStory } from '@/sections/OurStory/OurStory';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getAboutCopy(), getSettings());
}

/** Who runs the company, who guides and drives, and how every trip is run (PRD #78). */
export default function AboutPage() {
  const { copy, settings, sharePhoto } = getAboutPage();

  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader variant="about" headline={copy.header.headline} lead={copy.header.lead} image={copy.header.image} />
      <OurStory copy={copy.story} />
      <HowWeTravel copy={copy.principles} />
    </PageMain>
  );
}
