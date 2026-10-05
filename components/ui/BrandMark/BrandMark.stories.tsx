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
 * Links home and is at least the 44px tap target. The name is heavy (800) and tight (−.05em), then a
 * gold ▲ that screen readers skip, so the link is named by the brand alone. 24px on phones, 30px
 * from the full-bar breakpoint (1200px).
 */
export const Default: Story = {
  play: async ({ canvas }) => {
    const link = canvas.getByRole('link', { name: '[BRAND NAME]' });
    await expect(link).toHaveAttribute('href', '/');
    await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    const { fontWeight, fontSize, letterSpacing } = getComputedStyle(link);
    await expect(fontWeight).toBe('800');
    await expect(fontSize).toBe(window.innerWidth >= 1200 ? '30px' : '24px');
    await expect(parseFloat(letterSpacing) / parseFloat(fontSize)).toBeCloseTo(-0.05, 3);
    const mark = canvas.getByText('▲');
    await expect(mark).toHaveAttribute('aria-hidden', 'true');
    await expect(mark.parentElement).toBe(link);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };

export const DesktopOnLight: Story = { ...Default, globals: { surface: 'light', viewport: { value: 'desktop' } } };
