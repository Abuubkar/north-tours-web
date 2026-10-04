import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { placeholderSettings } from '@/components/layout/sampleSettings';
import { Button } from '@/components/ui/Button/Button';
import { PlanningActions } from '@/components/about/PlanningActions/PlanningActions';
import { AskActions } from '@/components/help/AskActions/AskActions';
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

/** About: the headline at the statement size with no lead, then "Explore tours" and "Plan a private trip". */
export const About: Story = {
  args: {
    id: undefined,
    headline: 'Start planning your trip north',
    lead: undefined,
    actions: <PlanningActions exploreLabel="Explore tours" planLabel="Plan a private trip" />,
    children: undefined,
  },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'Start planning your trip north' });
    await expect(parseFloat(getComputedStyle(headline).fontSize)).toBeGreaterThanOrEqual(40);
    await expect(canvasElement.querySelector('section p')).toBeNull();
    await expect(canvas.getByRole('link', { name: /Explore tours/ })).toHaveAttribute('href', '/tours');
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan');
  },
};

export const AboutOnLight: Story = { ...About, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const AboutPhone: Story = { ...About, globals: { viewport: { value: 'phone' } } };

export const AboutPhoneOnLight: Story = { ...About, globals: { surface: 'light', viewport: { value: 'phone' } } };

const generalMessage = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

/**
 * Help: the headline at the statement size, the reply time and phone hours, "Ask on WhatsApp"
 * with the general message, and no "Call us" while the phone number is a placeholder.
 */
export const Help: Story = {
  args: {
    id: undefined,
    headline: 'Still have a question? Ask us on WhatsApp',
    lead: 'We reply on WhatsApp within 2 hours. Phone lines are open [Mon–Sat, X am – X pm].',
    actions: <AskActions askLabel="Ask on WhatsApp" askHref={generalMessage} callLabel="Call us" callHref={undefined} />,
    children: undefined,
  },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'Still have a question? Ask us on WhatsApp' });
    await expect(parseFloat(getComputedStyle(headline).fontSize)).toBeGreaterThanOrEqual(40);
    const ask = canvas.getByRole('link', { name: 'Ask on WhatsApp' });
    await expect(ask).toHaveAttribute('href', generalMessage);
    await expect(ask.getBoundingClientRect().height).toBe(56);
    await expect(canvas.queryByRole('link', { name: 'Call us' })).toBeNull();
  },
};

export const HelpOnLight: Story = { ...Help, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const HelpPhone: Story = { ...Help, globals: { viewport: { value: 'phone' } } };

/** Help with a real phone number: "Call us" is a tel: link beside "Ask on WhatsApp". */
export const HelpRealPhone: Story = {
  args: {
    ...Help.args,
    actions: <AskActions askLabel="Ask on WhatsApp" askHref={generalMessage} callLabel="Call us" callHref="tel:+924235781234" />,
  },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const call = canvas.getByRole('link', { name: 'Call us' });
    await expect(call).toHaveAttribute('href', 'tel:+924235781234');
    await expect(call.getBoundingClientRect().height).toBe(56);
  },
};

export const HelpRealPhoneOnLight: Story = { ...HelpRealPhone, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const HelpRealPhonePhone: Story = { ...HelpRealPhone, globals: { viewport: { value: 'phone' } } };
