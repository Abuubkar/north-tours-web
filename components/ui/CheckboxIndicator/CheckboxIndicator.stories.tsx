import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { CheckboxIndicator } from './CheckboxIndicator';

const meta = {
  title: 'Base/CheckboxIndicator',
  component: CheckboxIndicator,
  args: { checked: false },
} satisfies Meta<typeof CheckboxIndicator>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Off: an empty 18px square at the input radius, hidden from screen readers (its option says it). */
export const Off: Story = {
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[aria-hidden="true"]')!;
    await expect(box.getBoundingClientRect().width).toBe(18);
    await expect(getComputedStyle(box).borderRadius).toBe('2px');
    await expect(box.querySelector('svg')).toBeNull();
  },
};

export const OffOnLight: Story = { ...Off, globals: { surface: 'light' } };

/** On: filled in the text colour with a ✓. */
export const On: Story = {
  args: { checked: true },
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('[aria-hidden="true"]') as HTMLElement;
    await expect(box.querySelector('svg')).not.toBeNull();
    await expect(getComputedStyle(box).backgroundColor).toBe(getComputedStyle(box.parentElement!).color);
  },
};

export const OnOnLight: Story = { ...On, globals: { surface: 'light' } };
