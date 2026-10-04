/** A category's link: to its heading, with how many answers it holds (or match a search). */
export type CategoryLink = {
  id: string;
  title: string;
  count: number;
  /** Read out in place of the title and the bare count: "Booking & payment, 4 answers". */
  name: string;
};

export type CategoryNavProps = {
  /** Both navs' name: "Help categories". */
  label: string;
  links: CategoryLink[];
};
