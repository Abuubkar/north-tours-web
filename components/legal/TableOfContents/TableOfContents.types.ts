/** A section the contents list links to. */
export type ContentsEntry = { id: string; number: number; heading: string };

export type TableOfContentsProps = {
  /** "Contents": the label over the list, and both navs' names. */
  label: string;
  /** The disclosure's summary on phones, with the count: "Contents (9)". */
  countLabel: string;
  /** The document's sections, in order. */
  sections: ContentsEntry[];
};

/** The numbered links, in either form's look. */
export type ContentsLinksProps = {
  sections: ContentsEntry[];
  linkClass: string;
};
