import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
import { VisitOffice } from './VisitOffice';

const meta = {
  title: 'Sections/VisitOffice',
  component: VisitOffice,
  args: { settings: placeholderSettings },
  parameters: { fullBleed: true },
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof VisitOffice>;

export default meta;
type Story = StoryObj<typeof meta>;

const rows = (canvas: ReturnType<typeof within>) =>
  canvas.getAllByRole('term').map((term: HTMLElement) => `${term.textContent}: ${term.nextElementSibling?.textContent}`);

/**
 * With today's placeholder settings: four rows, Phone and WhatsApp as plain text, no "Get
 * directions" (the address is a placeholder), and "WhatsApp first" with the general message.
 */
export const Placeholders: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Plan your trip over chai at our Lahore office' })).toBeVisible();
    await expect(rows(canvas)).toEqual([
      'Office: [Office address], Lahore, Punjab',
      'Open: [Mon–Sat, X am – X pm]',
      'Phone: [+92 42 XXXX XXXX]',
      'WhatsApp: [+92 3XX XXX XXXX]',
    ]);
    await expect(canvas.queryByRole('link', { name: /\+92/ })).toBeNull();
    await expect(canvas.queryByRole('link', { name: /Get directions/ })).toBeNull();
    const whatsapp = canvas.getByRole('link', { name: 'WhatsApp first' });
    await expect(whatsapp).toHaveAttribute('href', `https://wa.me/?text=${encodeURIComponent('Hi, I’d like to plan a trip north.')}`);
    await expect(canvas.getByRole('img', { name: 'Our office in Lahore' })).toHaveTextContent('The office front from the street, sign visible');
  },
};

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the photo sits under the rows and buttons, and nothing scrolls sideways. */
export const PlaceholdersPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const button = canvas.getByRole('link', { name: 'WhatsApp first' }).getBoundingClientRect();
    const photo = canvas.getByRole('img', { name: 'Our office in Lahore' }).getBoundingClientRect();
    await expect(photo.top).toBeGreaterThan(button.bottom);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PlaceholdersPhoneOnLight: Story = { ...PlaceholdersPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * With real values: Phone and WhatsApp are links, and "Get directions" opens the address in
 * Google Maps in a new tab. The photo sits beside the text from wide screens.
 */
export const RealValues: Story = {
  args: { settings: realSettings },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
    await expect(canvas.getByRole('link', { name: '+92 300 1234567' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?text=${encodeURIComponent('Hi, I’d like to plan a trip north.')}`,
    );
    const directions = canvas.getByRole('link', { name: /Get directions/ });
    await expect(directions).toHaveAttribute(
      'href',
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('12 Main Boulevard, Gulberg, Lahore')}`,
    );
    await expect(directions).toHaveAttribute('target', '_blank');
    await expect(directions).toHaveAttribute('rel', 'noopener');
    const text = canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    const photo = canvas.getByRole('img', { name: 'Our office in Lahore' }).getBoundingClientRect();
    await expect(photo.left).toBeGreaterThan(text.right - 1);
  },
};

export const RealValuesOnLight: Story = { ...RealValues, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const RealValuesPhone: Story = {
  args: { settings: realSettings },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('link', { name: /Get directions/ })).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const RealValuesPhoneOnLight: Story = { ...RealValuesPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * Contact's two-row form, with placeholders: Office and Open only, no "WhatsApp first", and no
 * "Get directions" while the address is a placeholder (so no buttons at all).
 */
export const TwoRowPlaceholders: Story = {
  args: { form: 'two-row' },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Plan your trip over chai at our Lahore office' })).toBeVisible();
    await expect(rows(canvas)).toEqual(['Office: [Office address], Lahore, Punjab', 'Open: [Mon–Sat, X am – X pm]']);
    await expect(canvas.queryByRole('link')).toBeNull();
  },
};

export const TwoRowPlaceholdersOnLight: Story = { ...TwoRowPlaceholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const TwoRowPlaceholdersPhone: Story = { ...TwoRowPlaceholders, globals: { viewport: { value: 'phone' } } };

/** The two-row form with a real address: "Get directions →" opens Google Maps in a new tab, and still no "WhatsApp first". */
export const TwoRowRealValues: Story = {
  args: { form: 'two-row', settings: realSettings },
  play: async ({ canvas }) => {
    await expect(rows(canvas)).toEqual(['Office: 12 Main Boulevard, Gulberg, Lahore', 'Open: Mon–Sat, 10 am – 7 pm']);
    const directions = canvas.getByRole('link', { name: /Get directions/ });
    await expect(directions).toHaveAttribute('href', `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent('12 Main Boulevard, Gulberg, Lahore')}`);
    await expect(directions).toHaveAttribute('target', '_blank');
    await expect(directions).toHaveAttribute('rel', 'noopener');
    await expect(canvas.queryByRole('link', { name: 'WhatsApp first' })).toBeNull();
  },
};

export const TwoRowRealValuesOnLight: Story = { ...TwoRowRealValues, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const TwoRowRealValuesPhone: Story = { ...TwoRowRealValues, globals: { viewport: { value: 'phone' } } };
