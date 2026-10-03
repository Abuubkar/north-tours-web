import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Stepper } from './Stepper';

function TravellersDemo({ initial, min = 1, max = 16 }: { initial: number; min?: number; max?: number }) {
  const [value, setValue] = useState(initial);
  return (
    <Stepper
      label="Travellers"
      value={value}
      min={min}
      max={max}
      onChange={setValue}
      decreaseLabel="Fewer travellers"
      increaseLabel="More travellers"
    />
  );
}

const meta = {
  title: 'Base/Stepper',
  component: Stepper,
} satisfies Meta<typeof Stepper>;

export default meta;
type RenderStory = StoryObj;

export const Default: RenderStory = { render: () => <TravellersDemo initial={2} /> };

export const OnLight: RenderStory = {
  render: () => <TravellersDemo initial={2} />,
  globals: { surface: 'light' },
};

/** At the minimum, − is unavailable and pressing it changes nothing. */
export const AtMinimum: RenderStory = {
  render: () => <TravellersDemo initial={2} min={1} />,
  play: async ({ canvas, userEvent }) => {
    const fewer = canvas.getByRole('button', { name: 'Fewer travellers' });
    const value = canvas.getByRole('status');
    await userEvent.click(fewer);
    await expect(value).toHaveTextContent('1');
    await expect(fewer).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(fewer);
    await expect(value).toHaveTextContent('1');
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(value).toHaveTextContent('1');
    // Focus stays on the button at its limit, so keyboard users don't lose their place.
    await expect(fewer).toHaveFocus();
  },
};

export const AtMinimumOnLight: RenderStory = { ...AtMinimum, globals: { surface: 'light' } };

/** At the maximum, + is unavailable, by mouse and by keyboard. */
export const AtMaximum: RenderStory = {
  render: () => <TravellersDemo initial={14} max={16} />,
  play: async ({ canvas, userEvent }) => {
    const more = canvas.getByRole('button', { name: 'More travellers' });
    const value = canvas.getByRole('status');
    more.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    await expect(value).toHaveTextContent('16');
    await expect(more).toHaveAttribute('aria-disabled', 'true');
    await userEvent.keyboard('{Enter}');
    await expect(value).toHaveTextContent('16');
    await expect(canvas.getByRole('button', { name: 'Fewer travellers' })).not.toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
};

export const AtMaximumOnLight: RenderStory = { ...AtMaximum, globals: { surface: 'light' } };

/** The group is named, and the value is announced politely when it changes. */
export const Announced: RenderStory = {
  render: () => <TravellersDemo initial={2} />,
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('group', { name: 'Travellers' })).toBeInTheDocument();
    const value = canvas.getByRole('status');
    await expect(value).toHaveAttribute('aria-live', 'polite');
    await userEvent.click(canvas.getByRole('button', { name: 'More travellers' }));
    await expect(value).toHaveTextContent('3');
  },
};
