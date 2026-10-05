import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { headerHeight } from '../../.storybook/headerHeight';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import { roomBelow } from '../../.storybook/scrollRoom';
import { placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
import { sampleHome } from '../sampleHome';
import { HomeHero } from './HomeHero';

/** The general message from settings. */
const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';
const WHATSAPP = `https://wa.me/?${MESSAGE}`;

type Canvas = ReturnType<typeof within>;

const meta = {
  title: 'Sections/HomeHero',
  component: HomeHero,
  args: { copy: sampleHome.hero, settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof HomeHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The display word: a span per letter, so it's found by its whole text. */
const displayWord = (canvas: Canvas) =>
  canvas.getByText((_: string, element: Element | null) => element?.tagName === 'P' && element.textContent === sampleHome.hero.displayWord);

/** The lead and both buttons; "NORTH" is decorative and hidden from screen readers. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(displayWord(canvas)).toHaveAttribute('aria-hidden', 'true');
    await expect(canvas.queryByRole('paragraph', { name: 'NORTH' })).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Explore Tours' })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByRole('link', { name: 'Plan on WhatsApp' })).toHaveAttribute('href', WHATSAPP);
    // The hero photo is the page's main image: never lazy.
    const photo = canvas.getByRole('img', { name: sampleHome.hero.image.alt });
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    await expect(photo).toHaveAttribute('loading', 'eager');
  },
};

/**
 * "NORTH" is a span per letter, each cancelling its own side space, so the gap between every pair
 * of letters' ink is the display gap (.05em), whatever the letters' shapes; it stays inside the hero.
 */
export const DisplayWord: Story = {
  play: async ({ canvas, canvasElement }) => {
    const word = displayWord(canvas);
    const { fontSize: size, columnGap } = getComputedStyle(word);
    const fontSize = parseFloat(size);
    await expect(parseFloat(columnGap) / fontSize).toBeCloseTo(0.05, 3);
    const letters = [...word.children] as HTMLElement[];
    await expect(letters.map((letter) => letter.textContent).join('')).toBe(sampleHome.hero.displayWord);
    const ink = letters.map((letter) => {
      const { left, right } = letter.getBoundingClientRect();
      const side = (name: string) => Number(letter.style.getPropertyValue(name)) * fontSize;
      return { left: left + side('--lsb'), right: right - side('--rsb') };
    });
    for (let i = 1; i < ink.length; i++) {
      await expect(Math.abs(ink[i].left - ink[i - 1].right - parseFloat(columnGap))).toBeLessThan(0.5);
    }
    await expect(letters.at(-1)!.getBoundingClientRect().right).toBeLessThanOrEqual(canvasElement.getBoundingClientRect().right);
  },
};

export const DisplayWordPhone: Story = { ...DisplayWord, globals: { viewport: { value: 'phone' } } };

export const DisplayWordOnLight: Story = { ...DisplayWord, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/**
 * The hero starts below the header and the altitude strip (no negative margin, so nothing covers
 * the photo) and ends at the fold: its height is the screen, clamped to 700–980px as before, less
 * the header and the strip.
 */
export const EndsAtTheFold: Story = {
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector('section')!;
    await expect(getComputedStyle(hero).marginTop).toBe('0px');
    const screen = Math.min(Math.max(window.innerHeight, 700), 980);
    const strip = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--altitude-strip-h'));
    await expect(hero.getBoundingClientRect().height).toBeCloseTo(screen - headerHeight() - strip, 0);
  },
};

export const EndsAtTheFoldLaptop: Story = { ...EndsAtTheFold, globals: { viewport: { value: 'laptop' } } };

export const EndsAtTheFoldPhone: Story = { ...EndsAtTheFold, globals: { viewport: { value: 'phone' } } };

export const EndsAtTheFoldOnLight: Story = { ...EndsAtTheFold, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** The hero always sits on its photo, so it stays dark on a light page. */
export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the buttons wrap to full width under the lead; nothing scrolls sideways. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    const { canvas, canvasElement } = context;
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    for (const name of ['Explore Tours', 'Plan on WhatsApp']) {
      await expect(canvas.getByRole('link', { name }).getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With a real number, "Plan on WhatsApp" carries its digits and the general message. */
export const RealNumber: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: 'Plan on WhatsApp' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?${MESSAGE}`,
    );
  },
};

/** The hero's layers, in order: photo, scrim, dim layer. */
const layers = (canvasElement: HTMLElement) => {
  const [photo, , dim] = canvasElement.querySelector('section')!.children;
  return { photo: getComputedStyle(photo), dim: getComputedStyle(dim) };
};

/** M1: halfway scrolled away, the photo is blurred and zoomed, and the dim layer darkens it. */
export const ScrolledAway: Story = {
  decorators: [roomBelow],
  beforeEach: emulateFullMotion,
  play: async ({ canvasElement }) => {
    window.scrollTo(0, 450);
    await waitFor(() => {
      const { photo, dim } = layers(canvasElement);
      expect(photo.filter).toMatch(/^blur\(\d/);
      expect(photo.transform).not.toBe('none');
      expect(Number(dim.opacity)).toBeGreaterThan(0.2);
    });
    window.scrollTo(0, 0);
  },
};

/** With reduced motion the hero stays still: no blur, no zoom, no dimming, however far it's scrolled. */
export const ReducedMotion: Story = {
  decorators: [roomBelow],
  beforeEach: emulateReducedMotion,
  play: async ({ canvasElement }) => {
    window.scrollTo(0, 450);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const { photo, dim } = layers(canvasElement);
    await expect([photo.filter, photo.transform, dim.opacity]).toEqual(['none', 'none', '0']);
    window.scrollTo(0, 0);
  },
};
