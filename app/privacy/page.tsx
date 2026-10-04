import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { getLegalPage } from '@/lib/content/legalPage';
import { getLegalCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { pageMetadata } from '@/lib/utils/metadata';
import { LegalBody } from '@/sections/LegalBody/LegalBody';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getLegalCopy().privacy, getSettings());
}

/** The Privacy Policy (PRD #86): the legal template, filled from content and settings. */
export default function PrivacyPage() {
  const { legal, labels, settings, sharePhoto } = getLegalPage('privacy');
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader variant="legal" headline={legal.headline} updated={{ template: labels.lastUpdated, date: legal.lastUpdated }} />
      <LegalBody
        contents={{ label: labels.contents, toggleLabel: labels.contentsCount }}
        sections={legal.sections}
        closing={legal.closing}
        email={settings.contact.email}
      />
    </PageMain>
  );
}
