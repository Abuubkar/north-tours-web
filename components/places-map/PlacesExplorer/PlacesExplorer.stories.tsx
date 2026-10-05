import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { headerHeight } from '../../../.storybook/headerHeight';
import { realUser } from '../../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { roomAbove, roomBelow } from '../../../.storybook/scrollRoom';
import { fairyMeadowsMapLabels, fairyMeadowsPlaces, hunzaMapLabels, hunzaPlaces } from '../samplePlaces';
import { PlacesExplorer } from './PlacesExplorer';

const meta = {
  title: 'Places map/PlacesExplorer',
  component: PlacesExplorer,
  args: { places: hunzaPlaces, labels: hunzaMapLabels, copy: sampleDestinationCopy.places },
  decorators: [roomBelow],
  beforeEach: emulateFullMotion,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PlacesExplorer>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;

/** The list's rows, and the map's pins (the other buttons), in place order. */
function parts(canvas: Canvas) {
  const list = canvas.getByRole('list');
  return {
    rows: within(list).getAllByRole('button'),
    pins: canvas.getAllByRole('button').filter((button: HTMLElement) => !list.contains(button)),
  };
}

/** A row is lit when it's raised off the page. */
const raised = (row: HTMLElement) => getComputedStyle(row).backgroundColor !== 'rgba(0, 0, 0, 0)';

/** A pin is lit when its place's name shows on the map. */
const nameOnMap = (canvasElement: HTMLElement, name: string) => within(canvasElement).queryByText(name, { selector: '[data-pin-label]' });

/** The map: the box the pins sit in, with its caption. */
const map = (canvasElement: HTMLElement) => canvasElement.querySelector('[data-pin]')!.parentElement!.parentElement!;

/**
 * Real keys: Tab to the first pin lights its row; on to the first row lights its pin. Enter on
 * a row presses it and its pin; Enter again clears both.
 */
export const Keyboard: Story = {
  play: async ({ canvas, canvasElement }) => {
    const user = await realUser();
    if (!user) return;
    const { rows, pins } = parts(canvas);
    await user.keyboard('{Tab}');
    await expect(pins[0]).toHaveFocus();
    await waitFor(() => expect(raised(rows[0])).toBe(true));
    await expect(nameOnMap(canvasElement, 'Rakaposhi viewpoint')).toBeVisible();

    await user.keyboard('{Tab}'.repeat(pins.length));
    await expect(rows[0]).toHaveFocus();
    await expect(nameOnMap(canvasElement, 'Rakaposhi viewpoint')).toBeVisible();

    // The mouse passing over another place and away again leaves the focused place lit.
    await user.hover(pins[4]);
    await user.unhover(pins[4]);
    await expect(nameOnMap(canvasElement, 'Rakaposhi viewpoint')).toBeVisible();

    await user.keyboard('{Enter}');
    await expect(rows[0]).toHaveAttribute('aria-pressed', 'true');
    await expect(pins[0]).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Enter}');
    await expect(rows[0]).toHaveAttribute('aria-pressed', 'false');
    await expect(pins[0]).toHaveAttribute('aria-pressed', 'false');
  },
};

export const KeyboardOnLight: Story = { ...Keyboard, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Hovering a row lights its pin, and hovering a pin lights its row; a hover elsewhere shows over a pick. */
export const Hover: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { rows, pins } = parts(canvas);
    await userEvent.hover(rows[4]);
    await expect(nameOnMap(canvasElement, 'Attabad Lake')).toBeVisible();
    await userEvent.hover(pins[6]);
    await waitFor(() => expect(raised(rows[6])).toBe(true));
    await expect(nameOnMap(canvasElement, 'Attabad Lake')).toBeNull();

    await userEvent.click(pins[2]);
    await userEvent.hover(rows[5]);
    await expect(nameOnMap(canvasElement, 'Hussaini Bridge')).toBeVisible();
    await userEvent.unhover(rows[5]);
    await expect(nameOnMap(canvasElement, 'Altit Fort')).toBeVisible();
    await expect(rows[2]).toHaveAttribute('aria-pressed', 'true');
  },
};

