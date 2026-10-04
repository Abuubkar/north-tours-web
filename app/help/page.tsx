import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getHelpPage } from '@/lib/content/helpPage';
import { getHelpCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { HelpFaqs } from '@/sections/HelpFaqs/HelpFaqs';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getHelpCopy(), getSettings());
}

/** Help (PRD #86): every answer in its category, from the shared FAQs and settings. */
export default function HelpPage() {
  const { copy, settings, categories, sharePhoto } = getHelpPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader variant="help" headline={copy.header.headline} />
      <HelpFaqs copy={copy} categories={categories} />
    </PageMain>
  );
}
