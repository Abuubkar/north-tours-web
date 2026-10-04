import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { SectionLabel } from './SectionLabel';

const meta = {
  title: 'Base/SectionLabel',
  component: SectionLabel,
  args: { children: 'Contact' },
} satisfies Meta<typeof SectionLabel>;

export default meta;
type Story = StoryObj<typeof meta>;

/** A label, not a heading: it names a section that has no headline. */
export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Contact')).toBeVisible();
    await expect(canvas.queryByRole('heading')).toBeNull();
  },
};

export const OnLight: Story = { ...Default, globals: { surface: 'light' } };

/** As a section's heading (About's "Credentials"): an <h2> with the label's look. */
export const AsHeading: Story = {
  args: { children: 'Credentials', as: 'h2' },
  play: async ({ canvas }) => {
    const heading = canvas.getByRole('heading', { level: 2, name: 'Credentials' });
    await expect(getComputedStyle(heading).fontSize).toBe('13px');
  },
};

export const AsHeadingOnLight: Story = { ...AsHeading, globals: { surface: 'light' } };
