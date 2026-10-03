import { describe, expect, it } from 'vitest';
import { fillTokens, tokensIn } from './tokens.ts';

describe('tokensIn', () => {
  it('lists the tokens in order', () => {
    expect(tokensIn('Hi, I’m interested in {tour} on {date}.')).toEqual(['tour', 'date']);
    expect(tokensIn('No tokens here')).toEqual([]);
  });
});

describe('fillTokens', () => {
  it('fills every token, including repeats', () => {
    expect(fillTokens('{a} and {b}, then {a}', { a: 'one', b: 'two' })).toBe('one and two, then one');
  });

  it('leaves text without tokens as it is', () => {
    expect(fillTokens('Plan on WhatsApp', {})).toBe('Plan on WhatsApp');
  });

  it('throws on a token with no value', () => {
    expect(() => fillTokens('Hi {name}', { tour: 'x' })).toThrow('No value for {name}');
  });
});
