import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { Button } from '@/components/ui/Button/Button';
import { getNotFoundPage } from '@/lib/content/notFoundPage';
import { getNotFoundCopy } from '@/lib/content/pages';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { EmptyState } from '@/sections/EmptyState/EmptyState';
import { PageHeader } from '@/sections/PageHeader/PageHeader';
import { QuickLinks } from '@/sections/QuickLinks/QuickLinks';
import layout from '@/styles/layout.module.css';

/** Its own title and description. Next marks a not-found page `noindex` itself; the sitemap leaves it out. */
export function generateMetadata(): Metadata {
  return pageMetadata(getNotFoundCopy(), getSettings());
}

/**
 * The not-found page (PRD #94), exported as 404.html: says plainly the page isn't there, then a
 * way to browse tours or ask on WhatsApp, and Contact's quick links to the main pages. Built only
 * from existing parts; no nav item is marked.
 */
export default function NotFound() {
  const { copy, settings, askHref, quickLinks, sharePhoto } = getNotFoundPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <PageHeader headline={copy.header.headline} lead={copy.header.lead} />
      <div className={layout.bodySection}>
        <EmptyState
          headline={copy.empty.headline}
          lead={copy.empty.lead}
          actions={
            <>
              <Button href={routes.tours}>{copy.empty.toursLabel}</Button>
              <Button href={askHref} variant="secondary" icon="whatsapp">
                {copy.empty.askLabel}
              </Button>
            </>
          }
        />
      </div>
      <QuickLinks {...quickLinks} />
    </PageMain>
  );
}
