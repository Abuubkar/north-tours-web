import { describe, expect, it } from 'vitest';
import { isPlainClick } from './clicks.ts';

const click = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false };

describe('isPlainClick', () => {
  it('is a main-button click with no modifier key (Enter on a link too)', () => {
    expect(isPlainClick(click)).toBe(true);
  });

  it('isn’t a middle click, or one with Cmd, Ctrl, Shift or Alt', () => {
    expect(isPlainClick({ ...click, button: 1 })).toBe(false);
    for (const key of ['metaKey', 'ctrlKey', 'shiftKey', 'altKey'] as const) expect(isPlainClick({ ...click, [key]: true })).toBe(false);
  });
});
