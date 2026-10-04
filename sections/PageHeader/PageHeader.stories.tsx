import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
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
