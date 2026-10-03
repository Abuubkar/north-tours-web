import type { Settings } from '../content/settings.ts';

/** "Cash · Bank transfer": every "We accept" line reads from settings (ADR-0008). */
export function paymentMethodsLabel(settings: Pick<Settings, 'payments'>): string {
  return settings.payments.methods.join(' · ');
}

/** The methods in a sentence: "cash or bank transfer" (How booking works, step 3). */
export function paymentMethodsText(settings: Pick<Settings, 'payments'>): string {
  const methods = settings.payments.methods.map((m) => m.charAt(0).toLowerCase() + m.slice(1));
  return methods.length === 1 ? methods[0] : `${methods.slice(0, -1).join(', ')} or ${methods[methods.length - 1]}`;
}
