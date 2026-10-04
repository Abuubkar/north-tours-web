import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { markedLinks, onPath } from '../../../.storybook/markedLinks';
import { realUser } from '../../../.storybook/realUser';
import { roomBelow, scrollThrough } from '../../../.storybook/scrollRoom';
import { placeholderSettings, realSettings } from '../sampleSettings';
import { SiteHeader } from './SiteHeader';

const NAV = [
  ['Tours', '/tours'],
  ['Destinations', '/destinations'],
  ['Private trips', '/plan'],
  ['About', '/about'],
  ['Contact', '/contact'],
];
const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

type Canvas = ReturnType<typeof within>;

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  args: { settings: placeholderSettings },
  parameters: { ...onPath('/help'), fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 820px: brand, the five pages (none a section of a page) and "WhatsApp us"; the icon buttons are hidden. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-surface', 'dark');
    await expect(canvas.getByRole('link', { name: '[BRAND NAME]' })).toHaveAttribute('href', '/');
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(NAV);
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(canvas.getByRole('link', { name: 'WhatsApp us' })).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Chat on WhatsApp' })).toBeNull();
    await expect(canvas.queryByRole('button', { name: 'Menu' })).toBeNull();
  },
};

/** On a light page the header stays dark. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light' } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390 the nav and "WhatsApp us" give way to 44px "Chat on WhatsApp" and "Menu" buttons. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation', { name: 'Main' })).toBeNull();
    await expect(canvas.queryByRole('link', { name: 'WhatsApp us' })).toBeNull();
    const whatsapp = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(canvas.getByRole('button', { name: 'Menu' })).toBeVisible();
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** On a tour page, Tours is the current item, and no other. */
export const OnTourPage: Story = {
  parameters: onPath('/tours/hunza-skardu-grand'),
  play: async ({ canvas }) => {
    await expect(markedLinks(canvas.getByRole('navigation', { name: 'Main' }))).toEqual(['Tours (page)']);
  },
};

/** On the Trip Planner, Private trips is the current item. */
export const OnPlanner: Story = {
  parameters: onPath('/plan'),
  play: async ({ canvas }) => {
    await expect(markedLinks(canvas.getByRole('navigation', { name: 'Main' }))).toEqual(['Private trips (page)']);
  },
};

export const OnPlannerOnLight: Story = { ...OnPlanner, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a page outside the nav, no item is current. */
export const NoCurrentItem: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    for (const link of within(nav).getAllByRole('link')) await expect(link).not.toHaveAttribute('aria-current');
  },
};

const whatsappLinks = (canvas: Canvas) => [
  canvas.getByRole('link', { name: 'WhatsApp us', hidden: true }),
  canvas.getByRole('link', { name: 'Chat on WhatsApp', hidden: true }),
];

/** While the number is a placeholder, both WhatsApp links open with the message and no number. */
export const PlaceholderWhatsApp: Story = {
  play: async ({ canvas }) => {
    for (const link of whatsappLinks(canvas)) await expect(link).toHaveAttribute('href', `https://wa.me/?${MESSAGE}`);
  },
};

/** With a real number, both WhatsApp links carry its digits and the general message. */
export const RealWhatsApp: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    for (const link of whatsappLinks(canvas)) {
      await expect(link).toHaveAttribute('href', `https://wa.me/923001234567?${MESSAGE}`);
    }
  },
};

/** Just above the breakpoint, brand, nav and "WhatsApp us" still fit on one row. */
export const NavBreakpoint: Story = {
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvas }) => {
    const header = canvas.getByRole('banner');
    await expect(canvas.getByRole('navigation', { name: 'Main' })).toBeVisible();
    await expect(header.scrollWidth).toBeLessThanOrEqual(header.clientWidth);
    const button = canvas.getByRole('link', { name: 'WhatsApp us' }).getBoundingClientRect();
    await expect(button.right).toBeLessThanOrEqual(header.getBoundingClientRect().right);
  },
};

/** Keyboard focus shows the 2px ring on the nav links and "WhatsApp us" (real key presses). */
export const FocusRing: Story = {
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    const expectRing = async (element: HTMLElement) => {
      await expect(element).toHaveFocus();
      const { outlineStyle, outlineWidth } = getComputedStyle(element);
      await expect([outlineStyle, outlineWidth]).toEqual(['solid', '2px']);
    };
    await keys.keyboard('{Tab}{Tab}');
    await expectRing(canvas.getByRole('link', { name: 'Tours' }));
    await keys.keyboard('{Tab}{Tab}{Tab}{Tab}{Tab}');
    const whatsapp = canvas.getByRole('link', { name: 'WhatsApp us' });
    await expectRing(whatsapp);
    await expect(whatsapp.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

/** At 390 the WhatsApp icon button shows the ring too. */
export const FocusRingPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Tab}{Tab}');
    const whatsapp = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsapp).toHaveFocus();
    await expect(getComputedStyle(whatsapp).outlineStyle).toBe('solid');
  },
};

/** On the Homepage no item is marked, wherever the page is scrolled. */
export const OnHomepage: Story = {
  parameters: { ...onPath('/'), fullBleed: true },
  decorators: [roomBelow],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    await scrollThrough(async () => expect(markedLinks(nav)).toEqual([]));
  },
};

export const OnHomepageOnLight: Story = { ...OnHomepage, globals: { surface: 'light', viewport: { value: 'desktop' } } };
