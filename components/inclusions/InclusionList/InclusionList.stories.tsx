import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleTour } from '../../tour-card/sampleTours';
import { sampleTourCopy } from '../../tour/sampleTourCopy';
import { InclusionList } from './InclusionList';

const meta = {
  title: 'Inclusions/InclusionList',
  component: InclusionList,
  args: {
    included: { heading: sampleTourCopy.included.included, rows: sampleTour.included },
    notIncluded: { heading: sampleTourCopy.included.notIncluded, rows: sampleTour.notIncluded },
  },
  globals: { surface: 'light' },
} satisfies Meta<typeof InclusionList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** "Included" and "Not included" are headings over lists; each row's icon is hidden from screen readers. */
export const Desktop: Story = {
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual(['Included', 'Not included']);
    const [included, notIncluded] = canvas.getAllByRole('list');
    await expect(within(included).getAllByRole('listitem')).toHaveLength(sampleTour.included.length);
    await expect(within(notIncluded).getAllByRole('listitem')[0]).toHaveTextContent('LunchWe stop at good places; you pay as you go');
    for (const icon of canvasElement.querySelectorAll('svg')) await expect(icon).toHaveAttribute('aria-hidden', 'true');
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
