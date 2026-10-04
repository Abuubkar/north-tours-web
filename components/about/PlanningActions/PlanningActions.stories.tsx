import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { PlanningActions } from './PlanningActions';

const meta = {
  title: 'About/PlanningActions',
  component: PlanningActions,
  args: { exploreLabel: 'Explore tours', planLabel: 'Plan a private trip' },
} satisfies Meta<typeof PlanningActions>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Two 56px links: to the Tours page and to the Trip Planner, at most 520px together. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const explore = canvas.getByRole('link', { name: /Explore tours/ });
    const plan = canvas.getByRole('link', { name: 'Plan a private trip' });
    await expect(explore).toHaveAttribute('href', '/tours');
    await expect(plan).toHaveAttribute('href', '/plan');
    await expect(explore.getBoundingClientRect().height).toBe(56);
    await expect(plan.querySelector('svg')).toBeNull();
    await expect(plan.getBoundingClientRect().right - explore.getBoundingClientRect().left).toBeLessThanOrEqual(520);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a phone the pair fits the screen. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getAllByRole('link')).toHaveLength(2);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
