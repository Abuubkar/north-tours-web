export type StarRatingProps = {
  /** Whole stars out of five, as given in the review. */
  rating: 1 | 2 | 3 | 4 | 5;
  /** Star size in px: 15 on review cards, 13 on compact cards. */
  size?: 15 | 13;
};
