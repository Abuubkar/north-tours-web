import { describe, expect, it } from 'vitest';
import type { Settings } from '../content/settings.ts';
import { emailHref, officeMap, officeOnMaps, phoneHref, webHref, whatsappHref } from './contact.ts';

describe('contact links', () => {
  it('links a real phone number as tel: without spaces', () => {
    expect(phoneHref('+92 42 3578 1234')).toBe('tel:+924235781234');
    // The office's landline, from its Google Maps listing.
    expect(phoneHref('+92 42 3725 2511')).toBe('tel:+924237252511');
  });

  it('links a real email as mailto:', () => {
    expect(emailHref('hello@example.pk')).toBe('mailto:hello@example.pk');
  });

  it('keeps a real web link as it is', () => {
    expect(webHref('https://instagram.com/example')).toBe('https://instagram.com/example');
  });

  it('has no link while a value is a placeholder', () => {
    expect(phoneHref('[+92 42 XXXX XXXX]')).toBeUndefined();
    expect(emailHref('[hello@brand.pk]')).toBeUndefined();
    expect(webHref('[Instagram URL]')).toBeUndefined();
  });
});

describe('whatsappHref', () => {
  it('links a real number to a chat with the message', () => {
    expect(whatsappHref('+92 300 1234567', 'Hi')).toBe('https://wa.me/923001234567?text=Hi');
  });

  it('has no link while the number is a placeholder', () => {
    expect(whatsappHref('[+92 3XX XXX XXXX]', 'Hi')).toBeUndefined();
  });
});

const office = { officeAddress: '3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000', officeMapQuery: 'Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000' };
const encoded = 'Ex%20Air%20Avenue%2C%20Block%20R%2C%20DHA%20Phase%208%2C%20Lahore%2054000';
const placeholder = '[Office address], Lahore, Punjab';

describe('officeOnMaps', () => {
  it('finds the office by the address as Google knows it: directions, the embed and the full map, encoded', () => {
    expect(officeOnMaps(office)).toEqual({
      directions: `https://www.google.com/maps/dir/?api=1&destination=${encoded}`,
      embed: `https://www.google.com/maps?q=${encoded}&output=embed`,
      search: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
    });
    expect(officeOnMaps({ officeAddress: 'Shop #4 & 5, Lahore', officeMapQuery: 'Shop #4 & 5, Lahore' })?.directions).toBe(
      'https://www.google.com/maps/dir/?api=1&destination=Shop%20%234%20%26%205%2C%20Lahore',
    );
  });

  it('gives none while any part of the address or the query is a placeholder', () => {
    expect(officeOnMaps({ officeAddress: placeholder, officeMapQuery: placeholder })).toBeUndefined();
    expect(officeOnMaps({ ...office, officeAddress: placeholder })).toBeUndefined();
    expect(officeOnMaps({ ...office, officeMapQuery: '[Office address]' })).toBeUndefined();
  });
});

describe('officeMap', () => {
  const visitOffice = { mapTitle: 'Map of our office', mapLinkLabel: 'Open in Google Maps' } as Settings['visitOffice'];
  const settings = (contact: typeof office) => ({ contact: contact as Settings['contact'], visitOffice });

  it('gives the frame, its title and the link for a real office', () => {
    expect(officeMap(settings(office))).toEqual({
      src: `https://www.google.com/maps?q=${encoded}&output=embed`,
      title: 'Map of our office',
      href: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      linkLabel: 'Open in Google Maps',
    });
  });

  it('gives none while the address is a placeholder, even with a real query', () => {
    expect(officeMap(settings({ ...office, officeAddress: placeholder }))).toBeUndefined();
  });
});
