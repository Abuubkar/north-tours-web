export type HowBookingWorksProps = {
  copy: {
    headline: string;
    /** The four steps, their `{tokens}` already filled from settings. */
    steps: { title: string; text: string }[];
  };
};
