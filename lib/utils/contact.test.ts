import { describe, expect, it } from 'vitest';
import { directionsHref, emailHref, phoneHref, webHref, whatsappHref } from './contact.ts';

describe('contact links', () => {
  it('links a real phone number as tel: without spaces', () => {
    expect(phoneHref('+92 42 3578 1234')).toBe('tel:+924235781234');
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

describe('directionsHref', () => {
  it('searches Google Maps for a real address, encoded', () => {
    expect(directionsHref('12 Main Boulevard, Gulberg, Lahore')).toBe(
      'https://www.google.com/maps/search/?api=1&query=12%20Main%20Boulevard%2C%20Gulberg%2C%20Lahore',
    );
    expect(directionsHref('Shop #4 & 5, Lahore')).toBe('https://www.google.com/maps/search/?api=1&query=Shop%20%234%20%26%205%2C%20Lahore');
  });

  it('gives none while any part of the address is a placeholder', () => {
    expect(directionsHref('[Office address], Lahore, Punjab')).toBeUndefined();
    expect(directionsHref('[Office address]')).toBeUndefined();
  });
});
