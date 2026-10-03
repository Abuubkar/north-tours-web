import type { HomeCopy } from '@/lib/content/pages';
import { samplePhoto } from '@/components/ui/MediaFrame/samplePhotos';

/* Sample Homepage copy for the section stories, which can't read content files. */
export const sampleHome: HomeCopy = {
  title: 'Tours from Lahore to northern Pakistan',
  description: 'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
  hero: {
    lead: 'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
    exploreLabel: 'Explore Tours',
    whatsappLabel: 'Plan on WhatsApp',
    displayWord: 'NORTH',
    image: samplePhoto,
  },
  statement: {
    headline: 'Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway',
    body: 'Our guides grew up in Hunza, Skardu and Swat. Our drivers have spent decades on the Karakoram Highway. They plan around the weather, the roads and your family’s pace, so all you have to do is look out of the window.',
    linkLabel: 'Meet the team',
  },
};
