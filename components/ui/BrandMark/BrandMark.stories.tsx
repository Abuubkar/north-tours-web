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

/**
 * Links home and is at least the 44px tap target. The name is 700 in tracked capitals (.2em), with a
 * dot in the accent (gold on dark, deep gold on light) between its words that screen readers skip. 14px on phones, 17px from the full-bar
 * breakpoint (1200px).
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: '[BRAND NAME]' });
    await expect(link).toHaveAttribute('href', '/');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    const { fontWeight, fontSize, letterSpacing, textTransform } = getComputedStyle(link);
    await expect(fontWeight).toBe('700');
    await expect(fontSize).toBe(window.innerWidth >= 1200 ? '17px' : '14px');
    await expect(parseFloat(letterSpacing) / parseFloat(fontSize)).toBeCloseTo(0.2, 3);
    await expect(textTransform).toBe('uppercase');
    const dot = canvas.getByText('·');
    await expect(dot).toHaveAttribute('aria-hidden', 'true');
    await expect(getComputedStyle(dot).color).not.toBe(getComputedStyle(link).color);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

export const DesktopOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'desktop' } } };
