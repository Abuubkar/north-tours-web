import { z } from 'zod';
import { IMAGE_WIDTHS } from '../utils/images.ts';
import { nonEmpty } from './fields.ts';

const ownerCredit = z.strictObject({ source: z.literal('owner') });

const credit = z.discriminatedUnion('source', [
  ownerCredit,
  z.strictObject({
    source: z.enum(['unsplash', 'wikimedia']),
    author: nonEmpty,
    licence: nonEmpty,
    sourceUrl: z.url(),
  }),
]);

const percent = z.number().min(0, 'Use 0 to 100').max(100, 'Use 0 to 100');

const photoFields = {
  /**
   * The source photo in content/images, named by its public path: "/images/hunza/attabad.jpg"
   * is content/images/hunza/attabad.jpg. `pnpm images` writes its variants (ADR-0015).
   */
  src: z
    .string()
    .regex(/^\/images\/[\w/-]+\.(jpg|jpeg|png|webp|avif)$/, 'Use a path like /images/hunza/attabad.jpg'),
  alt: nonEmpty,
  /** The source photo's size in pixels. */
  width: z.int().min(IMAGE_WIDTHS[0], `Use a photo at least ${IMAGE_WIDTHS[0]}px wide`),
  height: z.int().positive(),
  /** Where the subject is, in percent from the top-left; crops keep it in frame. The centre when left out. */
  focus: z.strictObject({ x: percent, y: percent }).optional(),
};

/** A real photo: path, size and credit (ADR-0009). */
export const photoSchema = z.strictObject({ ...photoFields, credit });

/** Until a photo is chosen: the shot it should be, shown as the design's striped placeholder. */
const placeholder = z.strictObject({
  placeholder: nonEmpty,
  alt: nonEmpty,
});

/** Every image needs alt nonEmpty, whether it's a photo or still a placeholder. */
export const imageSchema = z.union([photoSchema, placeholder], {
  error: 'Needs alt text and either a photo (src, width, height, credit) or a placeholder',
});

/** Photos of people come only from the owner (ADR-0009, CLAUDE.md §8): never a stock credit. */
export const portraitSchema = z.union([z.strictObject({ ...photoFields, credit: ownerCredit }), placeholder], {
  error: 'Needs alt text and either an owner photo (src, width, height, credit: owner) or a placeholder',
});

export type Photo = z.infer<typeof photoSchema>;
export type ContentImage = z.infer<typeof imageSchema>;
