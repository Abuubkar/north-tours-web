import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { onPath } from '../../../.storybook/markedLinks';
import { listingSettings, placeholderSettings, realSettings } from '../sampleSettings';
import { SiteFooter } from './SiteFooter';

const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Layout/SiteFooter',
  component: SiteFooter,
  args: { settings: realSettings },
  parameters: { fullBleed: true, ...onPath('/help') },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const contactRow = (canvasElement: HTMLElement, label: string) =>
  within(within(canvasElement).getByText(label, { selector: 'dt' }).parentElement!);

/** Real values: WhatsApp with the number's digits, phone as tel:, email as mailto:, social linked. */
export const RealValues: Story = {
  play: async ({ canvas, canvasElement }) => {
    const whatsapp = `https://wa.me/923001234567?${MESSAGE}`;
    await expect(canvas.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute('href', whatsapp);
    await expect(contactRow(canvasElement, 'WhatsApp').getByRole('link')).toHaveAttribute('href', whatsapp);
    await expect(contactRow(canvasElement, 'Phone').getByRole('link')).toHaveAttribute('href', 'tel:+924235781234');
    await expect(contactRow(canvasElement, 'Email').getByRole('link')).toHaveAttribute('href', 'mailto:hello@example.pk');
    await expect(canvas.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://instagram.com/example');
    await expect(canvas.getByText(/DTS Licence No\. 1234$/)).toHaveTextContent(/^© \d{4} \[BRAND NAME\] · /);
  },
};

export const RealValuesOnLight: Story = { ...RealValues, globals: { surface: 'light' } };

export const RealValuesPhone: Story = { ...RealValues, globals: { viewport: { value: 'phone' } } };

export const RealValuesPhoneOnLight: Story = {
  ...RealValues,
  globals: { surface: 'light', viewport: { value: 'phone' } },
};

/** Placeholders show as written: WhatsApp opens with no number; phone, email and social aren't links. */
export const Placeholders: Story = {
  args: { settings: placeholderSettings },
  play: async ({ canvas, canvasElement }) => {
    const whatsapp = `https://wa.me/?${MESSAGE}`;
    await expect(canvas.getByRole('link', { name: 'Chat on WhatsApp' })).toHaveAttribute('href', whatsapp);
    await expect(contactRow(canvasElement, 'WhatsApp').getByRole('link')).toHaveAttribute('href', whatsapp);
    for (const label of ['Phone', 'Email']) await expect(contactRow(canvasElement, label).queryByRole('link')).toBeNull();
    await expect(canvas.getByText('[+92 42 XXXX XXXX]')).toBeVisible();
    for (const name of ['Instagram', 'Facebook', 'YouTube']) {
      await expect(canvas.queryByRole('link', { name })).toBeNull();
      await expect(canvas.getByText(name)).toBeVisible();
    }
    await expect(canvas.getByText(/DTS Licence No\. \[DTS licence number\]$/)).toHaveTextContent(
      /^© \d{4} \[BRAND NAME\] · /,
    );
  },
};

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light' } };

export const PlaceholdersPhone: Story = { ...Placeholders, globals: { viewport: { value: 'phone' } } };

export const PlaceholdersPhoneOnLight: Story = {
  ...Placeholders,
  globals: { surface: 'light', viewport: { value: 'phone' } },
};

/**
 * Today's settings: the office's phone from its Google Maps listing is a tel: link, and its
 * address shows in the Office row; WhatsApp and email stay placeholders.
 */
export const OfficeListing: Story = {
  args: { settings: listingSettings },
  play: async ({ canvasElement }) => {
    const phone = contactRow(canvasElement, 'Phone').getByRole('link', { name: '+92 42 3725 2511' });
    await expect(phone).toHaveAttribute('href', 'tel:+924237252511');
    await expect(contactRow(canvasElement, 'Office').getByText(/^3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000/)).toBeVisible();
    await expect(contactRow(canvasElement, 'Email').queryByRole('link')).toBeNull();
  },
};

export const OfficeListingOnLight: Story = { ...OfficeListing, globals: { surface: 'light' } };

/** The footer's nav is its own landmark, with the main nav's six pages as large links; Contact isn't a small link too. */
export const FooterNav: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('contentinfo')).toHaveAttribute('data-surface', 'dark');
    const nav = canvas.getByRole('navigation', { name: 'Footer' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '/'],
      ['Tours', '/tours'],
      ['Destinations', '/destinations'],
      ['Private trips', '/plan'],
      ['About', '/about'],
      ['Contact', '/contact'],
    ]);
    // On Help, a page outside the main nav, no large link is current.
    for (const link of links) await expect(link).not.toHaveAttribute('aria-current');
    const small = canvas.getAllByRole('listitem').filter((item) => !nav.contains(item));
    await expect(small.map((item) => item.textContent)).toEqual(['Instagram', 'Facebook', 'YouTube', 'Help', 'Privacy', 'Terms', 'Photo credits']);
    await expect(canvas.getByRole('link', { name: 'Photo credits' })).toHaveAttribute('href', '/credits');
  },
};

/**
 * No section label (owner feedback, 2026-10-05): no "Contact" heading, the large links start at the
 * footer's left margin, and the contact column sits on the right.
 */
export const NoLabel: Story = {
  play: async ({ canvas, canvasElement }) => {
    const footer = canvasElement.querySelector('footer')!;
    await expect(within(footer).queryByRole('heading')).toBeNull();
    await expect(within(footer).queryByText('Contact', { selector: 'h2, p, span' })).toBeNull();
    const margin = parseFloat(getComputedStyle(footer).paddingLeft);
    const links = within(canvas.getByRole('navigation', { name: 'Footer' })).getAllByRole('link');
    await expect(Math.round(links[0].getBoundingClientRect().left)).toBe(Math.round(footer.getBoundingClientRect().left + margin));
    const chat = canvas.getByRole('link', { name: 'Chat on WhatsApp' }).getBoundingClientRect();
    await expect(chat.left).toBeGreaterThan(Math.max(...links.map((link) => link.getBoundingClientRect().right)));
  },
};

export const NoLabelOnLight: Story = { ...NoLabel, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the large links still start at the margin, with the contact column under them. */
export const NoLabelPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const footer = canvasElement.querySelector('footer')!;
    const margin = parseFloat(getComputedStyle(footer).paddingLeft);
    const links = within(canvas.getByRole('navigation', { name: 'Footer' })).getAllByRole('link');
    await expect(Math.round(links[0].getBoundingClientRect().left)).toBe(Math.round(footer.getBoundingClientRect().left + margin));
    const chat = canvas.getByRole('link', { name: 'Chat on WhatsApp' }).getBoundingClientRect();
    await expect(chat.top).toBeGreaterThan(links.at(-1)!.getBoundingClientRect().bottom);
  },
};

/** On a destination page, Destinations is the current large link, gold, as in the header. */
export const CurrentPage: Story = {
  parameters: onPath('/destinations/hunza'),
  play: async ({ canvas }) => {
    const nav = canvas.getByRole('navigation', { name: 'Footer' });
    const current = within(nav)
      .getAllByRole('link')
      .filter((link) => link.hasAttribute('aria-current'));
    await expect(current.map((link) => [link.textContent, link.getAttribute('aria-current')])).toEqual([['Destinations', 'page']]);
  },
};

export const CurrentPageOnLight: Story = { ...CurrentPage, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Every link in the footer is at least the 44px tap target. */
export const TapTargets: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    for (const link of canvas.getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};
