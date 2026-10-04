/** One numbered section of a legal document, its tokens already filled. */
export type LegalSectionProps = {
  /** Its anchor, e.g. "cookies": /privacy#cookies lands on it. */
  id: string;
  /** Its place in the document, from 1: sections are an outline people cite, so the number shows. */
  number: number;
  heading: string;
  paragraphs: string[];
};
