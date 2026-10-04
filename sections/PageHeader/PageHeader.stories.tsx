import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleAbout } from '../sampleAbout';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Sections/PageHeader',
  component: PageHeader,
  args: {
    headline: 'All our trips from Lahore',
    lead: 'Prices per person, twin sharing. Every departure leaves from Lahore.',
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The page's only <h1>, then the lead. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'All our trips from Lahore' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByText('Prices per person, twin sharing. Every departure leaves from Lahore.')).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390 the headline wraps and nothing scrolls sideways. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

const plannerLead = 'Tell us what you have in mind. We’ll plan it and reply on WhatsApp, usually within 2 hours.';

/** The planner's first step on the light page: the <h1> at the statement size, the lead at most 600px wide. */
export const Planner: Story = {
  args: { variant: 'planner', headline: 'Your dates, your group', lead: plannerLead },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    // The statement size: clamp(40px, 6.4cqi, 92px).
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThanOrEqual(40);
    await expect(canvas.getByText(plannerLead).getBoundingClientRect().width).toBeLessThanOrEqual(600);
  },
};

export const PlannerLaptop: Story = { ...Planner, globals: { surface: 'light', viewport: { value: 'laptop' } } };

export const PlannerPhone: Story = {
  ...Planner,
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async (context) => {
    await Planner.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** Later steps: the same, only <h1> reads as a slim 15px line with no lead. */
export const PlannerSlim: Story = {
  args: { variant: 'plannerSlim', headline: 'Planning your private trip', lead: undefined },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Planning your private trip' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(getComputedStyle(h1).fontSize).toBe('15px');
    await expect(canvasElement.querySelector('p')).toBeNull();
  },
};

export const PlannerSlimPhone: Story = { ...PlannerSlim, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const PlannerSlimLaptop: Story = { ...PlannerSlim, globals: { surface: 'light', viewport: { value: 'laptop' } } };

/** The frame's width over its height, from its rendered box. */
const frameRatio = (img: HTMLElement) => {
  const { width, height } = img.closest('picture')!.getBoundingClientRect();
  return width / height;
};

/**
 * About: the <h1> at the long size, the lead, then the wide photo, the page's main image, loaded
 * straight away with high priority; 21:9 from 820px.
 */
export const About: Story = {
  args: { variant: 'about', headline: sampleAbout.header.headline, lead: sampleAbout.header.lead, image: sampleAbout.header.image },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: sampleAbout.header.headline })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByText(sampleAbout.header.lead).getBoundingClientRect().width).toBeLessThanOrEqual(560);
    const img = canvas.getByRole('img', { name: sampleAbout.header.image.alt });
    await expect(img).toHaveAttribute('loading', 'eager');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(frameRatio(img)).toBeCloseTo(21 / 9, 1);
  },
};

export const AboutOnLight: Story = { ...About, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const AboutLaptop: Story = { ...About, globals: { viewport: { value: 'laptop' } } };

/** At 390 the same photo is cropped to 4:3, and nothing scrolls sideways. */
export const AboutPhone: Story = {
  ...About,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    const img = canvas.getByRole('img', { name: sampleAbout.header.image.alt });
    await expect(img).toHaveAttribute('loading', 'eager');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(frameRatio(img)).toBeCloseTo(4 / 3, 1);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const AboutPhoneOnLight: Story = { ...AboutPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The legal pages (light): the document's title as the only <h1>, then "Last updated" with its date in a <time>. */
export const Legal: Story = {
  args: { variant: 'legal', headline: 'Privacy policy', lead: undefined, updated: { template: 'Last updated {date}', date: '2026-10-04' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByText(/^Last updated/)).toHaveTextContent('Last updated 4 October 2026');
    await expect(canvasElement.querySelector('time')).toHaveAttribute('datetime', '2026-10-04');
    await expect(canvasElement.querySelector('header')).toHaveAttribute('data-surface', 'light');
  },
};

export const LegalOnLight: Story = { ...Legal, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const LegalPhone: Story = {
  ...Legal,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Legal.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};
