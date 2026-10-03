import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { KeyValueRow } from './KeyValueRow';

const meta = {
  title: 'Base/KeyValueRow',
  component: KeyValueRow,
  args: { label: 'Phone', children: '+92 42 3578 1234' },
  render: (args) => (
    <dl>
      <KeyValueRow {...args} />
      <KeyValueRow label="Email">hello@example.pk</KeyValueRow>
      <KeyValueRow label="Office">
        12 Main Boulevard, Gulberg, Lahore
        <br />
        Mon–Sat, 10 am – 7 pm
      </KeyValueRow>
    </dl>
  ),
} satisfies Meta<typeof KeyValueRow>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Labels pair with their values as a description list. */
export const List: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getAllByRole('term').map((term) => term.textContent)).toEqual(['Phone', 'Email', 'Office']);
    await expect(canvas.getAllByRole('definition')[0]).toHaveTextContent('+92 42 3578 1234');
  },
};

export const ListOnLight: Story = { ...List, globals: { surface: 'light' } };

/** A value can be a link. */
export const WithLink: Story = {
  args: { children: <a href="tel:+924235781234">+92 42 3578 1234</a> },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
  },
};

export const WithLinkOnLight: Story = { ...WithLink, globals: { surface: 'light' } };
