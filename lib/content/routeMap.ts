import path from 'node:path';
import { z } from 'zod';
import { CONTENT_DIR, parseFile, requireValid } from './files.ts';
import { copy, latitude, longitude, nonEmpty } from './fields.ts';

/*
 * The route map (CLAUDE.md §8): a schematic of the road north, drawn from coordinates. No
 * borders and no basemap. The final map needs Survey of Pakistan vetting before launch.
 */

const stop = z.strictObject({
  name: nonEmpty,
  lat: latitude,
  lon: longitude,
  /** start: Lahore, a square. waypoint: a ring. destination: a gold dot. */
  kind: z.enum(['start', 'waypoint', 'destination']),
  /** Which side of the marker the label sits, so labels don't collide. */
  label: z.enum(['left', 'right', 'below']),
});

/** A point on a road: a stop by name, or an unmarked bend where the road turns. */
const roadPoint = z.union([nonEmpty, z.strictObject({ lat: latitude, lon: longitude })]);
const road = z.array(roadPoint).min(2, 'A road joins at least two points');

const routeMapSchema = z
  .strictObject({
    /** What the map shows, read out in place of the drawing. */
    description: copy,
    caption: z.strictObject({ title: copy, note: copy }),
    /** Shown after the start's name: "Lahore · start". */
    startLabel: copy,
    legend: z.strictObject({ mainRoute: copy, valleyRoads: copy, destinations: copy }),
    stops: z.array(stop).min(2),
    roads: z.strictObject({ main: z.array(road).min(1), valley: z.array(road) }),
    /** The list beside the map: the main route's stops in order. */
    list: z.strictObject({
      heading: copy,
      /** Read out for the gold dot that marks a destination in the list. */
      destinationLabel: copy,
      stops: z.array(z.strictObject({ stop: nonEmpty, elevation: z.int().min(0), note: copy })).min(2),
    }),
  })
  .superRefine((map, ctx) => {
    const names = new Set<string>();
    map.stops.forEach(({ name }, i) => {
      if (names.has(name)) ctx.addIssue({ code: 'custom', message: `"${name}" is listed twice`, path: ['stops', i, 'name'] });
      names.add(name);
    });
    const known = (name: string, path: (string | number)[]) => {
      if (!names.has(name)) ctx.addIssue({ code: 'custom', message: `No stop named "${name}"`, path });
    };
    for (const kind of ['main', 'valley'] as const) {
      map.roads[kind].forEach((road, i) =>
        road.forEach((point, j) => typeof point === 'string' && known(point, ['roads', kind, i, j])),
      );
    }
    map.list.stops.forEach(({ stop }, i) => known(stop, ['list', 'stops', i, 'stop']));
  });

export type RouteMap = z.infer<typeof routeMapSchema>;

export function routeMapFile(dir = CONTENT_DIR): string {
  return path.join(dir, 'route-map.json');
}

export function loadRouteMap(dir = CONTENT_DIR) {
  return parseFile(routeMapSchema, routeMapFile(dir));
}

let cached: RouteMap | undefined;

export function getRouteMap(): RouteMap {
  cached ??= requireValid(loadRouteMap());
  return cached;
}
