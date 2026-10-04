import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { drawsLines, gridGaps } from '../../../.storybook/gridColumns';
import { opacityUpTo } from '../../../.storybook/opacity';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { roomAbove } from '../../../.storybook/scrollRoom';
import { placeholderSettings } from '../../layout/sampleSettings';
import { tourWith } from '../sampleTours';
import { DestinationTours } from './DestinationTours';

/*
 * `builtOn` is a fixed day in the past; the browser's real today is later, so after hydration the
 * cards drop anything that left in between (2020 here), as on a stale build.
 */
const tour = (title: string, destinations: string[], departures: [string, number][]) => ({ ...tourWith(title, departures), destinations });
const grand = tour('Hunza & Skardu Grand', ['hunza', 'skardu'], [['2099-05-12', 3], ['2099-05-26', 9]]);
const express = tour('Hunza Express', ['hunza'], [['2099-06-02', 12]]);
const murree = tour('Murree & Galiyat Weekend', ['murree'], [['2099-05-29', 14]]);
const soldOut = tour('Hunza Autumn', ['hunza'], [['2099-10-10', 0]]);
const noDates = tour('Hunza Winter', ['hunza'], []);

const seeAll = { title: 'See all Hunza trips', note: 'Opens the Tours page, filtered to Hunza', href: '/tours?dest=hunza' };

const titles = (canvas: ReturnType<typeof within>) => canvas.getAllByRole('heading', { level: 3 }).map((h: HTMLElement) => h.textContent);

const meta = {
  title: 'Tour card/DestinationTours',
  component: DestinationTours,
  args: { tours: [express, grand], builtOn: '2020-01-01', seeAll, settings: placeholderSettings },
  beforeEach: emulateReducedMotion,
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof DestinationTours>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Hunza: both tours as cards (soonest first), then the cell to Tours filtered to Hunza; three across. */
export const Hunza: Story = {
  play: async ({ canvas }) => {
    await expect(titles(canvas)).toEqual(['Hunza & Skardu Grand', 'Hunza Express']);
    const link = canvas.getByRole('link', { name: 'See all Hunza trips' });
    await expect(link).toHaveAttribute('href', '/tours?dest=hunza');
    const cells = canvas.getAllByRole('listitem');
    await expect(cells).toHaveLength(3);
    await expect(cells.at(-1)).toContainElement(link);
    await expect(new Set(cells.map((cell) => Math.round(cell.getBoundingClientRect().top))).size).toBe(1);
    // Cards 24px apart with no lines; the see-all cell is an 8px block with a hairline border.
    await expect(gridGaps(cells).column).toBe(24);
    for (const cell of [canvas.getByRole('list'), ...cells.slice(0, -1)]) await expect(drawsLines(cell)).toBe(false);
    const seeAll = getComputedStyle(cells.at(-1)!);
    await expect([seeAll.borderTopWidth, seeAll.borderRadius]).toEqual(['1px', '8px']);
  },
};

export const HunzaOnLight: Story = { ...Hunza, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across from 820px, so the cell starts a short second row with no grey cell beside it. */
export const HunzaTablet: Story = { ...Hunza, globals: { viewport: { value: 'tablet' } }, play: async ({ canvas }) => {
  const cells = canvas.getAllByRole('listitem');
  await expect(new Set(cells.map((cell) => Math.round(cell.getBoundingClientRect().top))).size).toBe(2);
} };

export const HunzaAt1366: Story = { ...Hunza, globals: { viewport: { value: 'laptop' } } };

/** One column on phones. */
export const HunzaPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const cells = canvas.getAllByRole('listitem');
    await expect(new Set(cells.map((cell) => Math.round(cell.getBoundingClientRect().left))).size).toBe(1);
    await expect(canvas.getByRole('link', { name: 'See all Hunza trips' })).toBeVisible();
  },
};

export const HunzaPhoneOnLight: Story = { ...HunzaPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Murree: one tour and the cell. */
export const Murree: Story = {
  args: { tours: [murree], seeAll: { ...seeAll, title: 'See all Murree trips', href: '/tours?dest=murree' } },
  play: async ({ canvas }) => {
    await expect(titles(canvas)).toEqual(['Murree & Galiyat Weekend']);
    await expect(canvas.getByRole('link', { name: 'See all Murree trips' })).toHaveAttribute('href', '/tours?dest=murree');
  },
};

export const MurreeAt1366: Story = { ...Murree, globals: { viewport: { value: 'laptop' } } };

export const MurreePhone: Story = { ...Murree, globals: { viewport: { value: 'phone' } } };

/** Bookable first, then sold out (with the waitlist), then no upcoming dates. */
export const SoldOutAndNoDates: Story = {
  args: { tours: [noDates, soldOut, express] },
  play: async ({ canvas }) => {
    await expect(titles(canvas)).toEqual(['Hunza Express', 'Hunza Autumn', 'Hunza Winter']);
    await expect(canvas.getByRole('link', { name: 'Join waitlist, Hunza Autumn' })).toBeVisible();
    await expect(canvas.getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
  },
};

export const SoldOutAndNoDatesAt1366: Story = { ...SoldOutAndNoDates, globals: { viewport: { value: 'laptop' } } };

export const SoldOutAndNoDatesOnLight: Story = { ...SoldOutAndNoDates, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const SoldOutAndNoDatesPhone: Story = { ...SoldOutAndNoDates, globals: { viewport: { value: 'phone' } } };

/** With the build's date in the past, a departure that has left since is dropped: the card moves on, or to "No upcoming dates". */
export const StaleBuild: Story = {
  args: {
    tours: [tour('Hunza Express', ['hunza'], [['2020-06-01', 5], ['2099-06-02', 12]]), tour('Hunza Spring', ['hunza'], [['2020-04-01', 9]])],
  },
  play: async ({ canvas }) => {
    await waitFor(() => expect(titles(canvas)).toEqual(['Hunza Express', 'Hunza Spring']));
    await waitFor(() => expect(canvas.getByText(/Jun · /)).toBeVisible());
    await expect(canvas.getByText('No upcoming dates · ask on WhatsApp')).toBeVisible();
  },
};

/** Cards rise (M4): a card below the fold waits 40px lower with only its photo hidden, then rises; its essentials never fade. */
export const RisesBelowTheFold: Story = {
  decorators: [roomAbove],
  beforeEach: emulateFullMotion,
  play: async ({ canvas }) => {
    const card = canvas.getAllByRole('listitem')[0];
    await waitFor(() => expect(card).toHaveAttribute('data-rise', 'below'));
    await expect(getComputedStyle(card).transform).toBe('matrix(1, 0, 0, 1, 0, 40)');
    await expect(opacityUpTo(within(card).getByRole('img', { name: samplePhoto.alt }), card)).toBe(0);
    for (const essential of [
      within(card).getByText(/^\d+–\d+ \w+ · |^\d+ \w+ · /),
      within(card).getByText(/^PKR /),
      within(card).getByText(/ of \d+ seats left$/),
      within(card).getByRole('link', { name: /^View Trip/ }),
    ]) {
      await expect(opacityUpTo(essential, card)).toBe(1);
    }
    // The see-all cell isn't a card: it never moves.
    await expect(getComputedStyle(canvas.getAllByRole('listitem').at(-1)!).transform).toBe('none');
    card.scrollIntoView({ block: 'center' });
    await waitFor(() => expect(getComputedStyle(card).transform).toBe('none'), { timeout: 3000 });
    window.scrollTo({ top: 0, behavior: 'instant' });
  },
};

/** With reduced motion no card is ever offset. */
export const ReducedMotion: Story = {
  decorators: [roomAbove],
  play: async ({ canvasElement }) => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    await expect(canvasElement.querySelector('[data-rise]')).toBeNull();
  },
};
