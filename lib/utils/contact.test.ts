import { describe, expect, it } from 'vitest';
import { directionsHref, emailHref, officeMap, officeMapHref, officeMapSrc, phoneHref, webHref, whatsappHref } from './contact.ts';

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

const office = '3rd floor, 16-R, Ex Air Avenue, Block R, DHA Phase 8, Lahore 54000';
const encoded = '3rd%20floor%2C%2016-R%2C%20Ex%20Air%20Avenue%2C%20Block%20R%2C%20DHA%20Phase%208%2C%20Lahore%2054000';

describe('directionsHref', () => {
  it('asks Google Maps for directions to a real address, encoded', () => {
    expect(directionsHref(office)).toBe(`https://www.google.com/maps/dir/?api=1&destination=${encoded}`);
    expect(directionsHref('Shop #4 & 5, Lahore')).toBe('https://www.google.com/maps/dir/?api=1&destination=Shop%20%234%20%26%205%2C%20Lahore');
  });

  it('gives none while any part of the address is a placeholder', () => {
    expect(directionsHref('[Office address], Lahore, Punjab')).toBeUndefined();
    expect(directionsHref('[Office address]')).toBeUndefined();
  });
});

describe('the office map', () => {
  it('embeds the address with no API key, and links to it full size', () => {
    expect(officeMapSrc(office)).toBe(`https://www.google.com/maps?q=${encoded}&output=embed`);
    expect(officeMapHref(office)).toBe(`https://www.google.com/maps/search/?api=1&query=${encoded}`);
  });

  it('gives neither while any part of the address is a placeholder', () => {
    expect(officeMapSrc('[Office address], Lahore, Punjab')).toBeUndefined();
    expect(officeMapHref('[Office address], Lahore, Punjab')).toBeUndefined();
  });
});

describe('officeMap', () => {
  const words = { mapTitle: 'Map of our office', mapLinkLabel: 'Open in Google Maps' };

  it('gives the frame, its title and the link for a real address', () => {
    expect(officeMap(office, words)).toEqual({
      src: `https://www.google.com/maps?q=${encoded}&output=embed`,
      title: 'Map of our office',
      href: `https://www.google.com/maps/search/?api=1&query=${encoded}`,
      linkLabel: 'Open in Google Maps',
    });
  });

  it('gives none while the address is a placeholder', () => {
    expect(officeMap('[Office address], Lahore, Punjab', words)).toBeUndefined();
  });
});
