import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import { officeMapStandIn } from '@/components/contact/OfficeMap/sampleOfficeMap';
import { listingSettings, placeholderSettings, realSettings } from '@/components/layout/sampleSettings';
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
 * With every value a placeholder: four rows, Phone and WhatsApp as plain text, no "Get
 * directions" and no map (the address is a placeholder), and "WhatsApp first" with the general message.
 */
export const Placeholders: Story = {
  play: async ({ canvas, canvasElement }) => {
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
    await expect(canvasElement.querySelector('iframe')).toBeNull();
  },
};

export const PlaceholdersOnLight: Story = { ...Placeholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 nothing scrolls sideways. */
export const PlaceholdersPhone: Story = {
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const PlaceholdersPhoneOnLight: Story = { ...PlaceholdersPhone, globals: { surface: 'light', viewport: { value: 'phone' } } };

const directionsTo = (address: string) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;

/**
 * With real values: Phone and WhatsApp are links, "Get directions" opens Google Maps directions
 * to the address in a new tab, and the map (a stand-in, so tests never call Google) sits beside
 * the text from wide screens, named by its title, loading lazily, with the link to the full map.
 */
export const RealValues: Story = {
  args: { settings: realSettings, map: officeMapStandIn },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('link', { name: '+92 42 3578 1234' })).toHaveAttribute('href', 'tel:+924235781234');
    await expect(canvas.getByRole('link', { name: '+92 300 1234567' })).toHaveAttribute(
      'href',
      `https://wa.me/923001234567?text=${encodeURIComponent('Hi, I’d like to plan a trip north.')}`,
    );
    const directions = canvas.getByRole('link', { name: /Get directions/ });
    await expect(directions).toHaveAttribute('href', directionsTo('12 Main Boulevard, Gulberg, Lahore'));
    await expect(directions).toHaveAttribute('target', '_blank');
    await expect(directions).toHaveAttribute('rel', 'noopener');
    const frame = canvas.getByTitle(officeMapStandIn.title);
    await expect(frame).toHaveAttribute('loading', 'lazy');
    await expect(canvas.getByRole('link', { name: officeMapStandIn.linkLabel })).toHaveAttribute('href', officeMapStandIn.href);
    const text = canvas.getByRole('heading', { level: 2 }).getBoundingClientRect();
    await expect(frame.getBoundingClientRect().left).toBeGreaterThan(text.right - 1);
  },
};

export const RealValuesOnLight: Story = { ...RealValues, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** At 390 the map sits under the rows and buttons, and nothing scrolls sideways. */
export const RealValuesPhone: Story = {
  args: { settings: realSettings, map: officeMapStandIn },
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, canvasElement }) => {
    const button = canvas.getByRole('link', { name: 'WhatsApp first' }).getBoundingClientRect();
    await expect(canvas.getByTitle(officeMapStandIn.title).getBoundingClientRect().top).toBeGreaterThan(button.bottom);
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
  play: async ({ canvas, canvasElement }) => {
    await expect(canvas.getByRole('heading', { level: 2, name: 'Plan your trip over chai at our Lahore office' })).toBeVisible();
    await expect(rows(canvas)).toEqual(['Office: [Office address], Lahore, Punjab', 'Open: [Mon–Sat, X am – X pm]']);
    await expect(canvas.queryByRole('link')).toBeNull();
    await expect(canvasElement.querySelector('iframe')).toBeNull();
  },
};

export const TwoRowPlaceholdersOnLight: Story = { ...TwoRowPlaceholders, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const TwoRowPlaceholdersPhone: Story = { ...TwoRowPlaceholders, globals: { viewport: { value: 'phone' } } };

export const TwoRowPlaceholdersPhoneOnLight: Story = { ...TwoRowPlaceholders, globals: { surface: 'light', viewport: { value: 'phone' } } };

/** The two-row form with a real address: "Get directions →" opens Google Maps in a new tab, the map shows, and still no "WhatsApp first". */
export const TwoRowRealValues: Story = {
  args: { form: 'two-row', settings: realSettings, map: officeMapStandIn },
  play: async ({ canvas }) => {
    await expect(rows(canvas)).toEqual(['Office: 12 Main Boulevard, Gulberg, Lahore', 'Open: Mon–Sat, 10 am – 7 pm']);
    const directions = canvas.getByRole('link', { name: /Get directions/ });
    await expect(directions).toHaveAttribute('href', directionsTo('12 Main Boulevard, Gulberg, Lahore'));
    await expect(canvas.getByTitle(officeMapStandIn.title)).toBeVisible();
    await expect(directions).toHaveAttribute('target', '_blank');
    await expect(directions).toHaveAttribute('rel', 'noopener');
    await expect(canvas.queryByRole('link', { name: 'WhatsApp first' })).toBeNull();
  },
};

export const TwoRowRealValuesOnLight: Story = { ...TwoRowRealValues, globals: { surface: 'light', viewport: { value: 'desktop' } } };

export const TwoRowRealValuesPhone: Story = { ...TwoRowRealValues, globals: { viewport: { value: 'phone' } } };

export const TwoRowRealValuesPhoneOnLight: Story = { ...TwoRowRealValues, globals: { surface: 'light', viewport: { value: 'phone' } } };

/**
 * Today's settings: the address and phone from the owner's Google Maps listing are real, so the
 * phone is a tel: link and "Get directions" shows; WhatsApp and the hours stay placeholders.
 */
export const OfficeListing: Story = {
  args: { settings: listingSettings, map: officeMapStandIn },
  play: async ({ canvas }) => {
    await expect(rows(canvas)).toEqual([
      'Office: 3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000',
      'Open: [Mon–Sat, X am – X pm]',
      'Phone: +92 42 3725 2511',
      'WhatsApp: [+92 3XX XXX XXXX]',
    ]);
    await expect(canvas.getByRole('link', { name: '+92 42 3725 2511' })).toHaveAttribute('href', 'tel:+924237252511');
    await expect(canvas.getByRole('link', { name: /Get directions/ })).toHaveAttribute(
      'href',
      directionsTo('Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000'),
    );
  },
};

export const OfficeListingOnLight: Story = { ...OfficeListing, globals: { surface: 'light', viewport: { value: 'desktop' } } };
