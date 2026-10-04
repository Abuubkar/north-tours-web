import { describe, expect, it } from 'vitest';
import { routeLine, spokenRoute } from './route.ts';

describe('routeLine', () => {
  it('joins the stops with arrows', () => {
    expect(routeLine(['Lahore', 'Hunza', 'Skardu'])).toBe('Lahore → Hunza → Skardu');
    expect(routeLine(['Lahore', 'Murree'])).toBe('Lahore → Murree');
  });
});

describe('spokenRoute', () => {
  it('joins the stops with words a screen reader says', () => {
    expect(spokenRoute(['Lahore', 'Hunza', 'Skardu'])).toBe('Lahore to Hunza to Skardu');
  });
});
