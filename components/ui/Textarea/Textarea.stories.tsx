import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { FormField } from '../FormField/FormField';
import { Textarea } from './Textarea';
import styles from '../stories.module.css';

/** "Anything else?", named by its FormField, holding its own value; at most 500 characters. */
function Notes({ initial = '' }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <div className={styles.card}>
      <FormField id="notes" label="Anything else?" hint="Optional">
        {({ id, describedBy }) => (
          <Textarea
            id={id}
            aria-describedby={describedBy}
            maxLength={500}
            placeholder="Celebrating something? Travelling with elderly parents? Tell us."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        )}
      </FormField>
    </div>
  );
}

const meta = {
  title: 'Base/Textarea',
  component: Notes,
} satisfies Meta<typeof Notes>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Empty: named by its label, at least 128px tall; real keys type into it, and it stops at 500 characters. */
export const Empty: Story = {
  play: async ({ canvas }) => {
    const notes = canvas.getByRole('textbox', { name: 'Anything else?' });
    await expect(notes).toHaveAccessibleDescription('Optional');
    await expect(notes.getBoundingClientRect().height).toBeGreaterThanOrEqual(128);
    await expect(getComputedStyle(notes).resize).toBe('vertical');
    const user = await realUser();
    if (!user) return;
    await user.click(notes);
    await user.keyboard('Travelling with my mother.');
    await expect(notes).toHaveValue('Travelling with my mother.');
    await user.keyboard('x'.repeat(500));
    await expect((notes as HTMLTextAreaElement).value).toHaveLength(500);
  },
};

export const EmptyOnLight: Story = { ...Empty, globals: { surface: 'light' } };

/** Filled: the border strengthens to the text colour. */
export const Filled: Story = {
  args: { initial: 'Travelling with my mother, who prefers short walks.' },
  play: async ({ canvas }) => {
    const notes = canvas.getByRole('textbox', { name: 'Anything else?' });
    await expect(getComputedStyle(notes).borderTopColor).toBe(getComputedStyle(notes).color);
  },
};

export const FilledOnLight: Story = { ...Filled, globals: { surface: 'light' } };

/** Focus (a real Tab): the standard focus ring. */
export const Focus: Story = {
  play: async ({ canvas }) => {
    const user = await realUser();
    if (!user) return;
    await user.keyboard('{Tab}');
    const notes = canvas.getByRole('textbox', { name: 'Anything else?' });
    await expect(notes).toHaveFocus();
    await expect(getComputedStyle(notes).outlineWidth).toBe('2px');
  },
};

export const FocusOnLight: Story = { ...Focus, globals: { surface: 'light' } };
