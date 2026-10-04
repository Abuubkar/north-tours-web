import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { Button } from '@/components/ui/Button/Button';
import { TrustStrip } from '../TrustStrip/TrustStrip';
import { ClosingCta } from './ClosingCta';

const meta = {
  title: 'Sections/ClosingCta',
  component: ClosingCta,
  args: {
    id: 'book',
    headline: 'Hold your seats with a 30% advance',
    lead: 'Or message us first. Most families plan this trip with us on WhatsApp.',
    actions: (
      <Button href="#dates" size={56} arrow>
        Reserve with 30% advance
      </Button>
    ),
    children: <TrustStrip variant="mini" settings={placeholderSettings} year={2026} />,
  },
  parameters: { fullBleed: true },
} satisfies Meta<typeof ClosingCta>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The H2, the lead, the buttons, and the mini trust strip with the licence placeholder and "Cash · Bank transfer". */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Hold your seats with a 30% advance' })).toBeVisible();
    await expect(canvas.getByText('No. [DTS licence number]')).toBeVisible();
    await expect(canvas.getByText('Cash · Bank transfer')).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const PhoneOnLight: Story = { ...Phone, globals: { surface: 'light', viewport: { value: 'phone' } } };
