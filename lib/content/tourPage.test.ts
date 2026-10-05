import { describe, expect, it } from 'vitest';
import { getTourPage, tourPageTitle } from './tourPage.ts';

describe('getTourPage', () => {
  it('gives the page title from the copy template', () => {
    expect(tourPageTitle('hunza-skardu-grand')).toBe('Hunza & Skardu Grand, 9 days from Lahore');
  });

  it('puts the tour’s own questions first, then the booking ones, every token filled', () => {
    const { tour, questions } = getTourPage('hunza-skardu-grand');
    expect(questions.slice(0, tour.faqs.length).map((q) => q.question)).toEqual(tour.faqs.map((q) => q.question));
    expect(questions.length).toBeGreaterThan(tour.faqs.length);
    for (const { answer } of questions) expect(answer).not.toMatch(/\{\w+\}/);
    expect(questions.map((q) => q.answer).join(' ')).toContain('cash or bank transfer');
  });

  it('shows at most three reviews, all of the tour, and none for a tour without', () => {
    const { reviews } = getTourPage('hunza-skardu-grand');
    expect(reviews.length).toBe(3);
    for (const { tourTitle } of reviews) expect(tourTitle).toBe('Hunza & Skardu Grand');
    expect(getTourPage('hunza-express').reviews).toEqual([]);
  });

  it('marks up the questions it shows, as shown, and no rating or review while they’re sample', () => {
    const { questions, structuredData } = getTourPage('hunza-skardu-grand');
    const marked = structuredData.faqs.mainEntity as { name: string; acceptedAnswer: { text: string } }[];
    expect(marked.map((q) => [q.name, q.acceptedAnswer.text])).toEqual(questions.map((q) => [q.question, q.answer]));
    expect(structuredData.trip).toMatchObject({ '@type': ['TouristTrip', 'Product'], aggregateRating: undefined, review: undefined });
  });
});
