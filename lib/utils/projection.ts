import type { RouteMap } from '../content/routeMap.ts';

/*
 * The route map's projection (CLAUDE.md §8: a schematic, no borders, no basemap). Latitude and
 * longitude become points in the 560×700 drawing: east–west distances are scaled by the
 * cosine of the middle latitude so the shape isn't stretched, and the points are fitted inside
 * a padding, centred. Graticule lines fall on every whole degree inside the frame, or on a finer
 * step for a smaller area (a destination's places map: every 0.1°).
 */

export const MAP_FRAME = { width: 560, height: 700, padding: 64 } as const;

/** A drawing's size and the margin kept clear around what it shows. */
export type MapFrame = { width: number; height: number; padding: number };

export type LatLon = { lat: number; lon: number };
export type MapPoint = { x: number; y: number };
type GridLine = { value: number; at: number; label: string };

type MapProjection = {
  project: (place: LatLon) => MapPoint;
  /** Lines of latitude: `at` is the y position, label e.g. "34°N". */
  parallels: GridLine[];
  /** Lines of longitude: `at` is the x position, label e.g. "73°E". */
  meridians: GridLine[];
};

const round = (n: number) => Math.round(n * 10) / 10;

/** Every multiple of `step` from `from` to `to`, e.g. 36.2, 36.3 and 36.4 for a step of 0.1. */
function gridValues(from: number, to: number, step: number): number[] {
  const first = Math.ceil(from / step - 1e-9);
  const last = Math.floor(to / step + 1e-9);
  return Array.from({ length: Math.max(0, last - first + 1) }, (_, i) => Number(((first + i) * step).toFixed(6)));
}

/** A line's label at the step's precision: "34°N", "36.3°N", "74.25°E". */
const degrees = (value: number, step: number, hemisphere: 'N' | 'E') =>
  `${value.toFixed(String(step).split('.')[1]?.length ?? 0)}°${hemisphere}`;

/**
 * A projection that fits `places` into the frame (the route map's unless given), with the
 * graticule lines inside it every `step` degrees (whole degrees unless given).
 */
export function mapProjection(places: readonly LatLon[], frame: MapFrame = MAP_FRAME, step = 1): MapProjection {
  const lats = places.map((p) => p.lat);
  const lons = places.map((p) => p.lon);
  const [minLat, maxLat, minLon, maxLon] = [Math.min(...lats), Math.max(...lats), Math.min(...lons), Math.max(...lons)];
  const xScale = Math.cos((((minLat + maxLat) / 2) * Math.PI) / 180);
  const inner = { width: frame.width - 2 * frame.padding, height: frame.height - 2 * frame.padding };
  const scale = Math.min(inner.width / ((maxLon - minLon) * xScale || 1), inner.height / (maxLat - minLat || 1));
  const centre = { lat: (minLat + maxLat) / 2, lon: (minLon + maxLon) / 2 };

  const x = (lon: number) => frame.width / 2 + (lon - centre.lon) * xScale * scale;
  const y = (lat: number) => frame.height / 2 - (lat - centre.lat) * scale;
  const latSpan = frame.height / 2 / scale;
  const lonSpan = frame.width / 2 / (xScale * scale);

  return {
    project: ({ lat, lon }) => ({ x: round(x(lon)), y: round(y(lat)) }),
    parallels: gridValues(centre.lat - latSpan, centre.lat + latSpan, step).map((lat) => ({ value: lat, at: round(y(lat)), label: degrees(lat, step, 'N') })),
    meridians: gridValues(centre.lon - lonSpan, centre.lon + lonSpan, step).map((lon) => ({ value: lon, at: round(x(lon)), label: degrees(lon, step, 'E') })),
  };
}

/** Points joined into an SVG path: "M10 20 L30 40 …". */
export function svgPath(points: readonly MapPoint[]): string {
  return points.map(({ x, y }, i) => `${i === 0 ? 'M' : 'L'}${x} ${y}`).join(' ');
}

/**
 * Where a point sits in a frame, in percent, as the CSS variables a map's HTML overlays (labels,
 * markers) are placed with, so they stay put at any size: { '--x': '25%', '--y': '40%' }.
 */
export function overlayPosition({ x, y }: MapPoint, frame: Pick<MapFrame, 'width' | 'height'>): Record<'--x' | '--y', string> {
  return { '--x': `${(x / frame.width) * 100}%`, '--y': `${(y / frame.height) * 100}%` };
}

type DrawableMap = Pick<RouteMap, 'stops' | 'roads'>;

/**
 * Everything the route map draws, in frame coordinates: each stop's point, each road as an
 * SVG path, and the graticule. The projection fits every stop and road bend into the frame.
 */
export function drawRouteMap({ stops, roads }: DrawableMap) {
  const byName = new Map(stops.map((stop) => [stop.name, stop]));
  const place = (point: RouteMap['roads']['main'][number][number]): LatLon =>
    typeof point === 'string' ? byName.get(point)! : point;
  const bends = [...roads.main, ...roads.valley].flat().filter((p) => typeof p !== 'string');
  const { project, parallels, meridians } = mapProjection([...stops, ...bends]);
  const path = (road: RouteMap['roads']['main'][number]) => svgPath(road.map((point) => project(place(point))));

  return {
    stops: stops.map((stop) => ({ ...stop, ...project(stop) })),
    roads: { main: roads.main.map(path), valley: roads.valley.map(path) },
    parallels,
    meridians,
  };
}
