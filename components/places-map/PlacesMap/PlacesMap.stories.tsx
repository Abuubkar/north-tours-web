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

/** The route line's corners, on screen: its path's points scaled from the drawing to the map's box. */
function routeCorners(canvasElement: HTMLElement) {
  const route = canvasElement.querySelector('path')!;
  const svg = route.ownerSVGElement!;
  const box = svg.getBoundingClientRect();
  const scale = box.width / svg.viewBox.baseVal.width;
  return [...route.getAttribute('d')!.matchAll(/[ML]([\d.]+) ([\d.]+)/g)].map(([, x, y]) => ({ x: box.left + Number(x) * scale, y: box.top + Number(y) * scale }));
}

/**
 * The route line joins the pins in their numbered order, from the edge under the way in's name, and
 * runs under them: the middle of each pin is the pin, not the line.
 */
async function expectRoute(canvasElement: HTMLElement, edge: 'top' | 'bottom') {
  const pins = within(canvasElement).getAllByRole('button');
  for (const [i, pin] of pins.entries()) {
    pin.scrollIntoView({ block: 'center', behavior: 'instant' });
    const [entry, ...corners] = routeCorners(canvasElement);
    await expect(corners).toHaveLength(pins.length);
    const frame = canvasElement.querySelector('svg')!.getBoundingClientRect();
    await expect(Math.round(entry.y)).toBe(Math.round(edge === 'top' ? frame.top : frame.bottom));
    const { left, top, width, height } = pin.getBoundingClientRect();
    const centre = { x: left + width / 2, y: top + height / 2 };
    await expect(Math.abs(corners[i].x - centre.x)).toBeLessThan(1);
    await expect(Math.abs(corners[i].y - centre.y)).toBeLessThan(1);
    await expect(pin.contains(document.elementFromPoint(centre.x, centre.y))).toBe(true);
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

/**
 * Every pin is a button named by its place, unlit; the route line runs up from "↓ Gilgit", the way
 * in, through the pins in order. The graticule, the line, the names and the caption are hidden from
 * screen readers.
 */
export const Hunza: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    const pins = canvas.getAllByRole('button');
    await expect(pins.map((pin) => pin.getAttribute('aria-label'))).toEqual(args.places.map((place) => place.name));
    for (const pin of pins) await expect(pin).toHaveAttribute('aria-pressed', 'false');
    for (const text of ['36.3°N', '74.7°E', 'Karimabad', '↓ Gilgit', '↑ Khunjerab', 'Schematic · positions approximate']) {
      await expect(canvas.getByText(text).closest('[aria-hidden="true"]')).not.toBeNull();
    }
    await expect(canvasElement.querySelector('path')!.closest('[aria-hidden="true"]')).not.toBeNull();
    await expectRoute(canvasElement, 'bottom');
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

/** On a phone nothing on the map, a degree label at the edge included, widens the page. */
export const BaltitLitPhone: Story = {
  ...BaltitLit,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await BaltitLit.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** Passu Cones, near the top: its name goes below rather than leave the map. */
export const PassuLit: Story = {
  args: { lit: 'passu-cones' },
  play: async ({ canvasElement }) => {
    await nameClearOfPins(canvasElement, 'Passu Cones');
  },
};

/** Fairy Meadows: four places close together, drawn at a finer graticule; the line comes down from "↑ Raikot Bridge". */
export const FairyMeadows: Story = {
  args: { places: fairyMeadowsPlaces, labels: fairyMeadowsMapLabels, lit: 'fairy-meadows' },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('button')).toHaveLength(4);
    await expect(canvas.getByText('↑ Raikot Bridge')).toBeVisible();
    await nameClearOfPins(canvasElement, 'Fairy Meadows');
    await expectRoute(canvasElement, 'top');
  },
};

export const FairyMeadowsOnLight: Story = { ...FairyMeadows, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const FairyMeadowsPhone: Story = { ...FairyMeadows, globals: { viewport: { value: 'phone' } } };
