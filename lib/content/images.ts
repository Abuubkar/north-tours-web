import { z } from 'zod';
import { nonEmpty } from './fields.ts';

const credit = z.discriminatedUnion('source', [
  z.strictObject({ source: z.literal('owner') }),
  z.strictObject({
    source: z.enum(['unsplash', 'wikimedia']),
    author: nonEmpty,
    licence: nonEmpty,
    sourceUrl: z.url(),
  }),
]);

/** A real photo: path, size and credit (ADR-0009). */
const photo = z.strictObject({
  src: z
    .string()
    .regex(/^\/images\/[\w/-]+\.(jpg|jpeg|png|webp|avif)$/, 'Use a path like /images/hunza/attabad.jpg'),
  alt: nonEmpty,
  width: z.int().positive(),
  height: z.int().positive(),
  credit,
});

/** Until a photo is chosen: the shot it should be, shown as the design's striped placeholder. */
const placeholder = z.strictObject({
  placeholder: nonEmpty,
  alt: nonEmpty,
});

/** Every image needs alt nonEmpty, whether it's a photo or still a placeholder. */
export const imageSchema = z.union([photo, placeholder], {
  error: 'Needs alt text and either a photo (src, width, height, credit) or a placeholder',
});

export type ContentImage = z.infer<typeof imageSchema>;
