import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { OnTripPanel } from './OnTripPanel';

const meta = {
  title: 'Contact/OnTripPanel',
  component: OnTripPanel,
  args: {
    heading: 'On a trip right now?',
    line: 'Call your guide, or our travel support line.',
    number: '[24/7 number]',
    callLabel: 'Call travel support',
    callHref: undefined,
  },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof OnTripPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With the placeholder: a light section named by its <h2>, the number as written, and no "Call travel support". */
export const Placeholder: Story = {
  play: async ({ canvas }) => {
    const panel = canvas.getByRole('region', { name: 'On a trip right now?' });
    await expect(panel).toHaveAttribute('id', 'on-trip');
    await expect(panel).toHaveAttribute('data-surface', 'light');
    await expect(canvas.getByRole('heading', { level: 2, name: 'On a trip right now?' })).toBeVisible();
    await expect(canvas.getByText('[24/7 number]')).toBeVisible();
    await expect(canvas.queryByRole('link', { name: 'Call travel support' })).toBeNull();
  },
};

export const PlaceholderOnLight: Story = { ...Placeholder, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const PlaceholderPhone: Story = { ...Placeholder, globals: { viewport: { value: 'phone' } } };

/** With a real number: "Call travel support" is a 56px tel: link. */
export const RealNumber: Story = {
  args: { number: '+92 321 7654321', callHref: 'tel:+923217654321' },
  play: async ({ canvas }) => {
    const call = canvas.getByRole('link', { name: 'Call travel support' });
    await expect(call).toHaveAttribute('href', 'tel:+923217654321');
    await expect(call.getBoundingClientRect().height).toBe(56);
  },
};

export const RealNumberOnLight: Story = { ...RealNumber, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RealNumberPhone: Story = { ...RealNumber, globals: { viewport: { value: 'phone' } } };
