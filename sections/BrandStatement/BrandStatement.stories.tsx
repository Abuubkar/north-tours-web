import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import { roomAbove } from '../../.storybook/scrollRoom';
import { sampleHome } from '../sampleHome';
import { BrandStatement } from './BrandStatement';

const meta = {
  title: 'Sections/BrandStatement',
  component: BrandStatement,
  args: { copy: sampleHome.statement },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof BrandStatement>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The page's only <h1>, then the body and "Meet the team" to the guides on the About page.
 * Axe checks the statement fully lit (the dimmed words are a passing scroll state), so these
 * stories run with reduced motion in the test run; the Storybook UI follows the OS setting.
 */
export const Desktop: Story = {
  beforeEach: emulateReducedMotion,
  play: async ({ canvas }) => {
    // Its words are separate spans for the reveal, but its name is still the full sentence.
    await expect(canvas.getByRole('heading', { level: 1, name: sampleHome.statement.headline })).toBeVisible();
    await expect(canvas.getAllByRole('heading')).toHaveLength(1);
    await expect(canvas.getByRole('link', { name: 'Meet the team' })).toHaveAttribute('href', '/about#guides');
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const PhoneOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };

const wordStyles = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll('h1 > span')].map((word) => getComputedStyle(word));

/**
 * M2: each word is tied to the statement's scroll timeline, one after another. (The reveal while
 * scrolling is checked in a real browser on the built page.) Axe then checks the statement fully
 * lit, with motion off, since the dimmed words are a passing scroll state.
 */
export const LightsUp: Story = {
  beforeEach: emulateFullMotion,
  play: async ({ canvasElement }) => {
    const words = wordStyles(canvasElement);
    for (const word of words) {
      await expect(word.animationName).toMatch(/word-reveal/);
      await expect(word.animationTimeline).toBe('--statement');
    }
    await expect(new Set(words.map((word) => word.animationRangeStart)).size).toBe(words.length);
    await emulateReducedMotion();
    await waitFor(() => {
      for (const word of wordStyles(canvasElement)) expect(word.opacity).toBe('1');
    });
  },
};

export const LightsUpOnLight: Story = { ...LightsUp, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** With reduced motion every word is fully opaque, wherever the statement is. */
export const ReducedMotion: Story = {
  decorators: [roomAbove],
  beforeEach: emulateReducedMotion,
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 1 });
    window.scrollTo(0, window.scrollY + heading.getBoundingClientRect().top - window.innerHeight * 0.9);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    for (const word of wordStyles(canvasElement)) {
      await expect([word.opacity, word.animationName]).toEqual(['1', 'none']);
    }
  },
};
