/**
 * Sets `prefers-reduced-motion` for a story (ADR-0012). Under `pnpm test` it asks Chromium
 * through the DevTools protocol; in the Storybook UI there's no driver, so it does nothing and the
 * story follows the OS setting. The setting applies to the whole test page, so every story that
 * depends on it sets it in its `beforeEach` (story files run one at a time).
 */
async function emulate(value: 'reduce' | 'no-preference') {
  const browser = await import('vitest/browser').catch(() => null);
  await browser?.cdp().send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value }] });
}

export const emulateReducedMotion = () => emulate('reduce');

export const emulateFullMotion = () => emulate('no-preference');
