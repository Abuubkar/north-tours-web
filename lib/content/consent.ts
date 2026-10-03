import { z } from 'zod';

/** People are shown only with their agreement (CLAUDE.md §7): reviews and guides need `consent: true`. */
export const consent = z.literal(true, {
  error: 'Needs consent: true (the person agreed to be shown on the site)',
});
