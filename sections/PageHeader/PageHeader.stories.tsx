import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { HelpProvider } from '@/components/help/HelpProvider/HelpProvider';
import { HelpSearch } from '@/components/help/HelpSearch/HelpSearch';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';
import { sampleAbout } from '../sampleAbout';
import { sampleHelpCategories, sampleHelpCopy } from '../sampleHelp';
import { PageHeader } from './PageHeader';

const meta = {
  title: 'Sections/PageHeader',
  component: PageHeader,
  args: {
    headline: 'All our trips from Lahore',
    lead: 'Prices per person, twin sharing. Every departure leaves from Lahore.',
  },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PageHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The page's only <h1>, then the lead. */
export const Desktop: Story = {
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'All our trips from Lahore' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByText('Prices per person, twin sharing. Every departure leaves from Lahore.')).toBeVisible();
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const Laptop: Story = { ...Desktop, globals: { viewport: { value: 'laptop' } } };

/** At 390 the headline wraps and nothing scrolls sideways. */
export const Phone: Story = {
  ...Desktop,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Desktop.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

const plannerLead = 'Tell us what you have in mind. We’ll plan it and reply on WhatsApp, usually within 2 hours.';

/**
 * The planner's first step: the <h1> at the statement size and the lead (at most 600px wide) on a
 * photo band, dark, 360–460px tall, which starts below the site header (no negative margin) and loads first.
 */
export const Planner: Story = {
  args: { variant: 'planner', image: samplePhoto, headline: 'Your dates, your group', lead: plannerLead },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Your dates, your group' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    // The statement size: clamp(40px, 6.4cqi, 92px).
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThanOrEqual(40);
    await expect(canvas.getByText(plannerLead).getBoundingClientRect().width).toBeLessThanOrEqual(600);
    const band = h1.closest('header')!;
    await expect(band).toHaveAttribute('data-surface', 'dark');
    await expect(getComputedStyle(band).marginTop).toBe('0px');
    const { height } = band.getBoundingClientRect();
    await expect(height >= 360 && height <= 460).toBe(true);
    const photo = canvas.getByRole('img', { name: samplePhoto.alt });
    await expect(photo).toHaveAttribute('fetchpriority', 'high');
    // The text sits over the photo, at the band's foot.
    await expect(h1.getBoundingClientRect().top).toBeGreaterThan(photo.getBoundingClientRect().top);
    // About square on a phone, so no portrait crop (ADR-0033): the landscape photo everywhere.
    await expect(canvasElement.querySelectorAll('source[media]')).toHaveLength(0);
  },
};

export const PlannerOnLight: Story = { ...Planner, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const PlannerLaptop: Story = { ...Planner, globals: { viewport: { value: 'laptop' } } };

export const PlannerPhone: Story = {
  ...Planner,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Planner.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** Later steps: the same, only <h1> reads as a slim 15px line with no lead. */
export const PlannerSlim: Story = {
  args: { variant: 'plannerSlim', headline: 'Planning your private trip', lead: undefined },
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, canvasElement }) => {
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Planning your private trip' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(getComputedStyle(h1).fontSize).toBe('15px');
    await expect(canvasElement.querySelector('p')).toBeNull();
  },
};

export const PlannerSlimOnLight: Story = { ...PlannerSlim, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const PlannerSlimPhone: Story = { ...PlannerSlim, globals: { viewport: { value: 'phone' } } };

export const PlannerSlimLaptop: Story = { ...PlannerSlim, globals: { viewport: { value: 'laptop' } } };

/**
 * About: a full-bleed photo cover (owner feedback, 2026-10-05), as tall as the tour hero and
 * starting below the site header, with the one <h1> and the lead over its lower part on the scrim.
 * The photo is the page's main image: loaded straight away with high priority, its size set.
 */
export const About: Story = {
  args: { variant: 'about', headline: sampleAbout.header.headline, lead: sampleAbout.header.lead, image: sampleAbout.header.image },
  play: async ({ canvas, canvasElement }) => {
    const header = canvasElement.querySelector('header')!;
    await expect(header).toHaveAttribute('data-surface', 'dark');
    const h1 = canvas.getByRole('heading', { level: 1, name: sampleAbout.header.headline });
    await expect(h1).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    const lead = canvas.getByText(sampleAbout.header.lead);
    await expect(lead.getBoundingClientRect().width).toBeLessThanOrEqual(560);
    const img = canvas.getByRole('img', { name: sampleAbout.header.image.alt });
    await expect(img).toHaveAttribute('loading', 'eager');
    await expect(img).toHaveAttribute('fetchpriority', 'high');
    await expect(img).toHaveAttribute('width');
    await expect(img).toHaveAttribute('height');
    // Full-bleed: the photo fills the whole header, edge to edge, and starts below the site header.
    const box = header.getBoundingClientRect();
    const photo = img.getBoundingClientRect();
    await expect(Math.round(photo.width)).toBe(Math.round(box.width));
    await expect(Math.round(photo.height)).toBe(Math.round(box.height));
    await expect(getComputedStyle(header).marginTop).toBe('0px');
    await expect(box.height).toBeGreaterThanOrEqual(600);
    // The words sit over the photo's lower part.
    await expect(h1.getBoundingClientRect().top).toBeGreaterThan(box.top + box.height / 2);
    await expect(lead.getBoundingClientRect().bottom).toBeLessThanOrEqual(box.bottom);
    // A phone-tall hero: upright phones get its portrait crop (ADR-0033).
    await expect(canvasElement.querySelectorAll('source[media]').length).toBeGreaterThan(0);
  },
};

export const AboutOnLight: Story = { ...About, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const AboutLaptop: Story = { ...About, globals: { viewport: { value: 'laptop' } } };

/** At 390 the same cover, its words still over the photo, and nothing scrolls sideways. */
export const AboutPhone: Story = {
  ...About,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await About.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const AboutPhoneOnLight: Story = { ...AboutPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The legal pages (light): the document's title as the only <h1>, then "Last updated" with its date in a <time>. */
export const Legal: Story = {
  args: { variant: 'legal', headline: 'Privacy policy', lead: undefined, updated: { template: 'Last updated {date}', date: '2026-10-04' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 1, name: 'Privacy policy' })).toBeVisible();
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getByText(/^Last updated/)).toHaveTextContent('Last updated 4 October 2026');
    await expect(canvasElement.querySelector('time')).toHaveAttribute('datetime', '2026-10-04');
    await expect(canvasElement.querySelector('header')).toHaveAttribute('data-surface', 'light');
  },
};

export const LegalOnLight: Story = { ...Legal, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const LegalPhone: Story = {
  ...Legal,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Legal.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

/** Help (light): the only <h1>, at the statement size, then the search landmark under it. */
export const Help: Story = {
  args: { variant: 'help', headline: 'Help with booking, payments and the trip', lead: undefined, search: <HelpSearch copy={sampleHelpCopy.search} /> },
  decorators: [
    (Story) => (
      <HelpProvider categories={sampleHelpCategories}>
        <Story />
      </HelpProvider>
    ),
  ],
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('search')).toBeVisible();
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Help with booking, payments and the trip' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(parseFloat(getComputedStyle(h1).fontSize)).toBeGreaterThanOrEqual(40);
    await expect(canvasElement.querySelector('header')).toHaveAttribute('data-surface', 'light');
  },
};

export const HelpOnLight: Story = { ...Help, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const HelpPhone: Story = {
  ...Help,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Help.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

const contactLead = 'Most trips are planned on WhatsApp. We reply within 2 hours, [Mon–Sat, X am – X pm].';

/**
 * Contact (dark): the only <h1>, with no label before it (the owner removed it: it repeated the
 * headline), then the lead at most 600px wide.
 */
export const Contact: Story = {
  args: { variant: 'contact', headline: 'Talk to a person', lead: contactLead },
  play: async ({ canvas, canvasElement }) => {
    const h1 = canvas.getByRole('heading', { level: 1, name: 'Talk to a person' });
    await expect(canvasElement.querySelectorAll('h1')).toHaveLength(1);
    await expect(canvas.getAllByRole('heading')).toHaveLength(1);
    await expect(canvas.queryByText('Contact')).toBeNull();
    await expect(h1.previousElementSibling).toBeNull();
    await expect(canvas.getByText(contactLead).getBoundingClientRect().width).toBeLessThanOrEqual(600);
  },
};

export const ContactOnLight: Story = { ...Contact, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const ContactLaptop: Story = { ...Contact, globals: { viewport: { value: 'laptop' } } };

/** At 390 the <h1> opens the header, and nothing scrolls sideways. */
export const ContactPhone: Story = {
  ...Contact,
  globals: { viewport: { value: 'phone' } },
  play: async (context) => {
    await Contact.play!(context);
    await expect(context.canvasElement.scrollWidth).toBeLessThanOrEqual(context.canvasElement.clientWidth);
  },
};

export const ContactPhoneOnLight: Story = { ...ContactPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** Contact with real settings: the lead says the real hours. */
export const ContactRealHours: Story = {
  ...Contact,
  args: { ...Contact.args, lead: 'Most trips are planned on WhatsApp. We reply within 2 hours, Mon–Sat, 10 am – 7 pm.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/Mon–Sat, 10 am – 7 pm/)).toBeVisible();
  },
};

export const ContactRealHoursPhone: Story = { ...ContactRealHours, globals: { viewport: { value: 'phone' } } };
