import { describe, expect, it } from 'vitest';
import { companyStats } from './companyStats.ts';

const labels = { years: 'years running trips', trips: 'trips completed', travellers: 'travellers', guides: 'guides and drivers' };

describe('companyStats', () => {
  const trust = { operatingSince: 2014, tripsCompleted: '1,200+' };
  const stats = companyStats({ trust, travellers: '9,000+', guideCount: 6, year: 2026, labels });

  it('counts the years running trips from operatingSince to the build year', () => {
    expect(stats[0]).toEqual({ value: '12', label: 'years running trips' });
    expect(companyStats({ trust, travellers: '1', guideCount: 1, year: 2030, labels })[0].value).toBe('16');
  });

  it('shows trips completed as the trust settings write them', () => {
    expect(stats[1]).toEqual({ value: '1,200+', label: 'trips completed' });
  });

  it('takes travellers from page copy and counts the guides in content', () => {
    expect(stats[2]).toEqual({ value: '9,000+', label: 'travellers' });
    expect(stats[3]).toEqual({ value: '6', label: 'guides and drivers' });
  });

  it('gives four figures, in the design’s order', () => {
    expect(stats.map((s) => s.label)).toEqual(['years running trips', 'trips completed', 'travellers', 'guides and drivers']);
  });
});
