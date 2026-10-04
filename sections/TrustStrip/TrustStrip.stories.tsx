import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
import { TrustStrip } from './TrustStrip';

const meta = {
  title: 'Sections/TrustStrip',
  component: TrustStrip,
  args: { settings: placeholderSettings, year: 2026 },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TrustStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Four facts; the licence placeholder shows as written, and payments read "Cash · Bank transfer". */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No. [DTS licence number]')).toBeVisible();
    // Operating since 2014, built in 2026.
    await expect(canvas.getByText('12 years')).toBeVisible();
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

/** At 390 two columns, and the first column's text lines up with the page margin (the bleed holds). */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    const strip = context.canvasElement.querySelector('section')!;
    const margin = parseFloat(getComputedStyle(strip).paddingLeft) + strip.getBoundingClientRect().left;
    const [first, second] = context.canvas.getAllByRole('term').map((t) => t.getBoundingClientRect());
    await expect(Math.round(first.left)).toBe(Math.round(margin));
    await expect(Math.round(second.top)).toBe(Math.round(first.top));
  },
};

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With the real licence number. */
export const RealLicence: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No. 1234')).toBeVisible();
  },
};
