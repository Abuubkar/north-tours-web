import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { OptionRow } from './OptionRow';
import type { OptionRowProps } from './OptionRow.types';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Filters/OptionRow',
  component: OptionRow,
  args: { label: 'Hunza', count: 3, name: 'Hunza, 3 trips', pressed: false, indicator: 'check', onClick: fn() },
  decorators: [
    (Story) => (
      <div className={styles.card}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OptionRow>;

export default meta;
type Story = StoryObj<typeof meta>;
type RenderStory = StoryObj;

function Toggle(props: Omit<OptionRowProps, 'pressed' | 'onClick'>) {
  const [pressed, setPressed] = useState(false);
  return <OptionRow {...props} pressed={pressed} onClick={() => setPressed(!pressed)} />;
}

/** A filter option: a checkbox, the label and its count, named "Hunza, 3 trips"; a 44px row. */
export const Check: Story = {
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Hunza, 3 trips' });
    await expect(row).toHaveAttribute('aria-pressed', 'false');
    await expect(row.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
  },
};

export const CheckOnLight: Story = { ...Check, globals: { surface: 'light' } };

/** Pressed: the raised surface, never gold, and a ticked box. */
export const CheckPressed: Story = {
  args: { pressed: true },
  play: async ({ canvas }) => {
    const row = canvas.getByRole('button', { name: 'Hunza, 3 trips' });
    await expect(getComputedStyle(row).backgroundColor).toBe('rgb(18, 26, 31)');
  },
};

export const CheckPressedOnLight: Story = {
  args: { pressed: true },
  globals: { surface: 'light' },
};

/** A sort or month option: a circle, and no count. */
export const Radio: Story = {
  args: { label: 'Price: low to high', count: undefined, name: undefined, indicator: 'radio', pressed: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Price: low to high' })).toHaveAttribute('aria-pressed', 'true');
  },
};

export const RadioOnLight: Story = { ...Radio, globals: { surface: 'light' } };

/** In the sort sheet: a 56px row at the body size. */
export const SheetRow: Story = {
  args: { label: 'Shortest first', count: undefined, name: undefined, indicator: 'radio', size: 'sheet' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('button', { name: 'Shortest first' }).getBoundingClientRect().height).toBeGreaterThanOrEqual(56);
  },
};

/** Clicking or pressing Space (a real key press) toggles it. */
export const Toggles: RenderStory = {
  render: () => <Toggle label="Family" count={2} name="Family, 2 trips" indicator="check" />,
  play: async ({ canvas, userEvent }) => {
    const row = canvas.getByRole('button', { name: 'Family, 2 trips' });
    await userEvent.click(row);
    await expect(row).toHaveAttribute('aria-pressed', 'true');
    const user = await realUser();
    if (!user) return;
    row.focus();
    await user.keyboard(' ');
    await expect(row).toHaveAttribute('aria-pressed', 'false');
  },
};

export const SheetRowOnLight: Story = { ...SheetRow, globals: { surface: 'light' } };
