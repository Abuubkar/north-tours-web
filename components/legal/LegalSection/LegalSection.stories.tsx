import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleLegalSections } from '@/sections/sampleLegal';
import { LegalSection } from './LegalSection';

const meta = {
  title: 'Legal/LegalSection',
  component: LegalSection,
  args: sampleLegalSections[1],
  globals: { surface: 'light', viewport: { value: 'desktop' } },
} satisfies Meta<typeof LegalSection>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The heading is an <h2> with its number ("2. Cancellations and refunds"); the section carries the anchor. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: '2. Cancellations and refunds' });
    await expect(heading.closest('section')).toHaveAttribute('id', 'cancellations');
    await expect(canvasElement.querySelectorAll('p')).toHaveLength(2);
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  ...Desktop,
  globals: { surface: 'light', viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};
