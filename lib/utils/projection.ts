import type { RouteMap } from '../content/routeMap.ts';

/*
 * The route map's projection (CLAUDE.md §8: a schematic, no borders, no basemap). Latitude and
 * longitude become points in the 560×700 drawing: east–west distances are scaled by the
 * cosine of the middle latitude so the shape isn't stretched, and the points are fitted inside
 * a padding, centred. Graticule lines fall on every whole degree inside the frame.
 */

export const MAP_FRAME = { width: 560, height: 700, padding: 64 } as const;

/** A drawing's size and the margin kept clear around what it shows. */
export type MapFrame = { width: number; height: number; padding: number };

type LatLon = { lat: number; lon: number };
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

/** Every whole number from `from` to `to`. */
const wholeDegrees = (from: number, to: number) =>
  Array.from({ length: Math.floor(to) - Math.ceil(from) + 1 }, (_, i) => Math.ceil(from) + i);

/** A projection that fits `places` into the frame (the route map's unless given), with the graticule lines inside it. */
export function mapProjection(places: readonly LatLon[], frame: MapFrame = MAP_FRAME): MapProjection {
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
    parallels: wholeDegrees(centre.lat - latSpan, centre.lat + latSpan).map((lat) => ({ value: lat, at: round(y(lat)), label: `${lat}°N` })),
    meridians: wholeDegrees(centre.lon - lonSpan, centre.lon + lonSpan).map((lon) => ({ value: lon, at: round(x(lon)), label: `${lon}°E` })),
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
