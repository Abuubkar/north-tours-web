export type FaqSectionProps = {
  headline: string;
  /** In order: the tour's own questions, then the shared booking ones (answers already filled). */
  questions: { question: string; answer: string }[];
};
