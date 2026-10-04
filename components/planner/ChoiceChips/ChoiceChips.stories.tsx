import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { ChoiceChips } from './ChoiceChips';

const options = [
  { id: '2-4', label: '2–4 days' },
  { id: '5-7', label: '5–7 days' },
  { id: '8-10', label: '8–10 days' },
  { id: '10plus', label: '10+ days' },
];

/** Picking the chosen chip again clears it, as the optional questions do. */
function Clearable() {
  const [value, setValue] = useState<string | null>(null);
  return <ChoiceChips id="length" label="Trip length" hint="Optional" options={options} value={value} onPick={(id) => setValue(value === id ? null : id)} />;
}

const meta = {
  title: 'Planner/ChoiceChips',
  component: Clearable,
  globals: { surface: 'light' },
} satisfies Meta<typeof Clearable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A named group, described by its hint; one chip at a time, and the chosen one clears on a second press. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Trip length' })).toHaveAccessibleDescription('Optional');
    const five = canvas.getByRole('button', { name: '5–7 days' });
    await userEvent.click(five);
    await expect(five).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: '8–10 days' }));
    await expect(five).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(canvas.getByRole('button', { name: '8–10 days' }));
    await expect(canvas.queryAllByRole('button', { pressed: true })).toHaveLength(0);
  },
};

export const OnDark: Story = { ...Default, globals: { surface: 'dark' } };

/** At 390 the chips wrap and nothing scrolls sideways. */
export const Phone: Story = {
  ...Default,
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
