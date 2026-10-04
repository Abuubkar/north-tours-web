import type { Metadata } from 'next';
import { PageMain } from '@/components/layout/PageMain/PageMain';
import { ShareImageMeta } from '@/components/layout/ShareImageMeta/ShareImageMeta';
import { CanonicalMeta } from '@/components/seo/CanonicalMeta/CanonicalMeta';
import { PlannerProvider } from '@/components/planner/PlannerProvider/PlannerProvider';
import { getPlannerCopy } from '@/lib/content/pages';
import { getPlannerPage } from '@/lib/content/plannerPage';
import { getSettings } from '@/lib/content/settings';
import { routes } from '@/lib/routes';
import { pageMetadata } from '@/lib/utils/metadata';
import { PLANNER_PENDING_SCRIPT } from '@/lib/utils/plannerStorage';
import { TripPlanner } from '@/sections/TripPlanner/TripPlanner';

export function generateMetadata(): Metadata {
  return pageMetadata(getPlannerCopy(), getSettings());
}

/**
 * The Trip Planner (PRD #71): a private trip in three steps, sent as one WhatsApp message. The
 * header and footer stay server-rendered; the planner is one client tree, built showing step 1.
 * It has no photo of its own, so it shares the Homepage's image.
 */
export default function PlanPage() {
  const { copy, settings, sharePhoto, destinations, barWords, config } = getPlannerPage();
  return (
    <PageMain>
      <ShareImageMeta photo={sharePhoto} siteUrl={settings.site.url} />
      <CanonicalMeta path={routes.plan} siteUrl={settings.site.url} />
      {/* Before the planner is painted: saved answers or a ?dest= link keep it hidden until applied. */}
      <script dangerouslySetInnerHTML={{ __html: PLANNER_PENDING_SCRIPT }} />
      <PlannerProvider {...config}>
        <TripPlanner copy={copy} destinations={destinations} barWords={barWords} />
      </PlannerProvider>
    </PageMain>
  );
}
