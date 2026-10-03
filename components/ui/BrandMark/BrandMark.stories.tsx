import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { BrandMark } from './BrandMark';

const meta = {
  title: 'Base/BrandMark',
  component: BrandMark,
  args: { name: '[BRAND NAME]' },
} satisfies Meta<typeof BrandMark>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Links home, named by the brand, and is at least the 44px tap target. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: '[BRAND NAME]' });
    await expect(link).toHaveAttribute('href', '/');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

export const DesktopOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'desktop' } } };
