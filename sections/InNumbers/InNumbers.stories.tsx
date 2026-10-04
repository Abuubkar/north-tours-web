import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { companyStats } from '@/lib/utils/companyStats';
import { sampleAbout } from '../sampleAbout';
import { InNumbers } from './InNumbers';

const { trust } = placeholderSettings;

const meta = {
  title: 'Sections/InNumbers',
  component: InNumbers,
  args: {
    headline: sampleAbout.numbers.headline,
    stats: companyStats({ trust, travellers: sampleAbout.numbers.travellers.value, guideCount: 6, year: 2026, labels: sampleAbout.numbers.labels }),
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof InNumbers>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Four figures: years and trips from the trust settings, travellers from page copy, and the
 * guides counted. The heading is read out, not seen.
 */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'The company in numbers' });
    await expect(heading.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    const items = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(items.map((item) => item.textContent)).toEqual([
      '12years running trips',
      `${trust.tripsCompleted}trips completed`,
      '9,000+travellers',
      '6guides and drivers',
    ]);
    await expect(gridColumns(items)).toBe(4);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390; the first and last figures line up with the page margins. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const items = canvas.getAllByRole('listitem');
    await expect(gridColumns(items)).toBe(2);
    const section = canvasElement.querySelector('section')!;
    const margin = section.getBoundingClientRect().left + parseFloat(getComputedStyle(section).paddingLeft);
    const first = canvas.getByText('12').getBoundingClientRect();
    await expect(Math.round(first.left)).toBe(Math.round(margin));
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
