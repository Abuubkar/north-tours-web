import { describe, expect, it } from 'vitest';
import { emailHref, phoneHref, webHref } from './contact.ts';

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
