import { z } from 'zod';

/** A clearly marked stand-in such as "[+92 3XX XXX XXXX]", replaced before launch (ADR-0010). */
export const PLACEHOLDER = /^\[[^\]]+\]$/;

/** Accepts a real value that passes `schema`, or a `[placeholder]`. `expected` names the value. */
export function orPlaceholder<T extends z.ZodType>(schema: T, expected: string) {
  return z.union([z.string().regex(PLACEHOLDER), schema], {
    error: `Must be ${expected}, or a [placeholder]`,
  });
}

export const text = z.string().trim().min(1, 'Must not be empty');

/** Pakistani numbers in international form: +92 followed by 9–10 digits, spaces allowed. */
export const phone = z
  .string()
  .regex(/^\+92(\s?\d){9,10}$/, 'Use international form, e.g. +92 300 1234567');
