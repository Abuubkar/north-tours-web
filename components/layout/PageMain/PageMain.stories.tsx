import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { PageMain } from './PageMain';

const meta = {
  title: 'Layout/PageMain',
  component: PageMain,
  args: { children: <h1>Page content</h1> },
} satisfies Meta<typeof PageMain>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The skip link's target: <main id="main">, focusable from script but not in the tab order. */
export const Default: Story = {
  play: async ({ canvas }) => {
    const main = canvas.getByRole('main');
    await expect(main).toHaveAttribute('id', 'main');
    await expect(main).toHaveAttribute('tabindex', '-1');
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
