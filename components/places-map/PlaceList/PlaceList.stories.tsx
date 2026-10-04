import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { hunzaPlaces, placeholderPlaces } from '../samplePlaces';
import { PlaceList } from './PlaceList';

const meta = {
  title: 'Places map/PlaceList',
  component: PlaceList,
  args: { places: hunzaPlaces, kinds: sampleDestinationCopy.places.kinds, lit: null, picked: null, onPoint: fn(), onPick: fn() },
} satisfies Meta<typeof PlaceList>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An ordered list, a row per place: its number, name, line, kind and photo; the photos load lazily. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, args }) => {
    const rows = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(rows).toHaveLength(args.places.length);
    for (const [i, place] of args.places.entries()) {
      const row = within(rows[i]);
      await expect(row.getByRole('button', { name: place.name })).toHaveAccessibleDescription(`${place.text} ${sampleDestinationCopy.places.kinds[place.kind]}`);
      await expect(row.getByText(String(i + 1))).toBeVisible();
      await expect(row.getByText(sampleDestinationCopy.places.kinds[place.kind])).toBeVisible();
      await expect(row.getByRole('img', { name: place.image.alt })).toBeVisible();
    }
    if ('src' in args.places[0].image) await expect(canvas.getAllByRole('img')[0]).toHaveAttribute('loading', 'lazy');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Until a place has a photo, its striped placeholder is read out by its alt. */
export const Placeholders: Story = { ...Desktop, args: { places: placeholderPlaces } };

export const PlaceholdersPhone: Story = { ...Phone, args: { places: placeholderPlaces } };

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** The lit place's row is raised and the picked one pressed; the rest stay as they are. */
export const OnePicked: Story = {
  args: { lit: 'attabad-lake', picked: 'attabad-lake' },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const rows = within(canvas.getByRole('list')).getAllByRole('button');
    await expect(rows.filter((row) => row.getAttribute('aria-pressed') === 'true').map((row) => row.textContent)).toEqual([
      expect.stringContaining('Attabad Lake'),
    ]);
  },
};

export const OnePickedOnLight: Story = { ...OnePicked, globals: { surface: 'light', viewport: { value: 'desktop' } } };
