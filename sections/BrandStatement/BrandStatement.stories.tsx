import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { emulateFullMotion, emulateReducedMotion } from '../../.storybook/reducedMotion';
import styles from '@/components/ui/stories.module.css';
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

/** Scroll room above the statement, so it starts near the bottom of the screen, not yet lit. */
const belowTheFold = [
  (Story: () => React.ReactNode) => (
    <>
      <div className={styles.scrollRoom} />
      <Story />
    </>
  ),
];

const wordOpacity = (canvasElement: HTMLElement, index: number) =>
  Number(getComputedStyle(canvasElement.querySelectorAll('h1 > span')[index]).opacity);

/**
 * M2: each word is tied to the statement's scroll timeline, one after another. (The reveal itself
 * is scroll-driven, so it's checked in a real browser on the built page.)
 */
export const LightsUp: Story = {
  beforeEach: emulateFullMotion,
  parameters: { a11y: { test: 'off' } },
  play: async ({ canvas }) => {
    const words = [...canvas.getByRole('heading', { level: 1 }).querySelectorAll('span')];
    const styles = words.map((word) => getComputedStyle(word));
    for (const style of styles) {
      await expect(style.animationName).toMatch(/word-reveal/);
      await expect(style.animationTimeline).toBe('--statement');
    }
    const ranges = styles.map((style) => style.animationRangeStart);
    await expect(new Set(ranges).size).toBe(words.length);
  },
};

/** With reduced motion every word is fully opaque, wherever the statement is. */
export const ReducedMotion: Story = {
  decorators: belowTheFold,
  beforeEach: emulateReducedMotion,
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 1 });
    window.scrollTo(0, window.scrollY + heading.getBoundingClientRect().top - window.innerHeight * 0.9);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const words = canvasElement.querySelectorAll('h1 > span').length;
    for (let i = 0; i < words; i++) {
      await expect(wordOpacity(canvasElement, i)).toBe(1);
      await expect(getComputedStyle(canvasElement.querySelectorAll('h1 > span')[i]).animationName).toBe('none');
    }
  },
};
