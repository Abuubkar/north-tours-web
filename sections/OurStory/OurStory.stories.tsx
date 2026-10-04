import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleAbout } from '../sampleAbout';
import { OurStory } from './OurStory';

const story = { ...sampleAbout.story, headline: 'Running trips north since 2014' };

const meta = {
  title: 'Sections/OurStory',
  component: OurStory,
  args: { copy: story },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof OurStory>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The headline and paragraphs beside the founder: a placeholder portrait named by its alt, then the name and role. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'Running trips north since 2014' });
    await expect(headline).toBeVisible();
    for (const paragraph of story.paragraphs) await expect(canvas.getByText(paragraph)).toBeVisible();
    const portrait = canvas.getByRole('img', { name: 'Tariq Mehmood, founder' });
    await expect(portrait).toHaveTextContent('Founder, at the office or on the road');
    const figure = portrait.closest('figure')!;
    await expect(figure.querySelector('figcaption')).toHaveTextContent('Tariq MehmoodFounder');
    // Beside the text at 1440.
    await expect(figure.getBoundingClientRect().left).toBeGreaterThan(headline.getBoundingClientRect().left);
    await expect(Math.round(figure.getBoundingClientRect().top)).toBe(Math.round(headline.getBoundingClientRect().top));
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the founder sits under the story, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const paragraphs = story.paragraphs.map((p) => canvas.getByText(p));
    const figure = canvas.getByRole('img', { name: 'Tariq Mehmood, founder' }).closest('figure')!;
    await expect(figure.getBoundingClientRect().top).toBeGreaterThanOrEqual(paragraphs.at(-1)!.getBoundingClientRect().bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
