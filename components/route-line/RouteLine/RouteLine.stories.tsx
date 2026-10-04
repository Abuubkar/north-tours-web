import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination, sampleMurree } from '@/components/destination-card/sampleDestinations';
import { RouteLine } from './RouteLine';

const meta = {
  title: 'Route line/RouteLine',
  component: RouteLine,
  args: { stops: sampleDestination.gettingThere.stops, copy: sampleDestinationCopy.gettingThere },
} satisfies Meta<typeof RouteLine>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The stops, in order, as list items. */
const stops = (canvas: ReturnType<typeof within>) => canvas.getAllByRole('listitem');

/** Each leg is read out in full, and the last stop is the arrival. */
async function readsInOrder(canvas: ReturnType<typeof within>, names: string[], legs: string[]) {
  const items = stops(canvas);
  await expect(items).toHaveLength(names.length);
  for (const [i, name] of names.entries()) await expect(within(items[i]).getByText(name)).toBeInTheDocument();
  for (const [i, leg] of legs.entries()) await expect(within(items[i]).getByText(leg)).toBeInTheDocument();
  await expect(items.at(-1)).toHaveTextContent('Arrive');
}

/** Tops of the stops' dots: one row when the line lies flat. */
const rows = (items: HTMLElement[]) => new Set(items.map((item) => Math.round(item.getBoundingClientRect().top))).size;

/** From 820px the line lies flat: every stop on one row, the names and times clear of each other. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await readsInOrder(
      canvas,
      ['Lahore', 'Islamabad', 'Chilas', 'Gilgit', 'Hunza'],
      ['4–5 hrs by road to Islamabad', '11–12 hrs by road to Chilas', '3–4 hrs by road to Gilgit', '2–3 hrs by road to Hunza'],
    );
    await expect(canvas.getByRole('list').tagName).toBe('OL');
    await expect(rows(stops(canvas))).toBe(1);
    await expect(canvas.getByText('4–5 hrs')).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 820, the narrowest flat line, the names and times don't run into each other. */
export const NavBreakpoint: Story = {
  globals: { viewport: { value: 'navBreakpoint' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(rows(stops(canvas))).toBe(1);
    const names = ['Lahore', 'Islamabad', 'Chilas', 'Gilgit', 'Hunza'].map((name) => canvas.getByText(name).getBoundingClientRect());
    for (const [i, box] of names.slice(1).entries()) await expect(box.left).toBeGreaterThan(names[i].right);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

/** Below 820px a vertical list: a stop per row, "↓ 4–5 hrs" under each name and "Arrive" on the last. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(rows(stops(canvas))).toBe(5);
    await expect(canvas.getAllByText('↓', { exact: false })).toHaveLength(4);
    await expect(canvas.getByText('Arrive')).toBeVisible();
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Murree: three stops. */
export const Murree: Story = {
  args: { stops: sampleMurree.gettingThere.stops },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await readsInOrder(canvas, ['Lahore', 'Islamabad', 'Murree'], ['4–5 hrs by road to Islamabad', '1–2 hrs by road to Murree']);
    await expect(rows(stops(canvas))).toBe(1);
  },
};

export const MurreeNavBreakpoint: Story = { ...Murree, globals: { viewport: { value: 'navBreakpoint' } } };

export const MurreePhone: Story = {
  args: { stops: sampleMurree.gettingThere.stops },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(rows(stops(canvas))).toBe(3);
    await expect(canvas.getByText('Arrive')).toBeVisible();
  },
};
