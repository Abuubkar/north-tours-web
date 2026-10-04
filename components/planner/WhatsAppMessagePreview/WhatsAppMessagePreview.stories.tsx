import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { WhatsAppMessagePreview } from './WhatsAppMessagePreview';

const message = [
  'Assalam o Alaikum! I’d like to plan a private trip.',
  '• Destinations: Hunza',
  '• Notes: We are celebrating our parents’ fortieth anniversary and would love a quiet dinner with a view of Rakaposhi on the last night, if that can be arranged.',
  'Name: Ayesha Khan',
].join('\n');

const meta = {
  title: 'Planner/WhatsAppMessagePreview',
  component: WhatsAppMessagePreview,
  args: { title: 'Message preview', message, note: 'Opens WhatsApp with this message ready to send. Nothing is sent until you press send there.' },
} satisfies Meta<typeof WhatsAppMessagePreview>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The exact message with its line breaks, at most 560px wide, a long note wrapped. */
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const box = canvasElement.querySelector('figure p')!;
    await expect(box.textContent).toBe(message);
    await expect(getComputedStyle(box).whiteSpace).toBe('pre-wrap');
    await expect(box.getBoundingClientRect().width).toBeLessThanOrEqual(560);
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

export const Phone: Story = {
  ...Default,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};
