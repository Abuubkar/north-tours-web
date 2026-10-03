import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
import { TrustStrip } from './TrustStrip';

const meta = {
  title: 'Sections/TrustStrip',
  component: TrustStrip,
  args: { settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TrustStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const years = new Date().getFullYear() - 2014;

/** Four facts; the licence placeholder shows as written, and payments read "Cash · Bank transfer". */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No. [DTS licence number]')).toBeVisible();
    await expect(canvas.getByText(`${years} years`)).toBeVisible();
    await expect(canvas.getByText('1,200+')).toBeVisible();
    await expect(canvas.getByText('Cash · Bank transfer')).toBeVisible();
    await expect(canvas.getAllByRole('term').map((t) => t.textContent)).toEqual([
      'DTS licence',
      'Operating',
      'Trips completed',
      'We accept',
    ]);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With the real licence number. */
export const RealLicence: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No. 1234')).toBeVisible();
  },
};
