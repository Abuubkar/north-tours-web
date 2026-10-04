import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { samplePlannerCopy, withPlanner } from '../samplePlanner';
import { StepDetails } from './StepDetails';

const meta = {
  title: 'Planner/StepDetails',
  component: StepDetails,
  args: { copy: samplePlannerCopy.details },
  decorators: [withPlanner],
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof StepDetails>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Name, number, best time, "Anything else?" (500 characters at most) and the privacy line; nothing scrolls sideways. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    const name = canvas.getByRole('textbox', { name: 'Name' });
    await expect(name).toHaveAttribute('autocomplete', 'name');
    await expect(name).toHaveAccessibleDescription('Required');
    await expect(canvas.getByRole('textbox', { name: 'WhatsApp number' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Best time to reach you' })).toBeVisible();
    await expect(canvas.getByRole('textbox', { name: 'Anything else?' })).toHaveAttribute('maxlength', '500');
    await expect(canvas.getByRole('link', { name: 'Privacy policy' })).toHaveAttribute('href', '/privacy');
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Laptop: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'laptop' } } };

export const Phone: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'phone' } } };
