import { mapProjection, type LatLon, type MapFrame, type MapPoint } from './projection.ts';

/*
 * A destination's places map (PRD #63): its places drawn with the route map's projection
 * (#43), fitted to them as a tour's itinerary map is (#54). Schematic only: graticule, numbered
 * pins and a few context labels; no roads, borders or basemap (CLAUDE.md §8).
 */

/** From this width the map sits beside the list, sticky; below it, above the list. */
export const SIDE_BY_SIDE_QUERY = '(width >= 820px)';

/** The drawing: 484×420, with room around the places for their pins and labels. */
export const PLACES_MAP_FRAME = { width: 484, height: 420, padding: 56 } as const;

/** One place alone, or a tight cluster, still spans this many degrees, so it isn't drawn at street scale. */
const MIN_SPAN = 0.05;

/** Graticule steps to choose from, in degrees: the finest that keeps the lines this few. */
const STEPS = [0.01, 0.02, 0.05, 0.1, 0.2, 0.25, 0.5, 1];
const MAX_LINES = 6;

/**
 * Pins closer than this (in drawing units) are eased apart, so no pin hides another and, on the
 * narrowest map (about 350px, 0.72 of the drawing), one pin's 44px target never covers the
 * middle of another's.
 */
export const PIN_SPACING = 44;

/** How far a context label outside the frame sits in from its edge, and beside its point inside it. */
const EDGE_INSET = 8;

/** A context label's size as drawn at full size (12px text): about this wide per character, and this tall. */
const LABEL_CHAR_W = 6.5;
const LABEL_H = 16;

/** A pin's circle reaches this far from its point, with a little room. */
const PIN_REACH = 15;

/** The points to fit: the places' bounds, widened about their centre to at least `MIN_SPAN` each way. */
export function fittedBounds(places: readonly LatLon[]): LatLon[] {
  const lats = places.map((p) => p.lat);
  const lons = places.map((p) => p.lon);
  const widen = (min: number, max: number) => {
    const half = Math.max(max - min, MIN_SPAN) / 2;
    const mid = (min + max) / 2;
    return [mid - half, mid + half];
  };
  const [south, north] = widen(Math.min(...lats), Math.max(...lats));
  const [west, east] = widen(Math.min(...lons), Math.max(...lons));
  return [
    { lat: south, lon: west },
    { lat: north, lon: east },
  ];
}

/** The finest step that draws at most `MAX_LINES` lines across `span` degrees. */
export function graticuleStep(span: number): number {
  return STEPS.find((step) => span / step <= MAX_LINES) ?? STEPS[STEPS.length - 1];
}

/**
 * Pins eased apart until none is closer than `PIN_SPACING` to another (a schematic, so a pin may
 * move a little from its true spot), then kept inside the frame's padding. Same input, same result.
 */
export function spreadPins(points: readonly MapPoint[], frame: MapFrame): MapPoint[] {
  const pins = points.map((p) => ({ ...p }));
  for (let pass = 0; pass < 50; pass++) {
    let moved = false;
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const dx = pins[j].x - pins[i].x;
        const dy = pins[j].y - pins[i].y;
        const distance = Math.hypot(dx, dy);
        if (distance >= PIN_SPACING) continue;
        // Coincident pins part sideways.
        const [ux, uy] = distance === 0 ? [1, 0] : [dx / distance, dy / distance];
        const push = (PIN_SPACING - distance) / 2 + 0.01;
        pins[i].x -= ux * push;
        pins[i].y -= uy * push;
        pins[j].x += ux * push;
        pins[j].y += uy * push;
        moved = true;
      }
    }
    for (const pin of pins) {
      pin.x = Math.min(Math.max(pin.x, frame.padding), frame.width - frame.padding);
      pin.y = Math.min(Math.max(pin.y, frame.padding), frame.height - frame.padding);
    }
    if (!moved) break;
  }
  return pins.map(({ x, y }) => ({ x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 }));
}

/** Where a context label sits: inside the frame at its place, or outside it at the nearest edge with an arrow. */
export type ContextLabel = {
  /** As shown: "Karimabad", or "↓ Gilgit" for a place beyond the frame. */
  text: string;
  x: number;
  y: number;
  /** The edge it's pinned to when its place is outside the frame. */
  edge: 'top' | 'bottom' | 'left' | 'right' | null;
  /** Its text runs from its point (start) or up to it (end), so it stays inside the frame. */
  align: 'start' | 'end';
};

