import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { FormField } from '../FormField/FormField';
import { Input } from './Input';
import type { InputProps } from './Input.types';
import styles from '../stories.module.css';

/** An Input named by a FormField, holding its own value. */
function Field({ error, initial = '', ...props }: InputProps & { error?: string; initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <div className={styles.card}>
      <FormField id="name" label={props.type === 'date' ? 'From' : 'Name'} hint="Required" error={error}>
        {({ id, describedBy, invalid }) => (
          <Input {...props} id={id} aria-describedby={describedBy} invalid={invalid} value={value} onChange={(e) => setValue(e.target.value)} />
        )}
      </FormField>
    </div>
  );
}

const meta = {
  title: 'Base/Input',
  component: Field,
  args: { placeholder: 'Your name' },
} satisfies Meta<typeof Field>;

export default meta;
type Story = StoryObj<typeof meta>;

const border = (el: Element) => getComputedStyle(el).borderTopColor;

/** Empty: named by its label, the hint read as its description, 52px tall; real keys type into it. */
export const Empty: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAccessibleDescription('Required');
    await expect(input).not.toHaveAttribute('aria-invalid');
    await expect(input.getBoundingClientRect().height).toBe(52);
    const user = await realUser();
    if (!user) return;
    await user.click(input);
    await user.keyboard('Ayesha Khan');
    await expect(input).toHaveValue('Ayesha Khan');
  },
};

export const EmptyOnLight: Story = { ...Empty, globals: { surface: 'light' } };

/** Filled: the border strengthens to the text colour. */
export const Filled: Story = {
  args: { initial: 'Ayesha Khan' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(border(input)).toBe(getComputedStyle(input).color);
  },
};

export const FilledOnLight: Story = { ...Filled, globals: { surface: 'light' } };

/** Hover (a real pointer): the border strengthens too. */
export const Hover: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await user.hover(input);
    await expect(border(input)).toBe(getComputedStyle(input).color);
  },
};

export const HoverOnLight: Story = { ...Hover, globals: { surface: 'light' } };

/** Focus (a real Tab): the 2px focus ring in the text colour (DESIGN.md §11). */
export const Focus: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await user.keyboard('{Tab}');
    await expect(input).toHaveFocus();
    await expect(getComputedStyle(input).outlineWidth).toBe('2px');
    await expect(getComputedStyle(input).outlineColor).toBe(getComputedStyle(input).color);
  },
};

export const FocusOnLight: Story = { ...Focus, globals: { surface: 'light' } };

/** Error: aria-invalid, the error colour, and the message read after the hint. */
export const Invalid: Story = {
  args: { error: 'Add your name so we know who to reply to.' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Required Add your name so we know who to reply to.');
    await expect(canvas.getByText('Add your name so we know who to reply to.')).toBeVisible();
    await expect(border(input)).not.toBe(getComputedStyle(input).color);
  },
};

export const InvalidOnLight: Story = { ...Invalid, globals: { surface: 'light' } };

/** A date: the surface's own picker (light on the light page), and no date before `min`. */
export const DateField: Story = {
  args: { type: 'date', placeholder: undefined, min: '2026-10-04', initial: '2026-10-12' },
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input')!;
    await expect(input).toHaveAccessibleName('From');
    await expect(input).toHaveAttribute('min', '2026-10-04');
    await expect(input).toHaveValue('2026-10-12');
    const surface = input.closest('[data-surface]')!.getAttribute('data-surface');
    await expect(getComputedStyle(input).colorScheme).toBe(surface);
  },
};

export const DateFieldOnLight: Story = { ...DateField, globals: { surface: 'light' } };

export const DateInvalid: Story = {
  args: { ...DateField.args, error: 'That date has passed. Choose today or later.' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('input')).toHaveAttribute('aria-invalid', 'true');
  },
};

export const DateInvalidOnLight: Story = { ...DateInvalid, globals: { surface: 'light' } };

/** A search field (Help's), filled: 52px, a searchbox to assistive tech, with the --fg border once filled. */
export const Search: Story = {
  args: { type: 'search', initial: 'refund', placeholder: 'Search questions' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('searchbox', { name: 'Name' });
    await expect(input).toHaveValue('refund');
    await expect(input.getBoundingClientRect().height).toBe(52);
    await expect(border(input)).toBe(getComputedStyle(input).color);
  },
};

export const SearchOnLight: Story = { ...Search, globals: { surface: 'light' } };
