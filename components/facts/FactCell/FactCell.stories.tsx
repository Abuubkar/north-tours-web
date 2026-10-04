import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { FactCell } from './FactCell';

/** A cell is a label and value pair, so stories place it in the <dl> it needs. */
const meta = {
  title: 'Facts/FactCell',
  component: FactCell,
  args: { label: 'Duration', children: '9 days, 8 nights' },
  render: (args) => (
    <dl>
      <FactCell {...args} />
    </dl>
  ),
} satisfies Meta<typeof FactCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Under a photo hero's title. */
export const Hero: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Duration', { selector: 'dt' }).nextElementSibling).toHaveTextContent('9 days, 8 nights');
  },
};

export const HeroOnLight: Story = { ...Hero, globals: { surface: 'light' } };

/** In the quick facts strip: a smaller value. */
export const Strip: Story = {
  args: { label: 'Difficulty', children: 'Easy walking, long road days', size: 'strip' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Difficulty', { selector: 'dt' }).nextElementSibling).toHaveTextContent(
      'Easy walking, long road days',
    );
  },
};

export const StripOnLight: Story = { ...Strip, globals: { surface: 'light' } };
