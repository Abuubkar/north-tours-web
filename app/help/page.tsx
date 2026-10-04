import type { Metadata } from 'next';
import { AskActions } from '@/components/help/AskActions/AskActions';
import { HelpProvider } from '@/components/help/HelpProvider/HelpProvider';
import { HelpSearch } from '@/components/help/HelpSearch/HelpSearch';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { JsonLd } from '@/components/seo/JsonLd/JsonLd';
import { getHelpPage } from '@/lib/content/helpPage';
import { getHelpCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { ClosingCta } from '@/sections/ClosingCta/ClosingCta';
import { HelpFaqs } from '@/sections/HelpFaqs/HelpFaqs';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { Policies } from '@/sections/Policies/Policies';
import { TrustStrip } from '@/sections/TrustStrip/TrustStrip';

export function generateMetadata(): Metadata {
  return pageMetadata(getHelpCopy(), getSettings());
}

/**
 * Help (PRD #86): a search over every answer, the answers in their categories, the booking
 * policies, then a way to ask on WhatsApp and the trust strip. The search and the answers share
 * one state in the browser; the rest is static.
 */
export default function HelpPage() {
  const { copy, settings, categories, structuredData, policies, askHref, callHref, sharePhoto } = getHelpPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <JsonLd data={structuredData.faqs} />
      <HelpProvider categories={categories}>
        <PageHeader variant="help" headline={copy.header.headline} search={<HelpSearch copy={copy.search} />} />
        <HelpFaqs copy={copy} askHref={askHref} />
      </HelpProvider>
      <Policies copy={copy.policies} updated={copy.policiesUpdated} policies={policies} />
      <ClosingCta
        headline={copy.cta.headline}
        lead={copy.cta.lead}
        actions={<AskActions askLabel={copy.cta.askLabel} askHref={askHref} callLabel={copy.cta.callLabel} callHref={callHref} />}
      />
      <TrustStrip settings={settings} year={new Date().getFullYear()} />
    </PageMain>
  );
}
