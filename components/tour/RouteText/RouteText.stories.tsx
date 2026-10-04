import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { RouteText } from './RouteText';

const meta = {
  title: 'Tour/RouteText',
  component: RouteText,
  args: { stops: ['Lahore', 'Hunza', 'Skardu'] },
  render: (args) => (
    <p>
      <RouteText {...args} />
    </p>
  ),
} satisfies Meta<typeof RouteText>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The arrows show but aren't read; the words are read but don't show. */
export const Default: Story = {
  play: async ({ canvas, canvasElement }) => {
    const shown = canvas.getByText('Lahore → Hunza → Skardu');
    await expect(shown).toBeVisible();
    await expect(shown).toHaveAttribute('aria-hidden', 'true');
    const spoken = canvas.getByText('Lahore to Hunza to Skardu');
    await expect(spoken.getBoundingClientRect().width).toBeLessThanOrEqual(1);
    await expect(canvasElement.querySelector('p')!.getBoundingClientRect().height).toBeGreaterThan(0);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };
