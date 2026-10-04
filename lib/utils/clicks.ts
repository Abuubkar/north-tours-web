/** The mouse buttons and keys of a click, as a click event carries them. */
export type ClickKeys = { button: number; metaKey: boolean; ctrlKey: boolean; shiftKey: boolean; altKey: boolean };

/**
 * A plain click (or Enter on a link): the main button, no modifier key. Anything else opens the
 * link in a new tab or window, or downloads it, and is left to the browser.
 */
export function isPlainClick({ button, metaKey, ctrlKey, shiftKey, altKey }: ClickKeys): boolean {
  return button === 0 && !metaKey && !ctrlKey && !shiftKey && !altKey;
}
