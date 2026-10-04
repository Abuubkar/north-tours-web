import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { gridColumns } from '../../../.storybook/gridColumns';
import { realUser } from '../../../.storybook/realUser';
import { atQuery } from '../../../.storybook/storyUrl';
import { placeholderSettings } from '../../layout/sampleSettings';
import { tourWith } from '../../tour-card/sampleTours';
import { sampleListTours, sampleSoonestOrder, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { TourResults } from './TourResults';

const meta = {
  title: 'Filters/TourResults',
  component: TourResults,
  args: { copy: sampleToursCopy, settings: placeholderSettings },
  decorators: [withTourFilters()],
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof TourResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const titles = (canvas: ReturnType<typeof within>) =>
  canvas.queryAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

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
  decorators: [
    withTourFilters([tourWith('Left already', [['2020-06-01', 5]]), tourWith('Moved on', [['2020-06-02', 5], ['2099-05-15', 5]]), ...sampleListTours]),
  ],
  play: async ({ canvas }) => {
    await waitFor(() => expect(titles(canvas).at(-1)).toBe('Left already'));
    await expect(titles(canvas)).toEqual(['Hunza & Skardu Grand', 'Moved on', ...sampleSoonestOrder.slice(1), 'Left already']);
    await expect(canvas.getByRole('heading', { level: 2, name: '10 trips' })).toBeVisible();
    const cards = canvas.getAllByRole('article');
    await expect(within(cards[1]).getByText('15–15 May · 1 day')).toBeVisible();
    await expect(within(cards.at(-1)!).getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
  },
};

/** A shared link, /tours?dest=hunza&type=family: the two Hunza trips for families. */
export const LinkedView: Story = {
  beforeEach: atQuery('?dest=hunza&type=family'),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: '2 trips' })).toBeVisible();
    await expect(titles(canvas)).toEqual(['Hunza & Skardu Grand', 'Hunza Express']);
    await expect(window.location.search).toBe('?dest=hunza&type=family');
  },
};

export const LinkedViewPhone: Story = { ...LinkedView, globals: { viewport: { value: 'phone' } } };

/** Fairy Meadows with every date full, for the sorts: sold out goes last whatever the order. */
const withFullFairyMeadows = withTourFilters(
  sampleListTours.map((tour) =>
    tour.title === 'Fairy Meadows Trek' ? { ...tour, departures: tour.departures.map((d) => ({ ...d, seatsLeft: 0 })) } : tour,
  ),
);

/** ?sort=price-asc: cheapest first, the sold-out trip last, and the line says so. */
export const SortedByPrice: Story = {
  decorators: [withFullFairyMeadows],
  beforeEach: atQuery('?sort=price-asc'),
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Sorted by price: low to high · sold-out trips last')).toBeVisible();
    await expect(titles(canvas)).toEqual([
      'Murree & Galiyat Weekend',
      'Naran-Kaghan Getaway',
      'Swat & Kalam Summer',
      'Swat Family Escape',
      'Hunza Express',
      'Skardu & Deosai',
      'Hunza & Skardu Grand',
      'Fairy Meadows Trek',
    ]);
  },
};

/** A messy link is rewritten to its clean form in place: no new history entry, so Back still leaves. */
export const MessyLink: Story = {
  beforeEach: atQuery('?dest=nowhere&sort=soonest&utm=x'),
  play: async ({ canvas }) => {
    const length = window.history.length;
    await waitFor(() => expect(window.location.search).toBe(''));
    await expect(window.history.length).toBe(length);
    await expect(canvas.getByRole('heading', { level: 2, name: '8 trips' })).toBeVisible();
  },
};

/**
 * ?dest=murree&dur=8plus matches nothing: the empty state. "Clear all filters" (a real key press)
 * shows every trip in the same sort, moves focus to the results heading and announces the count;
 * "Plan a private trip" goes to the planner.
 */
export const Empty: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus&sort=price-desc'),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
    await expect(canvas.queryAllByRole('article')).toHaveLength(0);
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan');
    await expect(canvas.getByRole('status')).toHaveTextContent('');

    canvas.getByRole('button', { name: 'Clear all filters' }).focus();
    const user = await realUser();
    if (!user) return;
    await user.keyboard('{Enter}');
    const heading = await canvas.findByRole('heading', { level: 2, name: '8 trips' });
    await expect(heading).toHaveFocus();
    await expect(titles(canvas)[0]).toBe('Hunza & Skardu Grand');
    await expect(canvas.getByRole('status')).toHaveTextContent('8 trips');
    await expect(window.location.search).toBe('?sort=price-desc');
  },
};

/** The empty state on its own, for the light surface and the phone. */
const EmptyLinked: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
  },
};

export const EmptyOnLight: Story = { ...EmptyLinked, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const EmptyPhone: Story = { ...EmptyLinked, globals: { viewport: { value: 'phone' } } };
