import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { fillTokens, settingsTokens } from '@/lib/utils/tokens';
import { sampleHome } from '../sampleHome';
import { HowBookingWorks } from './HowBookingWorks';

const tokens = settingsTokens(placeholderSettings);

const meta = {
  title: 'Sections/HowBookingWorks',
  component: HowBookingWorks,
  args: {
    copy: { ...sampleHome.how, steps: sampleHome.how.steps.map((s) => ({ ...s, text: fillTokens(s.text, tokens) })) },
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof HowBookingWorks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** An ordered list of four steps; step 3 has the advance and the payment methods from settings. */
export const Desktop: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'How booking works' })).toBeVisible();
    const steps = within(canvas.getByRole('list')).getAllByRole('listitem');
    await expect(canvas.getByRole('list').tagName).toBe('OL');
    await expect(steps).toHaveLength(4);
    await expect(steps[2]).toHaveTextContent('Hold your seats with a 30% advance, paid by cash or bank transfer.');
    await expect(steps[3]).toHaveTextContent('[Pickup point], Lahore');
    await expect(canvas.queryByText(/JazzCash|Easypaisa/)).toBeNull();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** The first step's text lines up with the page margin (the bleed holds), at any column count. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    const heading = context.canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    const title = context.canvas.getAllByRole('heading', { level: 3 })[0].getBoundingClientRect();
    await expect(Math.round(title.left)).toBe(Math.round(heading.left));
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const DesktopAligned: Story = { ...Phone, globals: { viewport: { value: 'desktop' } } };