const ARROWS = { top: '↑', bottom: '↓', left: '←', right: '→' } as const;

/**
 * How badly a label beside its point (to the right for start, the left for end) would clash: the
 * area it covers of the pins, or Infinity when it would leave the frame.
 */
function clash(name: string, { x, y }: MapPoint, align: ContextLabel['align'], pins: readonly MapPoint[], width: number): number {
  const w = name.length * LABEL_CHAR_W;
  const left = align === 'start' ? x + EDGE_INSET : x - EDGE_INSET - w;
  if (left < 0 || left + w > width) return Infinity;
  const covered = (pin: MapPoint) =>
    Math.max(0, Math.min(left + w, pin.x + PIN_REACH) - Math.max(left, pin.x - PIN_REACH)) *
    Math.max(0, Math.min(y + LABEL_H / 2, pin.y + PIN_REACH) - Math.max(y - LABEL_H / 2, pin.y - PIN_REACH));
  return pins.reduce((sum, pin) => sum + covered(pin), 0);
}

/**
 * A context label for a named point: inside the frame, beside its point on whichever side keeps
 * it off the pins; outside it, at the top or bottom edge when it lies beyond that edge (as the
 * design puts "↑ Khunjerab" and "↓ Gilgit"), otherwise at the left or right, with an arrow.
 */
export function contextLabel(
  name: string,
  { x, y }: MapPoint,
  frame: Pick<MapFrame, 'width' | 'height'>,
  pins: readonly MapPoint[] = [],
): ContextLabel {
  const beyondX = x < 0 ? -x : Math.max(0, x - frame.width);
  const beyondY = y < 0 ? -y : Math.max(0, y - frame.height);
  const clampX = Math.min(Math.max(x, EDGE_INSET), frame.width - EDGE_INSET);
  const clampY = Math.min(Math.max(y, EDGE_INSET), frame.height - EDGE_INSET);
  const align = clampX > frame.width / 2 ? 'end' : 'start';
  if (beyondX === 0 && beyondY === 0) {
    const other = align === 'start' ? 'end' : 'start';
    const side = clash(name, { x, y }, other, pins, frame.width) < clash(name, { x, y }, align, pins, frame.width) ? other : align;
    return { text: name, x, y, edge: null, align: side };
  }
  if (beyondY > 0) {
    const edge = y < 0 ? 'top' : 'bottom';
    return { text: `${ARROWS[edge]} ${name}`, x: clampX, y: edge === 'top' ? EDGE_INSET : frame.height - EDGE_INSET, edge, align };
  }
  const edge = x < 0 ? 'left' : 'right';
  return {
    text: `${ARROWS[edge]} ${name}`,
    x: edge === 'left' ? EDGE_INSET : frame.width - EDGE_INSET,
    y: clampY,
    edge,
    align: edge === 'left' ? 'start' : 'end',
  };
}

/** Everything the places map draws, in the frame's coordinates: the pins in list order, the graticule and the context labels. */
export function drawPlacesMap(
  places: readonly (LatLon & { id: string; name: string })[],
  labels: readonly (LatLon & { name: string })[] = [],
) {
  const frame = PLACES_MAP_FRAME;
  const bounds = fittedBounds(places);
  const { project } = mapProjection(bounds, frame);
  // How many degrees the frame spans each way sets the graticule's step.
  const origin = project({ lat: 0, lon: 0 });
  const north = project({ lat: 1, lon: 0 });
  const east = project({ lat: 0, lon: 1 });
  const step = graticuleStep(Math.max(frame.height / (origin.y - north.y), frame.width / (east.x - origin.x)));
  const projection = mapProjection(bounds, frame, step);
  const pins = spreadPins(places.map((place) => projection.project(place)), frame);
  return {
    pins: places.map((place, i) => ({ id: place.id, name: place.name, ...pins[i] })),
    parallels: projection.parallels,
    meridians: projection.meridians,
    labels: labels.map((label) => contextLabel(label.name, projection.project(label), frame, pins)),
  };
}
