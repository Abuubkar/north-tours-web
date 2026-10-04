import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleOnTrip } from '../sampleOnTrip';
import { OnTripPanel } from './OnTripPanel';

const meta = {
  title: 'Contact/OnTripPanel',
  component: OnTripPanel,
  args: sampleOnTrip,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof OnTripPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * With the placeholder: a raised dark panel (8px, hairline border) named by its <h2>, the line,
 * your guide and the support line as two rows, the number as written and no "Call travel
 * support"; beside them the road north, hidden from screen readers and with no legend.
 */
export const Placeholder: Story = {
  play: async ({ canvas, canvasElement }) => {
    const panel = canvas.getByRole('region', { name: 'On a trip right now?' });
    await expect(panel).toHaveAttribute('id', 'on-trip');
    await expect(panel).not.toHaveAttribute('data-surface');
    const box = getComputedStyle(panel);
    await expect([box.borderRadius, box.borderTopWidth]).toEqual(['8px', '1px']);
    await expect(canvas.getByRole('heading', { level: 2, name: 'On a trip right now?' })).toBeVisible();
    await expect(canvas.getByText('Call your guide, or our travel support line.')).toBeVisible();
    const rows = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(rows.map((row) => row.textContent)).toEqual(['Your guideNumber in your trip confirmation', 'Travel support · 24/7[24/7 number]']);
    await expect(canvas.queryByRole('link', { name: 'Call travel support' })).toBeNull();
    // The map: drawn, decorative, no legend; nothing in it is read out.
    const figure = canvasElement.querySelector('figure')!;
    await expect(figure).toBeVisible();
    await expect(figure).toHaveAttribute('aria-hidden', 'true');
    await expect(figure.querySelector('figcaption')).toBeNull();
    // From 1100px the map sits beside the words.
    const words = canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    await expect(figure.getBoundingClientRect().left).toBeGreaterThan(words.right);
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const PlaceholderLaptop: Story = { ...Placeholder, globals: { viewport: { value: 'laptop' } } };

/** 900 (from 820px, below about 960px): the map wraps under the words, centred, still whole. */
export const PlaceholderTablet: Story = {
  globals: { viewport: { value: 'tablet' } },
  play: async ({ canvas, canvasElement }) => {
    const figure = canvasElement.querySelector('figure')!;
    await expect(figure).toBeVisible();
    const words = canvas.getByRole('list').getBoundingClientRect();
    await expect(figure.getBoundingClientRect().top).toBeGreaterThan(words.bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

/** At 390 the map is left out (it would be a tall drawing under the words); nothing scrolls sideways. */
export const PlaceholderPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'On a trip right now?' })).toBeVisible();
    await expect(canvasElement.querySelector('figure')).not.toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PlaceholderPhoneOnLight: Story = { ...PlaceholderPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With a real number: "Call travel support", a 48px tel: link in the support row. */
export const RealNumber: Story = {
  args: { support: { value: '+92 321 7654321', href: 'tel:+923217654321' } },
  play: async ({ canvas }) => {
    const call = canvas.getByRole('link', { name: 'Call travel support' });
    await expect(call).toHaveAttribute('href', 'tel:+923217654321');
    await expect(call.getBoundingClientRect().height).toBe(48);
    await expect(call.closest('li')).toHaveTextContent('+92 321 7654321');
  },
};

export const RealNumberOnLight: Story = { ...RealNumber, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RealNumberPhone: Story = { ...RealNumber, globals: { viewport: { value: 'phone' } } };

export const RealNumberPhoneOnLight: Story = { ...RealNumber, globals: { surface: 'light', viewport: { value: 'phone' } } };
