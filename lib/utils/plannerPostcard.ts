import type { TripAnswers } from './plannerAnswers.ts';
import { UNSURE } from './plannerOptions.ts';

/*
 * "Your trip so far" as a postcard (owner feedback, 2026-10-04): the chosen places over the first
 * one's photo, and the road to them from the departing city.
 */

/** The postcard's words: "Your trip" before a place is chosen, and the destinations' names by slug. */
export type PostcardWords = {
  yourTrip: string;
  destinations: Readonly<Record<string, string>>;
};

export type Postcard = {
  /** Over the photo: "Hunza", "Hunza + Skardu", or "Your trip" with none chosen (or only "Not sure"). */
  title: string;
  /** The destination whose photo shows, the first chosen; null for the page's own photo. */
  photo: string | null;
  /** The road from the departing city, ["Lahore", "Hunza", "Skardu"]; empty until a place is chosen. */
  route: string[];
};

/** The postcard for the answers so far; `from` is the departing city as the summary words it ("Lahore"). */
export function postcard(answers: TripAnswers, from: string | null, words: PostcardWords): Postcard {
  const places = answers.destinations.filter((id) => id !== UNSURE);
  const names = places.map((id) => words.destinations[id] ?? id);
  return {
    title: names.length > 0 ? names.join(' + ') : words.yourTrip,
    photo: places[0] ?? null,
    route: names.length > 0 && from ? [from, ...names] : [],
  };
}
