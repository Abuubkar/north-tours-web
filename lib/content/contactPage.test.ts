import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { contactPage } from './contactPage.ts';
import { contactCopyFile, loadContactCopy, type ContactCopy } from './pages.ts';
import { getSettings, type Settings } from './settings.ts';
import { contentFixture } from './testing.ts';

const contact: ContactCopy = JSON.parse(readFileSync(contactCopyFile(), 'utf8'));

function withChange(change: (copy: ContactCopy) => void) {
  const copy = structuredClone(contact);
  change(copy);
  return loadContactCopy(contentFixture({ 'pages/contact.json': copy }));
}

const fields = (result: ReturnType<typeof loadContactCopy>) => result.problems.map((p) => p.field);

/** Real contact values, as the owner will supply them. */
const real = (settings: Settings): Settings => ({
  ...settings,
  contact: {
    ...settings.contact,
    whatsapp: '+92 300 1234567',
    phone: '+92 42 3578 1234',
    email: 'hello@example.pk',
    officeHours: 'Mon–Sat, 10 am – 7 pm',
    travelSupport: '+92 321 7654321',
  },
});

describe('contact page copy', () => {
  it('accepts the live file', () => {
    expect(loadContactCopy().problems).toEqual([]);
  });

  it('rejects a missing quick link label', () => {
    expect(fields(withChange((c) => delete (c.quickLinks.links as Partial<ContactCopy['quickLinks']['links']>).policies))).toEqual([
      'quickLinks.links.policies',
    ]);
  });

  it('rejects a missing field and a token a field can’t take', () => {
    expect(fields(withChange((c) => delete (c.onTrip as Partial<ContactCopy['onTrip']>).callLabel))).toEqual(['onTrip.callLabel']);
    const result = withChange((c) => Object.assign(c.header, { lead: 'Call {phone}.' }));
    expect(fields(result)).toEqual(['header.lead']);
    expect(result.problems[0].message).toMatch(/^Unknown token \{phone\}/);
  });
});

describe('contactPage', () => {
  it('fills the lead’s reply time and hours, and the WhatsApp line’s reply time, from settings', () => {
    const settings = real(getSettings());
    const { copy } = contactPage(contact, { ...settings, booking: { ...settings.booking, replyTime: 'within 4 hours' } });
    expect(copy.header.lead).toBe('Most trips are planned on WhatsApp. We reply within 4 hours, Mon–Sat, 10 am – 7 pm.');
    expect(copy.ways.whatsapp.line).toBe('Send your dates and group size. We reply within 4 hours.');
  });

  it('links nothing while the values are placeholders, and "Chat now" carries the general message with no number', () => {
    const settings = getSettings();
    const { channels, travelSupport } = contactPage(contact, settings);
    expect([channels.whatsapp.href, channels.phone.href, channels.email.href, travelSupport.href]).toEqual([undefined, undefined, undefined, undefined]);
    expect(channels.whatsapp.chatHref).toBe(`https://wa.me/?text=${encodeURIComponent(settings.whatsapp.generalMessage)}`);
  });

  it('links each value once it’s real', () => {
    const { channels, travelSupport } = contactPage(contact, real(getSettings()));
    expect(channels.whatsapp.href).toMatch(/^https:\/\/wa\.me\/923001234567\?text=/);
    expect(channels.phone.href).toBe('tel:+924235781234');
    expect(channels.email.href).toBe('mailto:hello@example.pk');
    expect(travelSupport.href).toBe('tel:+923217654321');
  });
});

describe('quick links', () => {
  it('go to the planner, the tours, Help and the booking policies; social profiles link once real', () => {
    const live = contactPage(contact, getSettings()).quickLinks;
    expect(live.links.map((l) => l.href)).toEqual(['/plan', '/tours', '/help', '/help#policies']);
    expect(live.social.map((s) => s.href)).toEqual([undefined, undefined, undefined]);
    const settings = getSettings();
    const withSocial = contactPage(contact, { ...settings, social: { instagram: 'https://instagram.com/example', facebook: 'https://facebook.com/example', youtube: 'https://youtube.com/@example' } });
    expect(withSocial.quickLinks.social.map((s) => s.href)).toEqual(['https://instagram.com/example', 'https://facebook.com/example', 'https://youtube.com/@example']);
  });
});
