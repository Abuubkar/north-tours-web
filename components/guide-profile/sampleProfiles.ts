import { placeholderSettings } from '@/components/layout/sampleSettings';
import { guideProfile, type GuideProfile } from '@/lib/utils/guideProfile';
import { sampleAbout } from '@/sections/sampleAbout';
import { sampleGuides } from './sampleGuides';

/* Sample profiles for stories, which can't read content files: the six sample guides, shaped as the About page does. */

const details = {
  'karim-baig': { home: 'Karimabad, Hunza', leads: ['Hunza', 'Nagar', 'Gilgit'], joined: 2016, languages: ['Burushaski', 'Urdu', 'English'] },
  'ghulam-nabi': { home: 'Chilas, Diamer', leads: ['Karakoram Highway', 'Hunza', 'Skardu'], joined: 2014, languages: ['Urdu', 'Punjabi'] },
  'ali-raza': { home: 'Skardu, Baltistan', leads: ['Skardu', 'Deosai', 'Shigar'], joined: 2018, languages: ['Balti', 'Urdu', 'English'] },
  'sajjad-hussain': { home: 'Tato village, below Fairy Meadows', leads: ['Fairy Meadows', 'Nanga Parbat base camp'], joined: 2019, languages: ['Shina', 'Urdu', 'English'] },
  'sana-qureshi': { home: 'Lahore', leads: ['All group departures'], joined: 2017, languages: ['Urdu', 'English'] },
  'imran-khattak': { home: 'Mingora, Swat', leads: ['Swat', 'Kalam', 'Naran-Kaghan'], joined: 2020, languages: ['Pashto', 'Urdu'] },
} as const;

export const sampleProfiles: GuideProfile[] = sampleGuides.map((guide) => {
  const { home, leads, joined, languages } = details[guide.slug as keyof typeof details];
  return guideProfile(
    { ...guide, home, leads: [...leads], joined, languages: [...languages], bio: `${guide.name} plans each day around the weather and your family’s pace.`, consent: true },
    sampleAbout.guides.profile,
    placeholderSettings.whatsapp.guideShareMessage,
    placeholderSettings.site.url,
  );
});
