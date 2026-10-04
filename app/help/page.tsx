import type { Metadata } from 'next';
import { HelpProvider } from '@/components/help/HelpProvider/HelpProvider';
import { HelpSearch } from '@/components/help/HelpSearch/HelpSearch';
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

/**
 * Help (PRD #86): a search over every answer, then the answers in their categories, from the
 * shared FAQs and settings. The search and the answers share one state in the browser.
 */
export default function HelpPage() {
  const { copy, settings, categories, askHref, sharePhoto } = getHelpPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <HelpProvider categories={categories}>
        <PageHeader variant="help" headline={copy.header.headline} search={<HelpSearch copy={copy.search} />} />
        <HelpFaqs copy={copy} askHref={askHref} />
      </HelpProvider>
    </PageMain>
  );
}
