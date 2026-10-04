import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { gridColumns } from '../../.storybook/gridColumns';
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

/** Six across at 1440; each card links to its destination, and photos load lazily. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Where we go, and when to go there' })).toBeVisible();
    await expect(canvas.getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(
      sampleDestinations.map((d) => `/destinations/${d.slug}`),
    );
    await expect(columns(canvas)).toBe(6);
    for (const img of canvas.getAllByRole('img').filter((i) => i.tagName === 'IMG')) await expect(img).toHaveAttribute('loading', 'lazy');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Two across at 390. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(columns(canvas)).toBe(2);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The other valleys on Hunza's page: Hunza left out, the rest in order, each with its season and tours. */
const others = sampleDestinations.slice(1).map((destination, i) => ({ ...destination, tours: i === 1 ? '1 tour' : '2 tours' }));

/** A destination page: five cards, none for the page's own, each one link named by its destination, with its season and tours; five across. */
export const Other: Story = {
  args: { variant: 'other', copy: { headline: 'Other valleys we travel to', seasonLabel: 'Best · {season}' }, destinations: others },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Other valleys we travel to' })).toBeVisible();
    const links = canvas.getAllByRole('link');
    await expect(links).toHaveLength(5);
    await expect(links.map((a) => a.getAttribute('href'))).not.toContain('/destinations/hunza');
    for (const [i, destination] of others.entries()) {
      await expect(canvas.getByRole('link', { name: destination.name })).toHaveAttribute('href', `/destinations/${destination.slug}`);
      await expect(links[i]).toHaveAccessibleDescription(new RegExp(`^Best · \\w{3} – \\w{3} ${destination.tours}$`));
    }
    await expect(columns(canvas)).toBe(5);
  },
};

export const OtherOnLight: Story = { ...Other, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 two across, and the odd last card takes the whole row. */
export const OtherPhone: Story = {
  ...Other,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const cells = canvas.getAllByRole('listitem');
    await expect(columns(canvas)).toBe(2);
    const last = cells.at(-1)!.getBoundingClientRect();
    const first = cells[0].getBoundingClientRect();
    await expect(Math.round(last.width)).toBe(Math.round(cells[0].getBoundingClientRect().width * 2 + 1));
    await expect(Math.round(last.left)).toBe(Math.round(first.left));
  },
};
