import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings } from '../sampleSettings';
import { SiteHeader } from './SiteHeader';

const meta = {
  title: 'Layout/SiteHeader',
  component: SiteHeader,
  args: { settings: placeholderSettings },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Brand links home; the header is a banner landmark and stays dark. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('banner')).toHaveAttribute('data-surface', 'dark');
    await expect(canvas.getByRole('link', { name: '[BRAND NAME]' })).toHaveAttribute('href', '/');
  },
};

/** On a light page the header stays dark. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light' } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