export const HoverOnLight: Story = { ...Hover, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** A place lit, on both surfaces, for axe. */
export const Picked: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(parts(canvas).rows[3]);
    await expect(parts(canvas).pins[3]).toHaveAttribute('aria-pressed', 'true');
  },
};

export const PickedOnLight: Story = { ...Picked, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 1366 the map sits beside the list and stays in view under the header as the page scrolls past it. */
export const Laptop: Story = {
  globals: { viewport: { value: 'laptop' } },
  play: async ({ canvas, canvasElement }) => {
    const { rows } = parts(canvas);
    const drawing = map(canvasElement);
    await expect(drawing.getBoundingClientRect().right).toBeLessThanOrEqual(rows[0].getBoundingClientRect().left);
    // It stops 24px under the header (--places-map-top).
    const stop = headerHeight() + 24;
    window.scrollTo({ top: drawing.getBoundingClientRect().top + window.scrollY - stop + 120, behavior: 'instant' });
    await waitFor(() => expect(Math.round(drawing.getBoundingClientRect().top)).toBe(stop));
    window.scrollTo({ top: 0, behavior: 'instant' });
  },
};

/** At 390 the map sits above the list; picking a row brings the map back into view, under the header's height. */
export const Phone: Story = {
  decorators: [roomAbove],
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { rows } = parts(canvas);
    const drawing = map(canvasElement);
    await expect(drawing.getBoundingClientRect().bottom).toBeLessThanOrEqual(rows[0].getBoundingClientRect().top);
    rows[6].scrollIntoView({ block: 'center', behavior: 'instant' });
    await expect(drawing.getBoundingClientRect().bottom).toBeLessThan(0);
    await userEvent.click(rows[6]);
    // Smoothly: not there straight away, then settled 16px under the header.
    const settled = headerHeight() + 16;
    await expect(Math.round(drawing.getBoundingClientRect().top)).not.toBe(settled);
    await waitFor(() => expect(Math.round(drawing.getBoundingClientRect().top)).toBe(settled), { timeout: 3000 });
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(Math.round(drawing.getBoundingClientRect().top)).toBe(settled);
    await expect(nameOnMap(canvasElement, 'Passu Cones')).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

/** With reduced motion the map jumps into view and colours change at once. */
export const PhoneReducedMotion: Story = {
  decorators: [roomAbove],
  beforeEach: emulateReducedMotion,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { rows, pins } = parts(canvas);
    const drawing = map(canvasElement);
    rows[6].scrollIntoView({ block: 'center', behavior: 'instant' });
    await userEvent.click(rows[6]);
    await expect(Math.round(drawing.getBoundingClientRect().top)).toBe(headerHeight() + 16);
    await expect(getComputedStyle(rows[6]).transitionDuration).toBe('0s');
    await expect(getComputedStyle(pins[6].querySelector('[data-pin-circle]')!).transitionDuration).toBe('0s');
  },
};

/** Fairy Meadows: four places close together; the list and map stay linked. */
export const FairyMeadows: Story = {
  args: { places: fairyMeadowsPlaces, labels: fairyMeadowsMapLabels },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const { rows, pins } = parts(canvas);
    await expect(pins).toHaveLength(4);
    await userEvent.hover(rows[2]);
    await expect(nameOnMap(canvasElement, 'Raikot Glacier')).toBeVisible();
  },
};

export const FairyMeadowsOnLight: Story = { ...FairyMeadows, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const FairyMeadowsLaptop: Story = { ...FairyMeadows, globals: { viewport: { value: 'laptop' } } };

export const FairyMeadowsPhone: Story = { ...FairyMeadows, globals: { viewport: { value: 'phone' } } };
