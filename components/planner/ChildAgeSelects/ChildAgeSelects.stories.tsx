import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useEffect } from 'react';
import { expect } from 'storybook/test';
import { usePlanner } from '@/hooks/usePlanner';
import { setChildren } from '@/lib/utils/plannerAnswers';
import { noSavedPlanner, samplePlannerCopy, withPlanner } from '../samplePlanner';
import { ChildAgeSelects } from './ChildAgeSelects';

/** Two children, as if "More children" was pressed twice. */
function TwoChildren() {
  const { update } = usePlanner();
  useEffect(() => update((a) => setChildren(a, 2)), [update]);
  return <ChildAgeSelects copy={samplePlannerCopy.whosComing.ages} />;
}

const meta = {
  title: 'Planner/ChildAgeSelects',
  component: TwoChildren,
  decorators: [withPlanner],
  beforeEach: noSavedPlanner,
} satisfies Meta<typeof TwoChildren>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A named group with a select per child: "Age" first, then "Under 2" and 2 to 17. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Children’s ages (helps us plan rooms and stops)' })).toBeVisible();
    const first = await canvas.findByRole('combobox', { name: 'Child 1' });
    await expect(canvas.getByRole('combobox', { name: 'Child 2' })).toBeVisible();
    await expect([...(first as HTMLSelectElement).options].map((o) => o.text)).toEqual([
      'Age', 'Under 2', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17',
    ]);
    await userEvent.selectOptions(first, '6');
    await expect(first).toHaveDisplayValue('6');
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
