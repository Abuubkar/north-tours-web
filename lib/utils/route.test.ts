import { describe, expect, it } from 'vitest';
import { routeLine } from './route.ts';

describe('routeLine', () => {
  it('joins the stops with arrows', () => {
    expect(routeLine(['Lahore', 'Hunza', 'Skardu'])).toBe('Lahore → Hunza → Skardu');
    expect(routeLine(['Lahore', 'Murree'])).toBe('Lahore → Murree');
  });
});
