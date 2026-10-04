import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { getLegalPage } from '@/lib/content/legalPage';
import { getLegalCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { LegalBody } from '@/sections/LegalBody/LegalBody';
import { PageHeader } from '@/sections/PageHeader/PageHeader';

export function generateMetadata(): Metadata {
  return pageMetadata(getLegalCopy().terms, getSettings());
}

/** The Terms and conditions (PRD #86): the legal template, filled from content and settings. */
export default function TermsPage() {
  const { legal, labels, settings, sharePhoto } = getLegalPage('terms');
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.terms} siteUrl={settings.site.url} />
      <PageHeader variant="legal" headline={legal.headline} updated={{ template: labels.lastUpdated, date: legal.lastUpdated }} />
      <LegalBody
        contents={{ label: labels.contents, countLabel: labels.contentsCount }}
        sections={legal.sections}
        closing={legal.closing}
        email={settings.contact.email}
      />
    </PageMain>
  );
}
