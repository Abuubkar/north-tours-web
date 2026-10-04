import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { todayInKarachi } from '@/lib/utils/departures';
import { shortMonthYear } from '@/lib/utils/dates';
import { noSavedPlanner, samplePlannerCopy, withPlanner } from '../samplePlanner';
import { DatesField } from './DatesField';

const meta = {
  title: 'Planner/DatesField',
  component: DatesField,
  args: { copy: samplePlannerCopy.whereWhen.dates },
  decorators: [withPlanner],
  beforeEach: noSavedPlanner,
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof DatesField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Flexible by default: the 12 months from this one in Karachi, and "Roughly 6 days". */
export const Flexible: Story = {
  play: async ({ canvas }) => {
    const months = within(canvas.getByRole('group', { name: 'Month' })).getAllByRole('button');
    await expect(months).toHaveLength(12);
    await expect(months[0]).toHaveTextContent(shortMonthYear(todayInKarachi(new Date()).slice(0, 7)));
    await expect(canvas.getByRole('group', { name: 'Roughly how many days' })).toHaveTextContent('6');
  },
};

export const FlexiblePhone: Story = { ...Flexible, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Exact: From and To date fields, light pickers, To no earlier than From once it's set. */
export const Exact: Story = {
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Exact dates' }));
    const from = canvas.getByLabelText('From');
    await expect(getComputedStyle(from).colorScheme).toBe('light');
    const [y] = todayInKarachi(new Date()).split('-').map(Number);
    await userEvent.type(from, `${y + 1}-06-12`);
    await expect(canvas.getByLabelText('To')).toHaveAttribute('min', `${y + 1}-06-12`);
  },
};

export const ExactPhone: Story = { ...Exact, globals: { surface: 'light', viewport: { value: 'phone' } } };
