import { describe, expect, it } from 'vitest';
import { toursVisiting } from './destination.ts';

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
