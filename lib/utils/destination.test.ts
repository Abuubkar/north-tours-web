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
  const place = {
    id: 'baltit-fort',
    name: 'Baltit Fort',
    kind: 'heritage' as const,
    text: 'The centuries-old fort above Karimabad.',
    lat: 36.3275,
    lon: 74.6696,
    image: { placeholder: 'Baltit Fort', alt: 'Baltit Fort' },
  };
  const note = { title: 'Cash and ATMs', text: 'Carry enough cash.' };

  it('shows every section with places and notes (Hunza)', () => {
    expect(destinationSections({ places: [place], notes: [note] })).toEqual(['hero', 'overview', 'calendar', 'places', 'gettingThere', 'goodToKnow']);
  });

  it('leaves out places and good to know with none (Murree), keeping the sections every page has', () => {
    expect(destinationSections({})).toEqual(['hero', 'overview', 'calendar', 'gettingThere']);
    expect(destinationSections({ places: [], notes: [] })).toEqual(['hero', 'overview', 'calendar', 'gettingThere']);
  });

  it('shows each optional section on its own', () => {
    expect(destinationSections({ places: [place] })).toEqual(['hero', 'overview', 'calendar', 'places', 'gettingThere']);
    expect(destinationSections({ notes: [note] })).toEqual(['hero', 'overview', 'calendar', 'gettingThere', 'goodToKnow']);
  });
});
