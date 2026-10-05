import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { parkPointer } from '../../.storybook/parkPointer';
import { realUser } from '../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import { altitudePlaces } from '@/lib/utils/altitudeStrip';
import { sampleHome } from '../sampleHome';
import { AltitudeStrip } from './AltitudeStrip';

/** The six destinations, in content order, as the Homepage passes them. */
const places = altitudePlaces([
  { name: 'Fairy Meadows', slug: 'fairy-meadows', altitude: 3300 },
  { name: 'Hunza', slug: 'hunza', altitude: 2438 },
  { name: 'Murree', slug: 'murree', altitude: 2291 },
  { name: 'Naran-Kaghan', slug: 'naran-kaghan', altitude: 2409 },
  { name: 'Skardu', slug: 'skardu', altitude: 2228 },
  { name: 'Swat', slug: 'swat', altitude: 980 },
]);

type Canvas = ReturnType<typeof within>;

const meta = {
  title: 'Sections/AltitudeStrip',
  component: AltitudeStrip,
  args: { places, copy: sampleHome.altitudes },
  parameters: { fullBleed: true },
  beforeEach: emulateFullMotion,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof AltitudeStrip>;

export default meta;
type Story = StoryObj<typeof meta>;

const strip = (canvas: Canvas) => canvas.getByRole('navigation', { name: 'Altitudes of our destinations' });
const track = (canvas: Canvas) => strip(canvas).querySelector('ul')!.parentElement!;
/** The loop's animation, once the strip has measured it and runs. */
const loop = async (canvas: Canvas) => {
  await waitFor(() => expect(track(canvas).getAnimations()).toHaveLength(1));
  return track(canvas).getAnimations()[0];
};

/**
 * A light strip (Text on Ink) under the header, as tall as a tap target: each place is a link to
 * its destination, named and tabbed once though the list is drawn twice for the loop (the copy is
 * hidden from screen readers and out of the tab order, but clickable). The ▲ is decorative.
 */
export const Running: Story = {
  play: async ({ canvas }) => {
    const nav = strip(canvas);
    const { backgroundColor, color, height, textTransform } = getComputedStyle(nav);
    await expect([backgroundColor, color, height, textTransform]).toEqual(['rgb(241, 238, 232)', 'rgb(12, 18, 22)', '44px', 'uppercase']);
    // Geist Mono, set on the strip itself (the system monospace after it, until it's there).
    await expect(getComputedStyle(nav).fontFamily).toMatch(/^"?'?Geist Mono/);
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual(
      places.map(({ name, altitude, href }) => [`${name}▲ ${altitude}`, href]),
    );
    await expect(links.map((link) => within(link).getByText('▲').getAttribute('aria-hidden'))).toEqual(places.map(() => 'true'));
    // The loop's copy: drawn and clickable, but out of the accessibility tree and the tab order.
    const [, copy] = nav.querySelectorAll('ul');
    await expect(copy).toHaveAttribute('aria-hidden', 'true');
    await expect(copy.inert).toBe(false);
    const copyLinks = [...copy.querySelectorAll('a')];
    await expect(copyLinks.map((link) => [link.getAttribute('href'), link.tabIndex])).toEqual(places.map(({ href }) => [href, -1]));
    // One drawing of the list per loop, at --ticker-speed px a second; no pause button.
    const animation = await loop(canvas);
    await expect(animation.playState).toBe('running');
    const drawing = nav.querySelector('ul')!.offsetWidth;
    const speed = Number(getComputedStyle(nav).getPropertyValue('--ticker-speed'));
    await expect(Number(animation.effect!.getTiming().duration)).toBeCloseTo((drawing / speed) * 1000, 0);
    await expect(canvas.queryByRole('button')).toBeNull();
  },
};

export const RunningOnLight: Story = { ...Running, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RunningPhone: Story = { ...Running, globals: { viewport: { value: 'phone' } } };

/** Real Tab presses reach each place once, in order, then leave the strip: never the copy. */
export const TabOrder: Story = {
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await loop(canvas);
    const reached: string[] = [];
    for (let i = 0; i < places.length; i++) {
      await keys.keyboard('{Tab}');
      reached.push((document.activeElement as HTMLElement).getAttribute('href')!);
    }
    await expect(reached).toEqual(places.map(({ href }) => href));
    await keys.keyboard('{Tab}');
    await expect(strip(canvas).contains(document.activeElement)).toBe(false);
  },
};

/** Pointing at the places doesn't stop the strip (owner, ADR-0031). */
export const HoverKeepsRunning: Story = {
  play: async ({ canvas, canvasElement }) => {
    const user = await realUser();
    if (!user) return;
    const animation = await loop(canvas);
    await user.hover(strip(canvas).querySelector('div')!);
    const before = Number(animation.currentTime);
    await new Promise((resolve) => setTimeout(resolve, 300));
    await expect(animation.playState).toBe('running');
    await expect(Number(animation.currentTime)).toBeGreaterThan(before);
    await parkPointer(canvasElement);
  },
};

/**
 * The places sliding in from the right are the loop's copy, and a click on them lands on their
 * link: here the loop is held where the copy's first place has just come fully in, then hit-tested.
 */
export const CopyIsClickable: Story = {
  play: async ({ canvas }) => {
    const animation = await loop(canvas);
    const [drawing, copy] = strip(canvas).querySelectorAll('ul');
    const first = copy.querySelector('a')!;
    const frame = strip(canvas).querySelector('div')!.getBoundingClientRect();
    // The track moves one drawing's width over the loop: hold it near the end, where the copy's
    // first place has come in from the right.
    const duration = Number(animation.effect!.getTiming().duration);
    animation.pause();
    try {
      // Where the place starts, from where it is now and how far the track has moved.
      const moved = (Number(animation.currentTime) / duration) * drawing.offsetWidth;
      const start = first.getBoundingClientRect().left + moved;
      // Just inside the left edge, but short of a whole drawing's move, where the loop starts over.
      const target = Math.max(frame.left + 8, start - drawing.offsetWidth + 4);
      animation.currentTime = ((start - target) / drawing.offsetWidth) * duration;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const { left, top, width, height } = first.getBoundingClientRect();
      await expect(left).toBeGreaterThanOrEqual(frame.left);
      await expect(left + width).toBeLessThanOrEqual(frame.right);
      const hit = document.elementFromPoint(left + width / 2, top + height / 2);
      await expect(first.contains(hit)).toBe(true);
    } finally {
      animation.play();
    }
  },
};

export const CopyIsClickablePhone: Story = { ...CopyIsClickable, globals: { viewport: { value: 'phone' } } };

/**
 * A place with keyboard focus stops the strip and is brought fully into view, here the last place
 * at 390, far off to the right; when focus leaves the places, the strip runs again.
 */
export const FocusShowsThePlace: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await loop(canvas);
    const links = within(strip(canvas)).getAllByRole('link');
    for (let i = 0; i < links.length; i++) await keys.keyboard('{Tab}');
    const last = links.at(-1)!;
    await expect(last).toHaveFocus();
    await expect(track(canvas).getAnimations()).toHaveLength(0);
    const frame = strip(canvas).querySelector('div')!.getBoundingClientRect();
    await waitFor(() => {
      const place = last.getBoundingClientRect();
      expect(place.left).toBeGreaterThanOrEqual(frame.left);
      expect(place.right).toBeLessThanOrEqual(frame.right);
    });
    last.blur();
    await expect((await loop(canvas)).playState).toBe('running');
  },
};

export const FocusShowsThePlaceOnLight: Story = { ...FocusShowsThePlace, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * With reduced motion the strip stands still: no animation and no copy. The
 * places are in order and the strip scrolls sideways to show them all.
 */
export const ReducedMotion: Story = {
  beforeEach: emulateReducedMotion,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const nav = strip(canvas);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    await expect(track(canvas).getAnimations()).toHaveLength(0);
    await expect(nav.querySelectorAll('ul')).toHaveLength(1);
    await expect(within(nav).getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(places.map(({ href }) => href));
    const frame = nav.querySelector('div')!;
    await expect(getComputedStyle(frame).overflowX).toBe('auto');
    await expect(frame.scrollWidth).toBeGreaterThan(frame.clientWidth);
  },
};

export const ReducedMotionOnLight: Story = { ...ReducedMotion, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Without destinations there's no strip. */
export const NoPlaces: Story = {
  args: { places: [] },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation')).toBeNull();
  },
};
