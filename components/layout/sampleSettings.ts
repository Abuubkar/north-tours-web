import type { Settings } from '@/lib/content/settings';

/*
 * Sample settings for the layout stories, which can't read content files. The placeholder set
 * matches content/settings.json today (ADR-0010); the real set shows what launch will look like.
 */

export const placeholderSettings: Settings = {
  brand: { name: '[BRAND NAME]' },
  contact: {
    whatsapp: '[+92 3XX XXX XXXX]',
    phone: '[+92 42 XXXX XXXX]',
    email: '[hello@brand.pk]',
    officeAddress: '[Office address], Lahore, Punjab',
    officeHours: '[Mon–Sat, X am – X pm]',
    travelSupport: '[24/7 number]',
  },
  booking: { advancePercent: 30, replyTime: 'within 2 hours', pickupPoint: '[Pickup point], Lahore' },
  payments: { methods: ['Cash', 'Bank transfer'] },
  legal: { dtsLicence: '[DTS licence number]', companyRegistration: '[SECP or NTN number]' },
  social: { instagram: '[Instagram URL]', facebook: '[Facebook URL]', youtube: '[YouTube URL]' },
  whatsapp: {
    generalMessage: 'Hi, I’d like to plan a trip north.',
    footerIntro:
      'Most of our trips are planned on WhatsApp. Send your dates and group size and we’ll take it from there.',
  },
};

export const realSettings: Settings = {
  ...placeholderSettings,
  contact: {
    ...placeholderSettings.contact,
    whatsapp: '+92 300 1234567',
    phone: '+92 42 3578 1234',
    email: 'hello@example.pk',
    officeAddress: '12 Main Boulevard, Gulberg, Lahore',
    officeHours: 'Mon–Sat, 10 am – 7 pm',
  },
  legal: { dtsLicence: '1234', companyRegistration: '0123456' },
  social: {
    instagram: 'https://instagram.com/example',
    facebook: 'https://facebook.com/example',
    youtube: 'https://youtube.com/@example',
  },
};
