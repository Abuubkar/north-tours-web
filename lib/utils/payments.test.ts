import { describe, expect, it } from 'vitest';
import { paymentMethodsLabel, paymentMethodsText } from './payments.ts';

describe('paymentMethodsLabel', () => {
  it('joins the methods with a middle dot', () => {
    expect(paymentMethodsLabel({ payments: { methods: ['Cash', 'Bank transfer'] } })).toBe(
      'Cash · Bank transfer',
    );
  });

  it('shows a single method on its own', () => {
    expect(paymentMethodsLabel({ payments: { methods: ['Bank transfer'] } })).toBe('Bank transfer');
  });
});

describe('paymentMethodsText', () => {
  const text = (methods: string[]) => paymentMethodsText({ payments: { methods } });

  it('reads as part of a sentence', () => {
    expect(text(['Cash', 'Bank transfer'])).toBe('cash or bank transfer');
  });

  it('lists three or more with commas', () => {
    expect(text(['Cash', 'Bank transfer', 'Cheque'])).toBe('cash, bank transfer or cheque');
  });

  it('shows a single method on its own', () => {
    expect(text(['Bank transfer'])).toBe('bank transfer');
  });
});
