import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Chip } from '../Chip/Chip';
import { Input } from '../Input/Input';
import { FormField } from './FormField';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/FormField',
  component: FormField,
  args: {
    id: 'name',
    label: 'Name',
    hint: 'Required',
    children: ({ id, describedBy, invalid }) => <Input id={id} aria-describedby={describedBy} invalid={invalid} placeholder="Your name" />,
  },
  render: (args) => (
    <div className={styles.card}>
      <FormField {...args} />
    </div>
  ),
} satisfies Meta<typeof FormField>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A field: the <label> names the control and the hint describes it. */
export const Field: Story = {
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAccessibleDescription('Required');
    await expect(canvas.queryByText('!')).toBeNull();
  },
};

export const FieldOnLight: Story = { ...Field, globals: { surface: 'light' } };

/** With an error: the "!" badge and the message, linked and marked invalid; plain text, not an alert. */
export const FieldError: Story = {
  args: { error: 'Add your name so we know who to reply to.' },
  play: async ({ canvas }) => {
    const input = canvas.getByRole('textbox', { name: 'Name' });
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription('Required Add your name so we know who to reply to.');
    await expect(canvas.getByText('!')).toBeVisible();
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

export const FieldErrorOnLight: Story = { ...FieldError, globals: { surface: 'light' } };

/** A group: a <fieldset> named by its legend; the hint describes the group, not its name. */
export const Group: Story = {
  args: {
    id: 'type',
    kind: 'group',
    label: 'Group type',
    hint: 'Optional',
    children: () => (
      <div className={styles.row}>
        <Chip variant="toggle" pressed={false}>
          Family
        </Chip>
        <Chip variant="toggle" pressed>
          Friends
        </Chip>
      </div>
    ),
  },
  play: async ({ canvas }) => {
    const group = canvas.getByRole('group', { name: 'Group type' });
    await expect(group).toHaveAccessibleDescription('Optional');
    await expect(canvas.getByText('Optional')).toBeVisible();
  },
};

export const GroupOnLight: Story = { ...Group, globals: { surface: 'light' } };

/** A group with an error above its controls (a tall group): the group is described by it too. */
export const GroupError: Story = {
  args: { ...Group.args, error: 'Choose at least one.', errorAt: 'start' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('group', { name: 'Group type' })).toHaveAccessibleDescription('Optional Choose at least one.');
    const message = canvas.getByText('Choose at least one.');
    const chip = canvas.getByRole('button', { name: 'Family' });
    await expect(message.getBoundingClientRect().bottom).toBeLessThanOrEqual(chip.getBoundingClientRect().top);
  },
};

export const GroupErrorOnLight: Story = { ...GroupError, globals: { surface: 'light' } };
