import type { ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { emulateFullMotion, emulateReducedMotion } from '../../../.storybook/reducedMotion';
import { ON_TRIP_ANCHOR } from '@/lib/routes';
import { OnTripPanel } from '../OnTripPanel/OnTripPanel';
import type { OnTripPanelProps } from '../OnTripPanel/OnTripPanel.types';
import { sampleOnTrip } from '../sampleOnTrip';
import { OnTripMobileBanner } from './OnTripMobileBanner';
import styles from '../../ui/stories.module.css';

const panel: OnTripPanelProps = sampleOnTrip;

/** The banner at the top, then room, then the panel well below the fold, as on the page. */
function withPanel(props: OnTripPanelProps) {
  return function PanelBelow(Story: () => ReactNode) {
    return (
      <>
        <Story />
        <div className={styles.scrollRoom} />
        <OnTripPanel {...props} />
        <div className={styles.scrollRoom} />
      </>
    );
  };
}

const meta = {
  title: 'Contact/OnTripMobileBanner',
  component: OnTripMobileBanner,
  args: { text: 'On a trip right now? Get help' },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'phone' } },
  beforeEach: async () => {
    await emulateReducedMotion();
    window.scrollTo(0, 0);
  },
} satisfies Meta<typeof OnTripMobileBanner>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The header's height: the panel lands just below it. */
const headerHeight = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);

const lands = async (target: HTMLElement) => {
  const top = document.getElementById(ON_TRIP_ANCHOR)!.getBoundingClientRect().top;
  await expect(top).toBeGreaterThanOrEqual(headerHeight() - 1);
  await expect(top).toBeLessThanOrEqual(headerHeight() + 1);
  await expect(target).toHaveFocus();
};

/**
 * At 390, with the placeholder number: Enter on the 52px banner lands the panel below the header
 * at once (reduced motion: no smooth scroll) and focuses the panel's heading.
 */
export const ToHeading: Story = {
  decorators: [withPanel(panel)],
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('link', { name: 'On a trip right now? Get help' });
    await expect(banner).toHaveAttribute('href', `#${ON_TRIP_ANCHOR}`);
    await expect(banner.getBoundingClientRect().height).toBeGreaterThanOrEqual(52);
    const keys = await realUser();
    banner.focus();
    if (keys) await keys.keyboard('{Enter}');
    else banner.click();
    // Instant: no animation frames needed before it's in place.
    await lands(canvas.getByRole('heading', { level: 2, name: 'On a trip right now?' }));
    await expect(window.location.hash).toBe('');
  },
};

export const ToHeadingOnLight: Story = { ...ToHeading, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** With a real number, the banner focuses "Call travel support"; with full motion the scroll is smooth and ends in the same place. */
export const ToCallButton: Story = {
  decorators: [withPanel({ ...panel, support: { value: '+92 321 7654321', href: 'tel:+923217654321' } })],
  beforeEach: async () => {
    await emulateFullMotion();
    window.scrollTo(0, 0);
    return emulateReducedMotion;
  },
  play: async ({ canvas }) => {
    const banner = canvas.getByRole('link', { name: 'On a trip right now? Get help' });
    const keys = await realUser();
    banner.focus();
    if (keys) await keys.keyboard('{Enter}');
    else banner.click();
    const call = canvas.getByRole('link', { name: 'Call travel support' });
    await expect(call).toHaveFocus();
    // Smooth: still on its way just after the press, then in place.
    await expect(window.scrollY).toBeLessThan(document.getElementById(ON_TRIP_ANCHOR)!.offsetTop - headerHeight() - 1);
    await waitFor(() => lands(call), { timeout: 3000 });
  },
};

/** At 1440 the banner isn't shown (the panel is in view without it). */
export const NotOnDesktop: Story = {
  decorators: [withPanel(panel)],
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link', { name: 'On a trip right now? Get help' })).toBeNull();
  },
};

export const ToCallButtonOnLight: Story = { ...ToCallButton, globals: { surface: 'light', viewport: { value: 'phone' } } };

export const NotOnDesktopOnLight: Story = { ...NotOnDesktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };
