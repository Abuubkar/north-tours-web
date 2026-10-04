import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { sampleTour } from '@/components/tour-card/sampleTours';
import { fillTokens, settingsTokens } from '@/lib/utils/tokens';
import { realUser } from '../../.storybook/realUser';
import { FaqSection } from './FaqSection';

/** The shared booking question as content/faqs.json words it, filled from settings. */
const payment = {
  question: 'How do payment and the advance work?',
  answer: fillTokens(
    'Pay a {advancePercent}% advance to confirm your seats, by {paymentMethods}. The balance is due {balanceDueDays} days before departure.',
    settingsTokens(placeholderSettings),
  ),
};

const meta = {
  title: 'Sections/FaqSection',
  component: FaqSection,
  args: { headline: 'Questions people ask before booking', questions: [...sampleTour.faqs, payment] },
  parameters: { fullBleed: true },
} satisfies Meta<typeof FaqSection>;

export default meta;
type Story = StoryObj<typeof meta>;

const items = (canvasElement: HTMLElement) => [...canvasElement.querySelectorAll('details')];

/** A light section (#faqs): the first question open; opening another closes it. */
export const Desktop: Story = {
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Questions people ask before booking' })).toBeVisible();
    await expect(canvasElement.querySelector('section')).toHaveAttribute('data-surface', 'light');
    const [first, , last] = items(canvasElement);
    await expect(first).toHaveAttribute('open');
    await expect(canvas.getByText(/advance to confirm your seats, by cash or bank transfer\./)).toBeInTheDocument();
    const user = await realUser();
    if (!user) return;
    await user.click(canvas.getByText('How do payment and the advance work?'));
    await waitFor(() => expect(last).toHaveAttribute('open'));
    await expect(first).not.toHaveAttribute('open');
  },
};

export const DesktopOnDark: Story = { ...Desktop, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const Phone: Story = { ...Desktop, globals: { viewport: { value: 'phone' } } };
