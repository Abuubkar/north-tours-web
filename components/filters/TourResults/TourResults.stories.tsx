import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { placeholderSettings } from '../../layout/sampleSettings';
import { tourWith } from '../../tour-card/sampleTours';
import { sampleListTours, sampleSoonestOrder, sampleToursCopy } from '../sampleFilters';
import { TourResults } from './TourResults';

/*
 * `builtOn` is a fixed day in the past and the browser's real today is later, so the re-check
 * after hydration drops any 2020 date, as on a stale build.
 */
const meta = {
  title: 'Filters/TourResults',
  component: TourResults,
  args: { tours: sampleListTours, builtOn: '2020-01-01', copy: sampleToursCopy, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TourResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const titles = (canvas: ReturnType<typeof within>) => canvas.getAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

/** "8 trips" is the <h2>, above every card's <h3>; the soonest departure first, sold-out dates passed over. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: '8 trips' });
    for (const card of canvas.getAllByRole('heading', { level: 3 })) {
      await expect(heading.compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    }
    await expect(canvas.getByText('Sorted by soonest departure · sold-out trips last')).toBeVisible();
    await expect(titles(canvas)).toEqual(sampleSoonestOrder);
    await expect(gridColumns([...canvasElement.querySelectorAll('li')])).toBe(3);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** 390: one column; the heading is read out but not shown. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: '8 trips' })).toBeInTheDocument();
    await expect(titles(canvas)).toEqual(sampleSoonestOrder);
    await expect(gridColumns([...canvasElement.querySelectorAll('li')])).toBe(1);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * A stale build: in the browser a departure that has passed is dropped. "Moved on" shows its
 * next date instead, and "Left already", with none left, moves to the end with no dates.
 */
export const StaleBuild: Story = {
  args: {
    tours: [
      tourWith('Left already', [['2020-06-01', 5]]),
      tourWith('Moved on', [['2020-06-02', 5], ['2099-05-15', 5]]),
      ...sampleListTours,
    ],
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(titles(canvas).at(-1)).toBe('Left already'));
    await expect(titles(canvas)).toEqual([
      'Hunza & Skardu Grand',
      'Moved on',
      ...sampleSoonestOrder.slice(1),
      'Left already',
    ]);
    await expect(canvas.getByRole('heading', { level: 2, name: '10 trips' })).toBeVisible();
    const cards = canvas.getAllByRole('article');
    await expect(within(cards[1]).getByText('15–15 May · 1 day')).toBeVisible();
    await expect(within(cards.at(-1)!).getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
  },
};
