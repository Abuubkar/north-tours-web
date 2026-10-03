import { describe, expect, it } from 'vitest';
import { paymentMethodsLabel } from './payments.ts';

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
