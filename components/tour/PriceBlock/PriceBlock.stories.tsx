import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { PriceBlock } from './PriceBlock';

const meta = {
  title: 'Tour/PriceBlock',
  component: PriceBlock,
  args: { amount: 145000 },
} satisfies Meta<typeof PriceBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Read as one line: "from PKR 145,000 per person". */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('p')).toHaveTextContent('fromPKR 145,000per person');
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** In the hero facts: a label above says "from", so the block shows the amount and its note. */
export const Fact: Story = {
  args: { size: 'fact', from: false, note: 'per person, twin sharing' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('p')).toHaveTextContent(/^PKR 145,000per person, twin sharing$/);
  },
};

export const FactOnLight: Story = { ...Fact, globals: { surface: 'light' } };

/** The booking panel's larger price. */
export const Panel: Story = {
  args: { size: 'panel', note: 'per person · twin sharing' },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('p')).toHaveTextContent('fromPKR 145,000per person · twin sharing');
  },
};

export const PanelOnLight: Story = { ...Panel, globals: { surface: 'light' } };
