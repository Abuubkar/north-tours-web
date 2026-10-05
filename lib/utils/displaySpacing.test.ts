import { describe, expect, it } from 'vitest';
import { displayLetters, unmeasuredLetters } from './displaySpacing.ts';

describe('display word spacing', () => {
  it('gives each letter of NORTH its measured side space, in order', () => {
    expect(displayLetters('NORTH')).toEqual([
      { char: 'N', left: 0.08, right: 0.08 },
      { char: 'O', left: 0.043, right: 0.043 },
      { char: 'R', left: 0.08, right: 0.0578 },
      { char: 'T', left: 0.0112, right: 0.0112 },
      { char: 'H', left: 0.08, right: 0.08 },
    ]);
  });

  it('gives an empty word no letters', () => {
    expect(displayLetters('')).toEqual([]);
  });

  it('names the letters with no measured side space, each once', () => {
    expect(unmeasuredLetters('NORTH')).toEqual([]);
    expect(unmeasuredLetters('SOUTHS')).toEqual(['S', 'U']);
    expect(unmeasuredLetters('north')).toEqual(['n', 'o', 'r', 't', 'h']);
  });

  it('refuses a letter with no measured side space', () => {
    expect(() => displayLetters('NORTHS')).toThrow('No measured side space for "S"');
  });
});
