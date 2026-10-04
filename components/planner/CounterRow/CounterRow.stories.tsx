import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { samplePlannerCopy } from '../samplePlanner';
import { CounterRow } from './CounterRow';
import styles from '../../ui/stories.module.css';

const { adults } = samplePlannerCopy.whosComing.group;

function Adults() {
  const [value, setValue] = useState(2);
  return (
    <div className={styles.aside}>
      <CounterRow label={adults.label} hint={adults.hint} value={value} min={1} max={40} onChange={setValue} decreaseLabel={adults.fewer} increaseLabel={adults.more} />
    </div>
  );
}

const meta = {
  title: 'Planner/CounterRow',
  component: Adults,
  globals: { surface: 'light' },
} satisfies Meta<typeof Adults>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The label over its hint, and a stepper named by the label. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const group = canvas.getByRole('group', { name: 'Adults' });
    await expect(canvas.getByText('18 and over')).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'More adults' }));
    await expect(group).toHaveTextContent('3');
  },
};

export const OnDark: Story = { ...Default, globals: { surface: 'dark' } };
