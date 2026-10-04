export type AskActionsProps = {
  /** "Ask on WhatsApp", with the general message. */
  askLabel: string;
  askHref: string;
  /** "Call us", left out while the phone number is a placeholder (its href undefined). */
  callLabel: string;
  callHref: string | undefined;
};
