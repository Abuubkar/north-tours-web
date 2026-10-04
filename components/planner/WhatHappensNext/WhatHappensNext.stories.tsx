import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { samplePlannerCopy } from '../samplePlanner';
import { WhatHappensNext } from './WhatHappensNext';

const meta = {
  title: 'Planner/WhatHappensNext',
  component: WhatHappensNext,
  args: { copy: samplePlannerCopy.next },
  globals: { surface: 'light' },
} satisfies Meta<typeof WhatHappensNext>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An <h2> and an ordered list of three steps (a real sequence), then the licence line; an 8px panel. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'What happens next' })).toBeVisible();
    await expect(canvas.getByRole('list').tagName).toBe('OL');
    await expect(canvas.getAllByRole('listitem').map((li) => li.textContent)).toEqual(samplePlannerCopy.next.steps);
    await expect(canvas.getByText('DTS licence No. [DTS licence number]')).toBeVisible();
    await expect(getComputedStyle(canvas.getByRole('heading').parentElement!).borderRadius).toBe('8px');
  },
};

export const OnDark: Story = { ...Default, globals: { surface: 'dark' } };
