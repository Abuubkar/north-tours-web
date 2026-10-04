import { describe, expect, it } from 'vitest';
import { destinationSections, toursVisiting } from './destination.ts';

const tour = (title: string, destinations: string[]) => ({ title, destinations });
const grand = tour('Hunza & Skardu Grand', ['hunza', 'skardu']);
const express = tour('Hunza Express', ['hunza']);
const swat = tour('Swat Family Escape', ['swat']);

describe('toursVisiting', () => {
  it('finds every tour that names the destination, in order', () => {
    expect(toursVisiting('hunza', [grand, swat, express])).toEqual([grand, express]);
  });

  it('counts a tour visiting two destinations for both', () => {
    expect(toursVisiting('skardu', [grand, express])).toEqual([grand]);
    expect(toursVisiting('hunza', [grand, express])).toEqual([grand, express]);
  });

  it('is empty when no tour visits', () => {
    expect(toursVisiting('murree', [grand, express, swat])).toEqual([]);
  });
});

describe('destinationSections', () => {
  const place = { id: 'baltit-fort' };

  it('shows places to see when there are places (Hunza)', () => {
    expect(destinationSections({ places: [place as never] })).toEqual(['hero', 'overview', 'calendar', 'places']);
  });

  it('leaves places out with none (Murree), keeping the sections every page has', () => {
    expect(destinationSections({})).toEqual(['hero', 'overview', 'calendar']);
    expect(destinationSections({ places: [] })).toEqual(['hero', 'overview', 'calendar']);
  });
});
