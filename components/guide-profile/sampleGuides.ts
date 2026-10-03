import type { GuideCardProps } from './GuideCard/GuideCard.types';

/* Sample guides for stories, which can't read content files. Portraits stay placeholders (ADR-0009). */
export const sampleGuides: GuideCardProps['guide'][] = [
  ['karim-baig', 'Karim Baig', 'Lead guide', 'Hunza', 'lead guide, outdoors in Karimabad'],
  ['ghulam-nabi', 'Ghulam Nabi', 'Driver', 'Lahore', 'driver beside the coaster'],
  ['ali-raza', 'Ali Raza', 'Guide', 'Skardu & Deosai', 'guide on the Deosai plateau'],
  ['sajjad-hussain', 'Sajjad Hussain', 'Trek lead', 'Fairy Meadows', 'trek lead at Raikot Bridge'],
  ['sana-qureshi', 'Sana Qureshi', 'Tour host', 'Lahore', 'tour host at the Lahore office'],
  ['imran-khattak', 'Imran Khattak', 'Driver', 'Private tours', 'driver with the Prado in Swat'],
].map(([slug, name, role, base, shot]) => ({
  slug,
  name,
  role: role as GuideCardProps['guide']['role'],
  base,
  portrait: { placeholder: shot, alt: `${name}, ${role.toLowerCase()}` },
}));
