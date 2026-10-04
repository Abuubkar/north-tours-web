/** A section the contents list links to. */
export type ContentsEntry = { id: string; number: number; heading: string };

export type TableOfContentsProps = {
  /** "Contents": the label over the list, and both navs' names. */
  label: string;
  /** The disclosure's summary on phones: "Contents (9)". */
  toggleLabel: string;
  /** The document's sections, in order. */
  sections: ContentsEntry[];
};
