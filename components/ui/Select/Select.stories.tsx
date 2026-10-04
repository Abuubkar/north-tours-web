import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Select } from './Select';
import type { SelectProps } from './Select.types';
import styles from '../stories.module.css';

const options = [
  { value: '2099-05-12', label: '12–20 May · 3 of 16 seats left' },
  { value: '2099-05-26', label: '26 May – 3 Jun · 9 of 16 seats left' },
];

/** Holds the value, as the booking panel does. */
function Controlled(props: SelectProps) {
  const [value, setValue] = useState(props.value);
  return (
    <Select
      {...props}
      value={value}
      onChange={(next) => {
        setValue(next);
        props.onChange(next);
      }}
    />
  );
}

const meta = {
  title: 'Base/Select',
  component: Select,
  args: { label: 'Departure date', placeholder: 'Choose a departure', options, value: null, onChange: fn() },
  render: (args) => (
    <div className={styles.aside}>
      <Controlled {...args} />
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Named by its label; the placeholder shows until a date is chosen, and choosing one calls back. */
export const Empty: Story = {
  play: async ({ canvas, args, userEvent }) => {
    const select = canvas.getByRole('combobox', { name: 'Departure date' });
    await expect(select).toHaveValue('');
    await expect(canvas.getByRole('option', { name: 'Choose a departure' })).toBeDisabled();
    await userEvent.selectOptions(select, '26 May – 3 Jun · 9 of 16 seats left');
    await expect(args.onChange).toHaveBeenCalledWith('2099-05-26');
    await expect(select).toHaveValue('2099-05-26');
    await expect(select.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const EmptyOnLight: Story = { ...Empty, globals: { surface: 'light' } };

/** A value chosen: its border strengthens to the text colour. */
export const Chosen: Story = {
  args: { value: '2099-05-12' },
  play: async ({ canvas }) => {
    const select = canvas.getByRole('combobox', { name: 'Departure date' });
    await expect(select).toHaveDisplayValue('12–20 May · 3 of 16 seats left');
    await expect(getComputedStyle(select).borderColor).toBe(getComputedStyle(select).color);
  },
};

export const ChosenOnLight: Story = { ...Chosen, globals: { surface: 'light' } };
