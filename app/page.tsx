import type { Metadata } from 'next';

// Throwaway placeholder for the foundation PRD (#1). The Homepage PRD replaces this page.

export const metadata: Metadata = {
  title: '[BRAND NAME] · Tours from Lahore to northern Pakistan',
  description:
    'Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.',
};

export default function HomePage() {
  return (
    <main>
      <p>[BRAND NAME]</p>
      <h1>Guides from Hunza and Skardu, drivers who know every bend of the Karakoram Highway</h1>
      <p>
        Guided group and private tours from Lahore to Hunza, Skardu and the valleys in between.
      </p>
    </main>
  );
}
