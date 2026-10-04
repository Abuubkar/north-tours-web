import { describe, expect, it } from 'vitest';
import { sectionInView } from './scrollSpy.ts';

describe('sectionInView', () => {
  const viewport = 1000;
  /** Three sections 1500px apart, the first one's top at `first`. */
  const at = (first: number) => [
    { id: 'one', top: first },
    { id: 'two', top: first + 1500 },
    { id: 'three', top: first + 3000 },
  ];

  it('marks a section once its top is above the line, not before', () => {
    expect(sectionInView(at(399), viewport, 0.4)).toBe('one');
    expect(sectionInView(at(400), viewport, 0.4)).toBeNull();
    expect(sectionInView(at(401), viewport, 0.4)).toBeNull();
  });

  it('marks nothing above the first section', () => {
    expect(sectionInView(at(2000), viewport, 0.5)).toBeNull();
  });

  it('marks the later of two sections past the line', () => {
    expect(sectionInView(at(-1200), viewport, 0.5)).toBe('two');
  });

  it('marks the last section at the bottom of the page', () => {
    expect(sectionInView(at(-3200), viewport, 0.5)).toBe('three');
  });
});
