/**
 * Real keyboard and pointer input for story `play` functions (ADR-0012).
 *
 * Testing Library's userEvent sends synthetic events, which can't trigger the browser's own
 * behaviour for <summary>, <dialog> and popover (Enter/Space toggles, Escape, light dismiss).
 * Under `pnpm test` this returns Vitest's browser userEvent, which drives Chromium for real.
 * In the Storybook UI there's no driver, so it returns null and the story skips those steps.
 */
export function realUser() {
  return import('vitest/browser').then((m) => m.userEvent).catch(() => null);
}
