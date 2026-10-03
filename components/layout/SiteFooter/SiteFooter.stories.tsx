import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { placeholderSettings, realSettings } from '../sampleSettings';
import { SiteFooter } from './SiteFooter';

const MESSAGE = 'text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Layout/SiteFooter',
  component: SiteFooter,
  args: { settings: realSettings },
  parameters: { fullBleed: true },
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

/** The footer's nav is its own landmark, with the large links from the route map. */
export const FooterNav: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('contentinfo')).toHaveAttribute('data-surface', 'dark');
    const nav = canvas.getByRole('navigation', { name: 'Footer' });
    const links = within(nav).getAllByRole('link');
    await expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Tours', '/tours'],
      ['Destinations', '/#destinations'],
      ['Private trips', '/plan'],
      ['About us', '/about'],
      ['Reviews', '/#reviews'],
    ]);
    for (const name of ['Help', 'Contact', 'Privacy', 'Terms']) {
      await expect(canvas.getByRole('link', { name })).toBeVisible();
    }
    await expect(canvas.getByRole('link', { name: 'Photo credits' })).toHaveAttribute('href', '/credits');
  },
};

/** Every link in the footer is at least the 44px tap target. */
export const TapTargets: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    for (const link of canvas.getAllByRole('link')) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
    }
  },
};
