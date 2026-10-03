import type { GuideCardProps } from './GuideCard/GuideCard.types';

/* Sample guides for stories, which can't read content files. Portraits stay placeholders (ADR-0009). */
export const sampleGuides: GuideCardProps['guide'][] = [
  {
    slug: 'karim-baig',
    name: 'Karim Baig',
    role: 'Lead guide',
    base: 'Hunza',
    portrait: { placeholder: 'lead guide, outdoors in Karimabad', alt: 'Karim Baig, lead guide' },
  },
  {
    slug: 'ghulam-nabi',
    name: 'Ghulam Nabi',
    role: 'Driver',
    base: 'Lahore',
    portrait: { placeholder: 'driver beside the coaster', alt: 'Ghulam Nabi, driver' },
  },
  {
    slug: 'ali-raza',
    name: 'Ali Raza',
    role: 'Guide',
    base: 'Skardu & Deosai',
    portrait: { placeholder: 'guide on the Deosai plateau', alt: 'Ali Raza, guide' },
  },
  {
    slug: 'sajjad-hussain',
    name: 'Sajjad Hussain',
    role: 'Trek lead',
    base: 'Fairy Meadows',
    portrait: { placeholder: 'trek lead at Raikot Bridge', alt: 'Sajjad Hussain, trek lead' },
  },
  {
    slug: 'sana-qureshi',
    name: 'Sana Qureshi',
    role: 'Tour host',
    base: 'Lahore',
    portrait: { placeholder: 'tour host at the Lahore office', alt: 'Sana Qureshi, tour host' },
  },
  {
    slug: 'imran-khattak',
    name: 'Imran Khattak',
    role: 'Driver',
    base: 'Private tours',
    portrait: { placeholder: 'driver with the Prado in Swat', alt: 'Imran Khattak, driver' },
  },
];
