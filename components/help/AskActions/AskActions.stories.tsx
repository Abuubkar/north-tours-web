import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { AskActions } from './AskActions';

const askHref = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Help/AskActions',
  component: AskActions,
  args: { askLabel: 'Ask on WhatsApp', askHref, callLabel: 'Call us', callHref: undefined },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof AskActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With the placeholder phone: only "Ask on WhatsApp", 56px, with the general message. */
export const PlaceholderPhone: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Ask on WhatsApp' })).toHaveAttribute('href', askHref);
    await expect(canvas.queryByRole('link', { name: 'Call us' })).toBeNull();
  },
};

export const PlaceholderPhoneOnLight: Story = { ...PlaceholderPhone, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** With a real phone: "Call us" calls it; at 390 the pair wraps to full width. */
export const RealPhone: Story = {
  args: { callHref: 'tel:+924235781234' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Call us' })).toHaveAttribute('href', 'tel:+924235781234');
  },
};

export const RealPhoneOnLight: Story = { ...RealPhone, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RealPhonePhone: Story = { ...RealPhone, globals: { viewport: { value: 'phone' } } };
