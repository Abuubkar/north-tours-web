/*
 * Keeping the places map's names clear (PRD #63): where the lit pin's name goes, and which
 * context labels to hide. The browser measures the boxes; these decide.
 */

/** A box in the map, in pixels: a pin's circle, a label. */
export type Box = { x: number; y: number; width: number; height: number };

/** The four spots a lit pin's name can take, in the order they're tried. */
const LABEL_SPOTS = ['above', 'below', 'right', 'left'] as const;

export type LabelSpot = (typeof LABEL_SPOTS)[number];

export const overlaps = (a: Box, b: Box) => a.x < b.x + b.width && b.x < a.x + a.width && a.y < b.y + b.height && b.y < a.y + a.height;

const inside = (a: Box, frame: Box) =>
  a.x >= frame.x && a.y >= frame.y && a.x + a.width <= frame.x + frame.width && a.y + a.height <= frame.y + frame.height;

/** The box a label of `size` takes at `spot` beside `pin`, `gap` away. */
export function labelBox(pin: Box, size: Pick<Box, 'width' | 'height'>, spot: LabelSpot, gap: number): Box {
  const centreX = pin.x + pin.width / 2 - size.width / 2;
  const centreY = pin.y + pin.height / 2 - size.height / 2;
  const at = {
    above: { x: centreX, y: pin.y - gap - size.height },
    below: { x: centreX, y: pin.y + pin.height + gap },
    right: { x: pin.x + pin.width + gap, y: centreY },
    left: { x: pin.x - gap - size.width, y: centreY },
  };
  return { ...at[spot], ...size };
}

/**
 * Where a lit pin's name goes (as designed): the first of above, below, right and left that stays
 * inside the frame and clears the other pins; failing that, the first inside the frame. Context
 * labels it would cover are hidden.
 */
export function placePinLabel(
  pin: Box,
  size: Pick<Box, 'width' | 'height'>,
  frame: Box,
  others: { pins: readonly Box[]; labels: readonly Box[] },
  gap: number,
): { spot: LabelSpot; hidden: number[] } {
  const boxes = LABEL_SPOTS.map((spot) => ({ spot, box: labelBox(pin, size, spot, gap) }));
  const fits = boxes.filter(({ box }) => inside(box, frame));
  const { spot, box } = fits.find(({ box }) => !others.pins.some((p) => overlaps(box, p))) ?? fits[0] ?? boxes[0];
  return { spot, hidden: coveredLabels(others.labels, [box]) };
}

/** The labels (by index) any of `covers` overlaps: context labels under a pin at this size, or under the lit pin's name. */
export function coveredLabels(labels: readonly Box[], covers: readonly Box[]): number[] {
  return labels.flatMap((label, i) => (covers.some((cover) => overlaps(label, cover)) ? [i] : []));
}
