import { describe, expect, it } from 'vitest';
import { altitudePlaces } from './altitudeStrip.ts';

describe('altitudePlaces', () => {
  it('gives one place per destination, in content order, linking to its page with the formatted altitude', () => {
    const places = altitudePlaces([
      { name: 'Hunza', slug: 'hunza', altitude: 2438 },
      { name: 'Naran-Kaghan', slug: 'naran-kaghan', altitude: 2409 },
      { name: 'Swat', slug: 'swat', altitude: 980 },
    ]);
    expect(places).toEqual([
      { name: 'Hunza', href: '/destinations/hunza', altitude: '2,438 m' },
      { name: 'Naran-Kaghan', href: '/destinations/naran-kaghan', altitude: '2,409 m' },
      { name: 'Swat', href: '/destinations/swat', altitude: '980 m' },
    ]);
  });

  it('gives no places, so no strip, without destinations', () => {
    expect(altitudePlaces([])).toEqual([]);
  });
});
