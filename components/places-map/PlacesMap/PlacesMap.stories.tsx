import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn, within } from 'storybook/test';
import { fairyMeadowsMapLabels, fairyMeadowsPlaces, hunzaMapLabels, hunzaPlaces } from '../samplePlaces';
import { PlacesMap } from './PlacesMap';

const meta = {
  title: 'Places map/PlacesMap',
  component: PlacesMap,
  args: {
    places: hunzaPlaces,
    labels: hunzaMapLabels,
    caption: 'Schematic · positions approximate',
    lit: null,
    picked: null,
    onPoint: fn(),
    onPick: fn(),
  },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PlacesMap>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every pin is a button named by its place, unlit; the graticule, the names and the caption are hidden from screen readers. */
export const Hunza: Story = {
  play: async ({ canvas, args }) => {
    const pins = canvas.getAllByRole('button');
    await expect(pins.map((pin) => pin.getAttribute('aria-label'))).toEqual(args.places.map((place) => place.name));
    for (const pin of pins) await expect(pin).toHaveAttribute('aria-pressed', 'false');
    for (const text of ['36.3°N', '74.7°E', 'Karimabad', '↓ Gilgit', '↑ Khunjerab', 'Schematic · positions approximate']) {
      await expect(canvas.getByText(text).closest('[aria-hidden="true"]')).not.toBeNull();
    }
  },
};

export const HunzaOnLight: Story = { ...Hunza, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** The lit pin's name sits inside the map, clear of the other pins. */
async function nameClearOfPins(canvasElement: HTMLElement, name: string) {
  const map = within(canvasElement);
  const label = map.getByText(name, { selector: '[data-pin-label]' }).getBoundingClientRect();
  const frame = canvasElement.querySelector('[data-pin]')!.parentElement!.getBoundingClientRect();
  await expect(label.left).toBeGreaterThanOrEqual(frame.left);
  await expect(label.right).toBeLessThanOrEqual(frame.right);
  await expect(label.top).toBeGreaterThanOrEqual(frame.top);
  await expect(label.bottom).toBeLessThanOrEqual(frame.bottom);
  const others = [...canvasElement.querySelectorAll('[data-pin-circle]')].filter((circle) => !circle.closest(`[aria-label="${name}"]`));
  for (const circle of others) {
    const pin = circle.getBoundingClientRect();
    const apart = label.right <= pin.left || pin.right <= label.left || label.bottom <= pin.top || pin.bottom <= label.top;
    await expect(apart).toBe(true);
  }
}

/** Attabad Lake picked: pressed, gold, its name on the map. */
export const AttabadPicked: Story = {
  args: { lit: 'attabad-lake', picked: 'attabad-lake' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('button', { name: 'Attabad Lake' })).toHaveAttribute('aria-pressed', 'true');
    await nameClearOfPins(canvasElement, 'Attabad Lake');
  },
};

export const AttabadPickedOnLight: Story = { ...AttabadPicked, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Baltit Fort, among Altit and Eagle's Nest: its name finds a spot clear of them, here and on a phone. */
export const BaltitLit: Story = {
  args: { lit: 'baltit-fort' },
  play: async ({ canvasElement }) => {
    await nameClearOfPins(canvasElement, 'Baltit Fort');
  },
};

export const BaltitLitOnLight: Story = { ...BaltitLit, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const BaltitLitPhone: Story = { ...BaltitLit, globals: { viewport: { value: 'phone' } } };

/** Passu Cones, near the top: its name goes below rather than leave the map. */
export const PassuLit: Story = {
  args: { lit: 'passu-cones' },
  play: async ({ canvasElement }) => {
    await nameClearOfPins(canvasElement, 'Passu Cones');
  },
};

/** Fairy Meadows: four places close together, drawn at a finer graticule. */
export const FairyMeadows: Story = {
  args: { places: fairyMeadowsPlaces, labels: fairyMeadowsMapLabels, lit: 'fairy-meadows' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
    await expect(canvas.getByText('↑ Raikot Bridge')).toBeVisible();
    await nameClearOfPins(canvasElement, 'Fairy Meadows');
  },
};

export const FairyMeadowsOnLight: Story = { ...FairyMeadows, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const FairyMeadowsPhone: Story = { ...FairyMeadows, globals: { viewport: { value: 'phone' } } };
