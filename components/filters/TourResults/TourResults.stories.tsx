import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { opacityUpTo } from '../../../.storybook/opacity';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { gridColumns } from '../../../.storybook/gridColumns';
import { realUser } from '../../../.storybook/realUser';
import { atQuery } from '../../../.storybook/storyUrl';
import { placeholderSettings } from '../../layout/sampleSettings';
import { tourWith } from '../../tour-card/sampleTours';
import { samplePhoto } from '../../ui/MediaFrame/samplePhotos';
import { sampleListTours, sampleOptionLabels, sampleSoonestOrder, sampleToursCopy, withTourFilters } from '../sampleFilters';
import { PrivateTripBanner } from '../../../sections/PrivateTripBanner/PrivateTripBanner';
import { TourResults } from './TourResults';

const meta = {
  title: 'Filters/TourResults',
  component: TourResults,
  args: {
    copy: sampleToursCopy,
    labels: sampleOptionLabels,
    settings: placeholderSettings,
    banner: <PrivateTripBanner copy={sampleToursCopy.banner} whatsappHref="https://wa.me/?text=Hi" />,
  },
  decorators: [withTourFilters()],
  // Each story starts at plain /tours (a story's own query follows), and the URL is put back after.
  beforeEach: atQuery(''),
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

/** The banner's place: the number of cards before it in the page. */
const cardsBeforeBanner = (canvas: ReturnType<typeof within>) => {
  const banner = canvas.getByRole('heading', { level: 2, name: sampleToursCopy.banner.headline });
  return canvas.getAllByRole('article').filter((card: HTMLElement) => card.compareDocumentPosition(banner) & Node.DOCUMENT_POSITION_FOLLOWING).length;
};

/** From 1100px the private trip banner follows the first row of three. */
export const BannerAfterFirstRow: Story = {
  play: async ({ canvas }) => {
    await expect(cardsBeforeBanner(canvas)).toBe(3);
  },
};

export const BannerAfterFirstRowLaptop: Story = { ...BannerAfterFirstRow, globals: { viewport: { value: 'laptop' } } };

/** Below 1100px it follows the second card: one row of two on tablets, two cards on phones. */
export const BannerAfterTwo: Story = {
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvas }) => {
    await waitFor(() => expect(cardsBeforeBanner(canvas)).toBe(2));
  },
};

export const BannerAfterTwoPhone: Story = { ...BannerAfterTwo, globals: { viewport: { value: 'phone' } } };

/** With no results there's no banner. */
export const NoBannerWhenEmpty: Story = {
  beforeEach: atQuery('?dest=murree&dur=8plus'),
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('heading', { name: sampleToursCopy.banner.headline })).toBeNull();
  },
};

/**
 * M4 on first load: a card below the fold waits 40px lower with only its photo hidden, then rises
 * into place when it comes into view. Its dates, price, seats and buttons are never faded.
 */
export const RisesOnFirstLoad: Story = {
  globals: { viewport: { value: 'phone' } },
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const card = canvas.getAllByRole('listitem').at(-1)!;
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'below'));
    await expect(getComputedStyle(card).transform).toBe('matrix(1, 0, 0, 1, 0, 40)');
    await expect(opacityUpTo(within(card).getByRole('img', { name: samplePhoto.alt }), card)).toBe(0);
    for (const essential of [
      within(card).getByText(/^\d+–\d+ \w+ · /),
      within(card).getByText(/^PKR /),
      within(card).getByText(/ of \d+ seats left$/),
      within(card).getByRole('link', { name: /^View Trip/ }),
    ]) {
      await expect(opacityUpTo(essential, card)).toBe(1);
    }
    card.scrollIntoView({ block: 'center' });
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'in'));
    await waitFor(() => expect(getComputedStyle(card).transform).toBe('none'), { timeout: 3000 });
    window.scrollTo({ top: 0, behavior: 'instant' });
  },
};

/** Changing the view (here, removing a chip) never offsets a card, not even one still waiting below. */
export const ChangeNeverOffsets: Story = {
  globals: { viewport: { value: 'phone' } },
  beforeEach: [emulateFullMotion, atQuery('?type=family')],
  play: async ({ canvas, canvasElement, userEvent }) => {
    await waitFor(() => expect(canvasElement.querySelector('[data-rise="below"]')).not.toBeNull());
    await userEvent.click(canvas.getByRole('button', { name: 'Remove filter Family' }));
    await expect(titles(canvas)).toHaveLength(8);
    await expect(canvasElement.querySelector('[data-rise="below"]')).toBeNull();
    for (const card of canvas.getAllByRole('listitem')) await expect(getComputedStyle(card).transform).toBe('none');
  },
};

/** With reduced motion no card is ever offset. */
export const ReducedMotion: Story = {
  globals: { viewport: { value: 'phone' } },
  beforeEach: emulateReducedMotion,
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(canvasElement.querySelector('[data-rise]')).toBeNull();
  },
};
