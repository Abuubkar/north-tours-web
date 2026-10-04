import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { FieldError } from './FieldError';
import styles from '../stories.module.css';

const meta = {
  title: 'Base/FieldError',
  component: FieldError,
  args: { id: 'phone-error', message: 'This number looks incomplete (5 of 10 digits). Pakistani mobile numbers have 10 digits after +92, for example 3XX XXX XXXX.' },
  render: (args) => (
    <div className={styles.card}>
      <FieldError {...args} />
    </div>
  ),
} satisfies Meta<typeof FieldError>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The "!" badge in the error colour and the message, which wraps beside it; never colour alone. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const badge = canvas.getByText('!');
    await expect(badge.getBoundingClientRect().width).toBe(20);
    await expect(canvas.getByText(/looks incomplete/)).toBeVisible();
    await expect(canvas.queryByRole('alert')).toBeNull();
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
