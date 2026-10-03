import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { placeholderSettings, realSettings } from '../sampleSettings';
import { SiteHeader } from './SiteHeader';

const NAV = ['Tours', 'How it works', 'Destinations', 'Guides', 'Reviews'];
const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const onPath = (pathname: string) => ({ nextjs: { appDirectory: true, navigation: { pathname } } });

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  args: { settings: placeholderSettings },
  parameters: onPath('/help'),
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** From 820px: brand, the five nav links and "WhatsApp us"; the icon button is hidden. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-surface', 'dark');
    await expect(canvas.getByRole('link', { name: '[BRAND NAME]' })).toHaveAttribute('href', '/');
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => link.textContent)).toEqual(NAV);
    for (const link of links) await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    await expect(canvas.getByRole('link', { name: 'WhatsApp us' })).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Chat on WhatsApp' })).toBeNull();
  },
};

/** On a light page the header stays dark. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light' } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390 the nav and "WhatsApp us" give way to a 44px "Chat on WhatsApp" icon button. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation', { name: 'Main' })).toBeNull();
    await expect(canvas.queryByRole('link', { name: 'WhatsApp us' })).toBeNull();
    const whatsapp = canvas.getByRole('link', { name: 'Chat on WhatsApp' });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** On a tour page, Tours is the current item, and no other. */
export const OnTourPage: Story = {
  parameters: onPath('/tours/hunza-skardu-grand'),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    const current = within(nav)
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    await expect(current.map((link) => link.textContent)).toEqual(['Tours']);
  },
};

/** On a page outside the nav, no item is current. */
export const NoCurrentItem: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Main' });
    for (const link of within(nav).getAllByRole('link')) await expect(link).not.toHaveAttribute('aria-current');
  },
};

/** While the number is a placeholder, WhatsApp opens with the message and no number. */
export const PlaceholderWhatsApp: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'WhatsApp us' })).toHaveAttribute(
      'href',
      `https://wa.me/?${MESSAGE}`,
    );
  },
};

/** With a real number, both WhatsApp links carry its digits and the general message. */
export const RealWhatsApp: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'WhatsApp us' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?${MESSAGE}`,
    );
  },
};

export const RealWhatsAppPhone: Story = {
  args: { settings: realSettings },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?${MESSAGE}`,
    );
  },
};

export const PlaceholderWhatsAppPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/?${MESSAGE}`,
    );
  },
};

/** Keyboard focus shows the 2px ring on the nav links (real key presses). */
export const FocusRing: Story = {
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Tab}{Tab}');
    const tours = canvas.getByRole('link', { name: 'Tours' });
    await expect(tours).toHaveFocus();
    const { outlineStyle, outlineWidth } = getComputedStyle(tours);
    await expect([outlineStyle, outlineWidth]).toEqual(['solid', '2px']);
  },
};
