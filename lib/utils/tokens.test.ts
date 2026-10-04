import { describe, expect, it } from 'vitest';
import { fillTokens, settingsTokens, tokensIn } from './tokens.ts';

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

describe('settingsTokens', () => {
  it('fills step 3 from the advance and the payment methods (ADR-0008)', () => {
    const values = settingsTokens({
      booking: { advancePercent: 30, replyTime: 'within 2 hours', pickupPoint: '[Pickup point], Lahore' },
      payments: { methods: ['Cash', 'Bank transfer'] },
    });
    expect(fillTokens('Hold your seats with a {advancePercent}% advance, paid by {paymentMethods}.', values)).toBe(
      'Hold your seats with a 30% advance, paid by cash or bank transfer.',
    );
    expect(fillTokens('Meet us at {pickupPoint}.', values)).toBe('Meet us at [Pickup point], Lahore.');
  });
});
