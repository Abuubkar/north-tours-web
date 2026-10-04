import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { LastUpdated } from './LastUpdated';

const meta = {
  title: 'Base/LastUpdated',
  component: LastUpdated,
  args: { template: 'Last updated {date}', date: '2026-10-04' },
} satisfies Meta<typeof LastUpdated>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The date in full, in a <time> that carries it as YYYY-MM-DD. */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByText(/^Last updated/)).toHaveTextContent('Last updated 4 October 2026');
    const time = canvasElement.querySelector('time')!;
    await expect(time).toHaveTextContent('4 October 2026');
    await expect(time).toHaveAttribute('datetime', '2026-10-04');
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };
