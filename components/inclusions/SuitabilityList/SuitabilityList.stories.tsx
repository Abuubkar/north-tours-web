import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleTour } from '../../tour-card/sampleTours';
import { sampleTourCopy } from '../../tour/sampleTourCopy';
import { SuitabilityList } from './SuitabilityList';

const meta = {
  title: 'Inclusions/SuitabilityList',
  component: SuitabilityList,
  args: {
    suited: { heading: sampleTourCopy.overview.suitedTo, lines: sampleTour.overview.suitedTo },
    notSuited: { heading: sampleTourCopy.overview.notSuitedTo, lines: sampleTour.overview.notSuitedTo },
  },
} satisfies Meta<typeof SuitabilityList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two headings, each over a real list; the + and – are decorative. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const headings = canvas.getAllByRole('heading', { level: 3 });
    await expect(headings.map((h) => h.textContent)).toEqual(['Who this trip is for', 'Who it may not suit']);
    const lists = canvas.getAllByRole('list');
    await expect(lists).toHaveLength(2);
    await expect(within(lists[0]).getAllByRole('listitem').map((li) => li.textContent)).toEqual(sampleTour.overview.suitedTo.map((line) => `+${line}`));
    await expect(within(lists[1]).getAllByRole('listitem').map((li) => li.textContent)).toEqual(sampleTour.overview.notSuitedTo.map((line) => `–${line}`));
    await expect(canvas.getAllByText('+')[0]).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.getAllByText('–')[0]).toHaveAttribute('aria-hidden', 'true');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };
