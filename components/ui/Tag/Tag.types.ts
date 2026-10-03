import type { ReactNode } from 'react';

export type TagProps = {
  /**
   * urgent: "Only 3 seats left", on a photo. soldout: "Sold out", on a photo.
   * category: a place type such as "Heritage", on the page surface.
   */
  variant: 'urgent' | 'soldout' | 'category';
  children: ReactNode;
};
