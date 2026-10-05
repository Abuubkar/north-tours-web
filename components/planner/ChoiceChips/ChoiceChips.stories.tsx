import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { toggled } from '@/lib/utils/plannerOptions';
import { ChoiceChips } from './ChoiceChips';

const options = [
  { id: '2-4', label: '2–4 days' },
  { id: '5-7', label: '5–7 days' },
  { id: '8-10', label: '8–10 days' },
  { id: '10plus', label: '10+ days' },
];
const ids = options.map((option) => option.id);

/** Any number of chips, each unpicked by a second press, as most of the planner's questions are. */
function Several() {
  const [value, setValue] = useState<string[]>([]);
  return <ChoiceChips id="length" label="Trip length" hint="Optional" options={options} value={value} onPick={(id) => setValue(toggled(value, id, ids))} />;
}

const meta = {
  title: 'Planner/ChoiceChips',
  component: Several,
} satisfies Meta<typeof Several>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A named group, described by its hint; several chips can be on at once, and a second press turns one off. */
export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Trip length' })).toHaveAccessibleDescription('Optional');
    const five = canvas.getByRole('button', { name: '5–7 days' });
    const eight = canvas.getByRole('button', { name: '8–10 days' });
    await userEvent.click(five);
    await userEvent.click(eight);
    await expect(five).toHaveAttribute('aria-pressed', 'true');
    await expect(eight).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(five);
    await expect(five).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getAllByRole('button', { pressed: true })).toEqual([eight]);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** Real keys: Space toggles a chip on and off, and Enter does too; each keeps its own state. */
export const WithKeys: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const two = canvas.getByRole('button', { name: '2–4 days' });
    two.focus();
    await user.keyboard(' ');
    await expect(two).toHaveAttribute('aria-pressed', 'true');
    await user.keyboard('{Tab}');
    await user.keyboard(' ');
    await expect(canvas.getByRole('button', { name: '5–7 days' })).toHaveAttribute('aria-pressed', 'true');
    await expect(two).toHaveAttribute('aria-pressed', 'true');
    two.focus();
    await user.keyboard(' ');
    await expect(two).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard('{Enter}');
    await expect(two).toHaveAttribute('aria-pressed', 'true');
  },
};

export const WithKeysOnLight: Story = { ...WithKeys, globals: { surface: 'light' } };

/** One answer only (Departing from): the caller replaces the pick, so one chip is ever on. */
export const Single: Story = {
  render: () => {
    const OneCity = () => {
      const [value, setValue] = useState('lahore');
      const cities = [
        { id: 'lahore', label: 'Lahore' },
        { id: 'islamabad', label: 'Islamabad' },
      ];
      return <ChoiceChips id="from" label="Departing from" hint="Lahore by default" options={cities} value={[value]} onPick={setValue} />;
    };
    return <OneCity />;
  },
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('button', { name: 'Lahore' })).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(canvas.getByRole('button', { name: 'Islamabad' }));
    await expect(canvas.getAllByRole('button', { pressed: true }).map((chip) => chip.textContent)).toEqual(['Islamabad']);
  },
};

export const SingleOnLight: Story = { ...Single, globals: { surface: 'light' } };

/** At 390 the chips wrap and nothing scrolls sideways. */
export const Phone: Story = {
  ...Default,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
