import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { noSavedPlanner, samplePlannerCopy, samplePlannerDestinations, withPlanner } from '../samplePlanner';
import { DestinationChoices } from './DestinationChoices';

const meta = {
  title: 'Planner/DestinationChoices',
  component: DestinationChoices,
  args: { destinations: samplePlannerDestinations, copy: samplePlannerCopy.whereWhen.destinations },
  decorators: [withPlanner],
  beforeEach: noSavedPlanner,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof DestinationChoices>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Every destination in the loader's order, then "Help me choose" with its own photo; several can be ticked. */
export const Desktop: Story = {
  play: async ({ canvas, userEvent }) => {
    const group = canvas.getByRole('group', { name: 'Destinations' });
    await expect(group).toHaveAccessibleDescription('Required · choose one or more');
    const names = canvas.getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    await expect(names).toEqual(['Fairy Meadows', 'Hunza', 'Murree', 'Naran-Kaghan', 'Skardu', 'Swat', 'Help me choose']);
    const unsure = canvas.getByRole('button', { name: 'Help me choose' });
    await expect(unsure.querySelector('img')).toHaveAttribute('alt', samplePlannerCopy.whereWhen.destinations.unsureImage.alt);
    await userEvent.click(canvas.getByRole('button', { name: 'Hunza' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Help me choose' }));
    await expect(canvas.getAllByRole('button', { pressed: true })).toHaveLength(2);
  },
};

/** At 390: two cards across, nothing scrolling sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const [a, b, c] = canvas.getAllByRole('button');
    await expect(a.getBoundingClientRect().top).toBe(b.getBoundingClientRect().top);
    await expect(c.getBoundingClientRect().top).toBeGreaterThan(a.getBoundingClientRect().top);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
