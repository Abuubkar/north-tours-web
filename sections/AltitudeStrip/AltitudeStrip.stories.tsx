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
const pauseButton = (canvas: Canvas) => canvas.getByRole('button', { name: 'Pause the altitude strip' });

/**
 * A light strip (Text on Ink) under the header, as tall as a tap target so its pause button gets a
 * 44px hit area: each place is a link to its destination, named and tabbed once though the list is
 * drawn twice for the loop (the copy is hidden and inert). The ▲ is decorative.
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
    // The loop's copy: drawn, but out of the accessibility tree and the tab order.
    const [, copy] = nav.querySelectorAll('ul');
    await expect(copy).toHaveAttribute('aria-hidden', 'true');
    await expect(copy.inert).toBe(true);
    await expect(copy.querySelectorAll('a')).toHaveLength(places.length);
    // One drawing of the list per loop, at about 40px a second (--ticker-speed).
    const animation = await loop(canvas);
    await expect(animation.playState).toBe('running');
    const drawing = nav.querySelector('ul')!.offsetWidth;
    await expect(Number(animation.effect!.getTiming().duration)).toBeCloseTo((drawing / 40) * 1000, 0);
    const pause = pauseButton(canvas);
    await expect(pause).toHaveAccessibleName('Pause the altitude strip');
    await expect(pause).toHaveAttribute('aria-pressed', 'false');
    const { width, height: buttonHeight } = pause.getBoundingClientRect();
    await expect([width, buttonHeight]).toEqual([44, 44]);
  },
};

export const RunningOnLight: Story = { ...Running, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RunningPhone: Story = { ...Running, globals: { viewport: { value: 'phone' } } };

/** Real Tab presses reach each place once, in order, then the pause button: never the copy. */
export const TabOrder: Story = {
  play: async ({ canvas }) => {
    const keys = await realUser();
    if (!keys) return;
    await loop(canvas);
    const reached: string[] = [];
    for (let i = 0; i <= places.length; i++) {
      await keys.keyboard('{Tab}');
      const focused = document.activeElement as HTMLElement;
      reached.push(focused.getAttribute('href') ?? focused.getAttribute('aria-label')!);
    }
    await expect(reached).toEqual([...places.map(({ href }) => href), 'Pause the altitude strip']);
  },
};

/** Pointing at the places pauses the strip; moving away starts it again. */
export const HoverPauses: Story = {
  play: async ({ canvas, canvasElement }) => {
    const user = await realUser();
    if (!user) return;
    const animation = await loop(canvas);
    // The window, which stands still (the places move, so they never settle for the pointer).
    await user.hover(strip(canvas).querySelector('div')!);
    await waitFor(() => expect(animation.playState).toBe('paused'));
    await parkPointer(canvasElement);
    await waitFor(() => expect(animation.playState).toBe('running'));
  },
};

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
    await keys.keyboard('{Tab}');
    await expect(pauseButton(canvas)).toHaveFocus();
    await expect((await loop(canvas)).playState).toBe('running');
  },
};

export const FocusShowsThePlaceOnLight: Story = { ...FocusShowsThePlace, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * The pause button is a toggle with one name, "Pause the altitude strip": pressed, it stops the
 * strip (aria-pressed="true", the icon turns to play); pressed again, it runs. The name never changes.
 */
export const PauseButton: Story = {
  play: async ({ canvas, userEvent }) => {
    const animation = await loop(canvas);
    const button = canvas.getByRole('button', { name: 'Pause the altitude strip' });
    await userEvent.click(button);
    await expect(button).toHaveAccessibleName('Pause the altitude strip');
    await expect(button).toHaveAttribute('aria-pressed', 'true');
    await waitFor(() => expect(animation.playState).toBe('paused'));
    await userEvent.click(button);
    await expect(button).toHaveAccessibleName('Pause the altitude strip');
    await expect(button).toHaveAttribute('aria-pressed', 'false');
    await waitFor(() => expect(animation.playState).toBe('running'));
  },
};

export const PauseButtonOnLight: Story = { ...PauseButton, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/**
 * With reduced motion the strip stands still: no animation, no copy and no pause button. The
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
    await expect(canvas.queryByRole('button')).toBeNull();
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
