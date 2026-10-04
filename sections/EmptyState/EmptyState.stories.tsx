import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';
import { Button } from '@/components/ui/Button/Button';
import { sampleToursCopy } from '@/components/filters/sampleFilters';
import { EmptyState } from './EmptyState';

const onClear = fn();

const toursActions = (
  <>
    <Button onClick={onClear}>{sampleToursCopy.empty.clearLabel}</Button>
    <Button href="/plan" variant="secondary">
      {sampleToursCopy.empty.planLabel}
    </Button>
  </>
);

const meta = {
  title: 'Sections/EmptyState',
  component: EmptyState,
  args: { headline: sampleToursCopy.empty.headline, lead: sampleToursCopy.empty.lead, actions: toursActions },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tours: the fixed headline as an <h2>, the lead, "Clear all filters" and "Plan a private trip" (to the planner). */
export const Desktop: Story = {
  play: async ({ canvas, userEvent }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'No trips match these filters yet.' })).toBeVisible();
    await expect(canvas.getByText(/Tell us what you’re looking for/)).toBeVisible();
    await expect(canvas.getByRole('link', { name: 'Plan a private trip' })).toHaveAttribute('href', '/plan');
    await userEvent.click(canvas.getByRole('button', { name: 'Clear all filters' }));
    await expect(onClear).toHaveBeenCalled();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the buttons wrap, each at least 52px tall, and nothing scrolls sideways. */
export const Phone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    for (const button of [canvas.getByRole('button', { name: 'Clear all filters' }), canvas.getByRole('link', { name: 'Plan a private trip' })]) {
      await expect(button.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    }
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

const helpMessage = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

/** Help (light): "No answers for that yet." at the standard size, "Ask on WhatsApp" with the general message, and "Clear search". */
export const Help: Story = {
  args: {
    headline: 'No answers for that yet.',
    lead: 'Ask us directly and we’ll reply on WhatsApp within 2 hours. We often add the answer here afterwards.',
    actions: (
      <>
        <Button href={helpMessage} icon="whatsapp">
          Ask on WhatsApp
        </Button>
        <Button variant="secondary" onClick={onClear}>
          Clear search
        </Button>
      </>
    ),
  },
  globals: { surface: 'light', viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    const headline = canvas.getByRole('heading', { level: 2, name: 'No answers for that yet.' });
    // The section headline size, not the design's clamp(28px, 3cqi, 40px).
    await expect(parseFloat(getComputedStyle(headline).fontSize)).toBeGreaterThanOrEqual(34);
    await expect(canvas.getByRole('link', { name: 'Ask on WhatsApp' })).toHaveAttribute('href', helpMessage);
    await expect(canvas.getByRole('button', { name: 'Clear search' })).toBeVisible();
  },
};

export const HelpOnDark: Story = { ...Help, globals: { surface: 'dark', viewport: { value: 'desktop' } } };

export const HelpPhone: Story = { ...Help, globals: { surface: 'light', viewport: { value: 'phone' } } };
