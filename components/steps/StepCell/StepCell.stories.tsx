import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { StepCell } from './StepCell';
import styles from '../../ui/stories.module.css';

const meta = {
  title: 'Steps/StepCell',
  component: StepCell,
  args: {
    number: 3,
    title: 'Pay the advance',
    text: 'Hold your seats with a 30% advance, paid by cash or bank transfer.',
    arrow: true,
  },
  decorators: [
    (Story) => (
      <ol className={styles.card}>
        <Story />
      </ol>
    ),
  ],
} satisfies Meta<typeof StepCell>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The numeral and arrow are decorative: the list numbers the step, and the title is a heading. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('listitem')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 3, name: 'Pay the advance' })).toBeVisible();
    await expect(canvas.getByText('03').closest('[aria-hidden="true"]')).not.toBeNull();
  },
};

export const DefaultOnLight: Story = { ...Default, globals: { surface: 'light' } };

/** The last step has no arrow. */
export const Last: Story = {
  args: { number: 4, title: 'Depart from Lahore', arrow: false },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('svg')).toBeNull();
  },
};

export const Phone: Story = { ...Default, globals: { viewport: { value: 'phone' } } };

export const Desktop: Story = { ...Default, globals: { viewport: { value: 'desktop' } } };
