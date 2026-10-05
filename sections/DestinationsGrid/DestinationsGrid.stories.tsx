import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { drawsLines, gridColumns, gridGaps } from '../../.storybook/gridColumns';
import { sampleDestinations } from '@/components/destination-card/sampleDestinations';
import { sampleHome } from '../sampleHome';
import { DestinationsGrid } from './DestinationsGrid';

const meta = {
  title: 'Sections/DestinationsGrid',
  component: DestinationsGrid,
  args: { copy: sampleHome.destinations, destinations: sampleDestinations },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof DestinationsGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = (canvas: ReturnType<typeof within>) => gridColumns(canvas.getAllByRole('listitem'));

/** Photo cards with the dense gaps: 16px between cards, 32px between rows, and no line on the list or a cell. */
async function denseGaps(canvas: ReturnType<typeof within>, gaps: { column: number | null; row: number | null }) {
  const items = canvas.getAllByRole('listitem');
  await expect(gridGaps(items)).toEqual(gaps);
  for (const element of [canvas.getByRole('list'), ...items]) await expect(drawsLines(element)).toBe(false);
}

/** Six across at 1440, 16px apart with no lines; each card links to its destination, and photos load lazily. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Where we go, and when to go there' })).toBeVisible();
    await expect(canvas.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      sampleDestinations.map((d) => `/destinations/${d.slug}`),
    );
    await expect(columns(canvas)).toBe(6);
    await denseGaps(canvas, { column: 16, row: null });
    for (const img of canvas.getAllByRole('img').filter((i) => i.tagName === 'IMG')) await expect(img).toHaveAttribute('loading', 'lazy');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390, rows 32px apart. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(columns(canvas)).toBe(2);
    await denseGaps(canvas, { column: 16, row: 32 });
  },
};

/** The destinations page: the phone's first row loads its photos straight away, the rest lazily. */
export const DestinationsPage: Story = {
  args: { priorityCards: 2 },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const images = canvas.getAllByRole('img').filter((i) => i.tagName === 'IMG');
    // One sample destination is still a placeholder, with no <img>.
    await expect(images.map((img) => img.getAttribute('loading'))).toEqual(['eager', 'eager', 'lazy', 'lazy', 'lazy']);
    await expect(images[0]).toHaveAttribute('fetchpriority', 'high');
  },
};

export const DestinationsPageOnLight: Story = { ...DestinationsPage, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The other valleys on Hunza's page: Hunza left out, the rest in order, each with its season and tours. */
const others = sampleDestinations.slice(1).map((destination, i) => ({
  ...destination,
  details: { season: `Best · ${destination.bestSeason.from} – ${destination.bestSeason.to}`, tours: i === 1 ? '1 tour' : '2 tours' },
}));

/** A destination page: five cards, none for the page's own, each one link named by its destination, with its season and tours; five across. */
const otherArgs = { variant: 'other' as const, copy: { headline: 'Other valleys we travel to' }, destinations: others };

/** Five cards, none for the page's own destination; each one link named by its destination, with its season and tours. */
async function otherCards(canvas: ReturnType<typeof within>) {
  const links = canvas.getAllByRole('link');
  await expect(links).toHaveLength(5);
  await expect(links.map((a: HTMLElement) => a.getAttribute('href'))).not.toContain('/destinations/hunza');
  for (const [i, destination] of others.entries()) {
    await expect(canvas.getByRole('link', { name: destination.name })).toHaveAttribute('href', `/destinations/${destination.slug}`);
    await expect(links[i]).toHaveAccessibleDescription(`${destination.details.season} ${destination.details.tours}`);
  }
}

export const Other: StoryObj<typeof DestinationsGrid> = {
  args: otherArgs,
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Other valleys we travel to' })).toBeVisible();
    await otherCards(canvas);
    await expect(columns(canvas)).toBe(5);
    await denseGaps(canvas, { column: 16, row: null });
  },
};

export const OtherOnLight: StoryObj<typeof DestinationsGrid> = { ...Other, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 two across with the dense gaps, and the odd last card takes the whole row. */
export const OtherPhone: StoryObj<typeof DestinationsGrid> = {
  ...Other,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await otherCards(canvas);
    const cells = canvas.getAllByRole('listitem');
    await expect(columns(canvas)).toBe(2);
    await denseGaps(canvas, { column: 16, row: 32 });
    const last = cells.at(-1)!.getBoundingClientRect();
    const first = cells[0].getBoundingClientRect();
    await expect(Math.round(last.width)).toBe(Math.round(first.width * 2 + 16));
    await expect(Math.round(last.left)).toBe(Math.round(first.left));
  },
};
