import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { Button } from '@/components/ui/Button/Button';
import { ContactChannelCard } from './ContactChannelCard';

const chatHref = 'https://wa.me/?text=Hi%2C%20I%E2%80%99d%20like%20to%20plan%20a%20trip%20north.';

const meta = {
  title: 'Contact/ContactChannelCard',
  component: ContactChannelCard,
  args: {
    label: 'WhatsApp · fastest',
    icon: 'whatsapp',
    value: '[+92 3XX XXX XXXX]',
    href: undefined,
    size: 'feature',
    line: 'Send your dates and group size. We reply within 2 hours.',
    children: (
      <Button href={chatHref} icon="whatsapp">
        Chat now
      </Button>
    ),
  },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof ContactChannelCard>;

export default meta;
type Story = StoryObj<typeof meta>;

/** WhatsApp with the placeholder number: an <h3>, the number as plain text, and "Chat now" with no number. */
export const WhatsAppPlaceholder: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'WhatsApp · fastest' })).toBeVisible();
    await expect(canvas.getByText('[+92 3XX XXX XXXX]').closest('a')).toBeNull();
    await expect(canvas.getByRole('link', { name: 'Chat now' })).toHaveAttribute('href', chatHref);
  },
};

export const WhatsAppPlaceholderOnLight: Story = { ...WhatsAppPlaceholder, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** WhatsApp with a real number: the number links to its chat. */
export const WhatsAppReal: Story = {
  args: { value: '+92 300 1234567', href: 'https://wa.me/923001234567?text=Hi' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 300 1234567' })).toHaveAttribute('href', 'https://wa.me/923001234567?text=Hi');
  },
};

/** The phone, real: a tel: link, then the hours. */
export const PhoneReal: Story = {
  args: { label: 'Phone', icon: undefined, value: '+92 42 3578 1234', href: 'tel:+924235781234', size: 'default', line: 'Mon–Sat, 10 am – 7 pm', children: undefined },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 3, name: 'Phone' })).toBeVisible();
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
  },
};

export const PhoneRealOnLight: Story = { ...PhoneReal, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** The email, a placeholder: plain text, never a mailto: link. */
export const EmailPlaceholder: Story = {
  args: { label: 'Email', icon: undefined, value: '[hello@brand.pk]', href: undefined, size: 'default', line: 'For invoices, documents and longer questions.', children: undefined },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('link')).toBeNull();
    await expect(canvas.getByText('[hello@brand.pk]')).toBeVisible();
  },
};
