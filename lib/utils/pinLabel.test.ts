import { describe, expect, it } from 'vitest';
import { coveredLabels, labelBox, placePinLabel, type Box } from './pinLabel.ts';

describe('placePinLabel', () => {
  const frame: Box = { x: 0, y: 0, width: 484, height: 420 };
  const size = { width: 80, height: 18 };
  const pin = (x: number, y: number): Box => ({ x: x - 13, y: y - 13, width: 26, height: 26 });

  it('puts the name above the pin when that spot is clear', () => {
    expect(placePinLabel(pin(240, 200), size, frame, { pins: [], labels: [] }, 8)).toEqual({ spot: 'above', hidden: [] });
  });

  it('skips a spot that leaves the frame (a pin at the top goes below)', () => {
    expect(placePinLabel(pin(240, 20), size, frame, { pins: [], labels: [] }, 8).spot).toBe('below');
  });

  it('takes the first spot that clears the other pins', () => {
    const above = pin(240, 165);
    const below = pin(240, 235);
    expect(placePinLabel(pin(240, 200), size, frame, { pins: [above, below], labels: [] }, 8).spot).toBe('right');
  });

  it('hides the context labels its name would cover', () => {
    const lit = pin(240, 200);
    const covered = labelBox(lit, size, 'above', 8);
    const clear: Box = { x: 10, y: 10, width: 40, height: 16 };
    expect(placePinLabel(lit, size, frame, { pins: [], labels: [clear, covered] }, 8).hidden).toEqual([1]);
  });
});

describe('coveredLabels', () => {
  it('finds the labels a pin covers', () => {
    const label: Box = { x: 100, y: 100, width: 60, height: 16 };
    const clear: Box = { x: 300, y: 300, width: 60, height: 16 };
    const pin: Box = { x: 140, y: 95, width: 26, height: 26 };
    expect(coveredLabels([label, clear], [pin])).toEqual([0]);
    expect(coveredLabels([label, clear], [])).toEqual([]);
  });
});
