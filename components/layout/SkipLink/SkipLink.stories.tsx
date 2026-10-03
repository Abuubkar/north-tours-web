import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { SkipLink } from './SkipLink';

/** The skip link, a header link to skip past, and the page's main content. */
function Page() {
  return (
    <>
      <SkipLink />
      <a href="/tours">Tours</a>
      <main id="main" tabIndex={-1}>
        <h1>Main content</h1>
      </main>
    </>
  );
}

const meta = { title: 'Layout/SkipLink', component: SkipLink, render: () => <Page /> } satisfies Meta<
  typeof SkipLink
>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hidden until focused. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Skip to content' });
    await expect(link.getBoundingClientRect().bottom).toBeLessThanOrEqual(0);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** First in tab order, shown when focused, and Enter moves focus to <main> (real key presses). */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: 'Skip to content' });
    await expect(link).toHaveAttribute('href', '#main');

    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Tab}');
    await expect(link).toHaveFocus();
    // Fully in view at the top-left once focused.
    await waitFor(() => {
      const { top, left, bottom, right } = link.getBoundingClientRect();
      expect(Math.min(top, left)).toBeGreaterThanOrEqual(0);
      expect(bottom).toBeLessThanOrEqual(window.innerHeight / 2);
      expect(right).toBeLessThanOrEqual(window.innerWidth / 2);
    });

    // A link navigation ends the Vitest browser session, so the click is replayed as the same
    // fragment navigation through location.hash. The browser then moves focus as it would.
    link.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        location.hash = link.getAttribute('href')!;
      },
      { once: true },
    );
    await keys.keyboard('{Enter}');
    await waitFor(() => expect(canvas.getByRole('main')).toHaveFocus());
    history.replaceState(null, '', location.pathname + location.search);
  },
};
