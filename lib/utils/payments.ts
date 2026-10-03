import type { Settings } from '../content/settings.ts';

/** "Cash · Bank transfer": every "We accept" line reads from settings (ADR-0008). */
export function paymentMethodsLabel(settings: Pick<Settings, 'payments'>): string {
  return settings.payments.methods.join(' · ');
}
