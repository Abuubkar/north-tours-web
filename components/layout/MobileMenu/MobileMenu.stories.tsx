import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { markedLinks, onPath } from '../../../.storybook/markedLinks';
import { realUser } from '../../../.storybook/realUser';
import { roomBelow, scrollThrough } from '../../../.storybook/scrollRoom';
import { MobileMenu } from './MobileMenu';

const WHATSAPP = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  args: { whatsappHref: WHATSAPP },
  parameters: onPath('/tours'),
  globals: { viewport: { value: 'phone' } },
} satisfies Meta<typeof MobileMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;

async function openMenu(canvas: Canvas, userEvent: { click: (element: Element) => Promise<void> }) {
  await userEvent.click(canvas.getByRole('button', { name: 'Menu' }));
  return canvas.getByRole('dialog', { name: 'Menu' });
}

/** The menu button opens a modal side drawer named "Menu", full height and full width at 390. */
export const Opens: Story = {
  play: async ({ canvas, userEvent }) => {
    const dialog = await openMenu(canvas, userEvent);
    await expect(dialog.matches(':modal')).toBe(true);
    await waitFor(() => {
      const { left, right, top, bottom } = dialog.getBoundingClientRect();
      expect([left, right, top, bottom]).toEqual([0, window.innerWidth, 0, window.innerHeight]);
    });
  },
};

export const OpensOnLight: Story = { ...Opens, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The six pages, the current page's in gold, then "Plan on WhatsApp". */
export const Contents: Story = {
  play: async ({ canvas, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    const links = within(menu.getByRole('navigation', { name: 'Main' })).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/'],
      ['Tours', '/tours'],
      ['Destinations', '/destinations'],
      ['Private trips', '/plan'],
      ['About', '/about'],
      ['Contact', '/contact'],
    ]);
    await expect(links.filter((link) => link.getAttribute('aria-current') === 'page')).toEqual([links[1]]);
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(menu.getByRole('link', { name: 'Plan on WhatsApp' })).toHaveAttribute('href', WHATSAPP);
  },
};

export const ContentsOnLight: Story = { ...Contents, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Escape closes it and focus returns to the menu button (real key press). */
export const Escape: Story = {
  play: async ({ canvas, userEvent }) => {
    await openMenu(canvas, userEvent);
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Menu' })).toHaveFocus();
  },
};

/** The close button closes it and focus returns to the menu button. */
export const CloseButton: Story = {
  play: async ({ canvas, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    await userEvent.click(menu.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(canvas.getByRole('button', { name: 'Menu' })).toHaveFocus();
  },
};

/** Tapping a link closes the menu. */
export const LinkCloses: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    // Leaving the page would end the test run, so the navigation itself is cancelled.
    canvasElement.addEventListener('click', (event) => event.preventDefault(), { once: true });
    await userEvent.click(menu.getByRole('link', { name: 'Contact' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
  },
};

/** From 960px the menu button is hidden; the header shows the full nav instead. */
export const HiddenOnDesktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
  },
};

/** At 960px, the header breakpoint, the button is already hidden. */
export const HiddenAtHeaderBreakpoint: Story = { ...HiddenOnDesktop, globals: { viewport: { value: 'headerBreakpoint' } } };

/** Below 960px (here 820, a tablet held upright) the menu button shows, since the six pages don't fit in the header. */
export const ShownBelowHeaderBreakpoint: Story = {
  globals: { viewport: { value: 'breakpoint820' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Menu' })).toBeVisible();
  },
};

/** On the Contact page, Contact is the current item. */
export const OnContactPage: Story = {
  parameters: onPath('/contact'),
  play: async ({ canvas, userEvent }) => {
    const menu = within(await openMenu(canvas, userEvent));
    await expect(markedLinks(menu.getByRole('navigation', { name: 'Main' }))).toEqual(['Contact (page)']);
  },
};

/** On the Homepage at 390, the menu marks Home, wherever the page is scrolled. */
export const OnHomepage: Story = {
  parameters: onPath('/'),
  decorators: [roomBelow],
  play: async ({ canvas }) => {
    await scrollThrough(async () => {
      // A DOM click, so the page isn't scrolled back up to the menu button first.
      canvas.getByRole('button', { name: 'Menu' }).click();
      const menu = within(await canvas.findByRole('dialog', { name: 'Menu' }));
      await expect(markedLinks(menu.getByRole('navigation', { name: 'Main' }))).toEqual(['Home (page)']);
      menu.getByRole('button', { name: 'Close' }).click();
      await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    }, 2);
  },
};

export const OnHomepageOnLight: Story = { ...OnHomepage, globals: { surface: 'light', viewport: { value: 'phone' } } };
