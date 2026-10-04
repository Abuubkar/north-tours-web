import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { sampleDestinationCopy } from '@/components/destination-card/sampleDestinationCopy';
import { sampleDestination, sampleMurree } from '@/components/destination-card/sampleDestinations';
import { GettingThere } from './GettingThere';

const meta = {
  title: 'Sections/GettingThere',
  component: GettingThere,
  args: { gettingThere: sampleDestination.gettingThere, copy: sampleDestinationCopy.gettingThere },
  parameters: { fullBleed: true },
} satisfies Meta<typeof GettingThere>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2, the road's stops, then "By road" and "By air" as label and value. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Getting there from Lahore by road' })).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(args.gettingThere.stops.length);
    await expect(canvas.getAllByRole('term').map((term) => term.textContent)).toEqual(['By road', 'By air']);
    await expect(canvas.getAllByRole('definition')[1]).toHaveTextContent(args.gettingThere.byAir);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };

export const Murree: Story = { ...Desktop, args: { gettingThere: sampleMurree.gettingThere } };
