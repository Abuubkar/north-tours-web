import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
import { sampleHome } from '../sampleHome';
import { HomeHero } from './HomeHero';

/** The general message from settings. */
const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';
const WHATSAPP = `https://wa.me/?${MESSAGE}`;

const meta = {
  title: 'Sections/HomeHero',
  component: HomeHero,
  args: { copy: sampleHome.hero, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The lead and both buttons; "NORTH" is decorative and hidden from screen readers. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('NORTH')).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.queryByRole('paragraph', { name: 'NORTH' })).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Explore Tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByRole('link', { name: 'Plan on WhatsApp' })).toHaveAttribute('href', WHATSAPP);
    // The hero photo is the page's main image: never lazy.
    const photo = canvas.getByRole('img', { name: sampleHome.hero.image.alt });
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    await expect(photo).toHaveAttribute('loading', 'eager');
  },
};

/** The hero always sits on its photo, so it stays dark on a light page. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the buttons wrap to full width under the lead; nothing scrolls sideways. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    const { canvas, canvasElement } = context;
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    for (const name of ['Explore Tours', 'Plan on WhatsApp']) {
      await expect(canvas.getByRole('link', { name }).getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With a real number, "Plan on WhatsApp" carries its digits and the general message. */
export const RealNumber: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Plan on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?${MESSAGE}`,
    );
  },
};
