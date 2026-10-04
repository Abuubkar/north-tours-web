import { describe, expect, it } from 'vitest';
import { DEFAULT_ANSWERS, type TripAnswers } from './plannerAnswers.ts';
import { postcard, type PostcardWords } from './plannerPostcard.ts';

const words: PostcardWords = { yourTrip: 'Your trip', destinations: { hunza: 'Hunza', skardu: 'Skardu', swat: 'Swat' } };
const card = (change: Partial<TripAnswers>, from: string | null = 'Lahore') => postcard({ ...DEFAULT_ANSWERS, ...change }, from, words);

describe('postcard', () => {
  it('reads “Your trip” on the page’s own photo, with no route, before a place is chosen', () => {
    expect(card({})).toEqual({ title: 'Your trip', photo: null, route: [] });
  });

  it('names one place, shows its photo and the road from Lahore', () => {
    expect(card({ destinations: ['hunza'] })).toEqual({ title: 'Hunza', photo: 'hunza', route: ['Lahore', 'Hunza'] });
  });

  it('joins several places with “+”, in the order chosen, the first one’s photo on top', () => {
    expect(card({ destinations: ['skardu', 'hunza'] })).toEqual({ title: 'Skardu + Hunza', photo: 'skardu', route: ['Lahore', 'Skardu', 'Hunza'] });
  });

  it('leaves “Not sure” out: alone it reads as no place yet', () => {
    expect(card({ destinations: ['unsure'] })).toEqual({ title: 'Your trip', photo: null, route: [] });
    expect(card({ destinations: ['unsure', 'swat'] })).toEqual({ title: 'Swat', photo: 'swat', route: ['Lahore', 'Swat'] });
  });

  it('starts the road from the city the group leaves from', () => {
    expect(card({ destinations: ['hunza'] }, 'Islamabad').route).toEqual(['Islamabad', 'Hunza']);
  });
});
