import { readFileSync } from 'node:fs';
import path from 'node:path';
import { CONTENT_DIR } from './files.ts';
import { describe, expect, it } from 'vitest';
import {
  aboutCopyFile,
  type AboutCopy,
  creditsCopyFile,
  destinationCopyFile,
  loadDestinationCopy,
  type DestinationCopy,
  homeCopyFile,
  loadAboutCopy,
  loadCreditsCopy,
  loadHomeCopy,
  loadTourCopy,
  loadToursCopy,
  loadPlannerCopy,
  plannerCopyFile,
  type PlannerCopy,
  tourCopyFile,
  toursCopyFile,
  type HomeCopy,
  type TourCopy,
  type ToursCopy,
} from './pages.ts';
import { contentFixture } from './testing.ts';

const home: HomeCopy = JSON.parse(readFileSync(homeCopyFile(), 'utf8'));

function withChange(change: (copy: HomeCopy) => void) {
  const copy = structuredClone(home);
  change(copy);
  return loadHomeCopy(contentFixture({ 'pages/home.json': copy }));
}

const fields = (result: ReturnType<typeof loadHomeCopy>) => result.problems.map((p) => p.field);

describe('home page copy', () => {
  it('accepts the live file', () => {
    expect(loadHomeCopy().problems).toEqual([]);
  });

  it('rejects a missing or empty field, naming the file', () => {
    const result = withChange((c) => delete (c.hero as Partial<HomeCopy['hero']>).lead);
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].file).toMatch(/pages\/home\.json$/);
    expect(fields(withChange((c) => Object.assign(c.statement, { headline: ' ' })))).toEqual(['statement.headline']);
  });

  it('rejects a token the field does not take', () => {
    const result = withChange((c) => Object.assign(c.hero, { lead: 'Trips with a {advancePercent}% advance' }));
    expect(fields(result)).toEqual(['hero.lead']);
    expect(result.problems[0].message).toBe('Unknown token {advancePercent}. Takes no tokens');
  });

  it('needs a real photo for the hero, not a placeholder', () => {
    const result = withChange((c) => Object.assign(c.hero, { image: { placeholder: 'Hunza at dawn', alt: 'Hunza' } }));
    expect(fields(result)).toContain('hero.image.src');
  });
});

describe('booking steps', () => {
  it('needs exactly four steps', () => {
    expect(fields(withChange((c) => c.how.steps.pop()))).toEqual(['how.steps']);
    expect(fields(withChange((c) => c.how.steps.push({ ...c.how.steps[0] })))).toEqual(['how.steps']);
  });

  it('takes the settings tokens, and no others', () => {
    expect(withChange((c) => Object.assign(c.how.steps[0], { text: 'From {pickupPoint}, {advancePercent}%' })).problems).toEqual([]);
    const result = withChange((c) => Object.assign(c.how.steps[2], { text: 'Pay by {paymentMethod}.' }));
    expect(fields(result)).toEqual(['how.steps.2.text']);
    expect(result.problems[0].message).toBe(
      'Unknown token {paymentMethod}. Use only {advancePercent}, {paymentMethods}, {pickupPoint}, {fullRefundDays}, {childFromAge}',
    );
  });
});

describe('photo focus', () => {
  it('accepts a focus point in percent', () => {
    expect(withChange((c) => Object.assign(c.hero.image, { focus: { x: 0, y: 100 } })).problems).toEqual([]);
  });

  it.each([
    [{ x: -1, y: 50 }, 'hero.image.focus.x'],
    [{ x: 50, y: 101 }, 'hero.image.focus.y'],
  ])('rejects %o', (focus, field) => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { focus })))).toEqual([field]);
  });

  it('rejects a photo narrower than the smallest variant', () => {
    expect(fields(withChange((c) => Object.assign(c.hero.image, { width: 400 })))).toEqual(['hero.image.width']);
  });
});

describe('credits page copy', () => {
  it('accepts the live file', () => {
    expect(loadCreditsCopy().problems).toEqual([]);
  });

  it('rejects a missing headline', () => {
    const { headline, ...rest } = JSON.parse(readFileSync(creditsCopyFile(), 'utf8'));
    expect(headline).toBeTruthy();
    expect(loadCreditsCopy(contentFixture({ 'pages/credits.json': rest })).problems.map((p) => p.field)).toEqual(['headline']);
  });
});

describe('tour page copy', () => {
  const tour: TourCopy = JSON.parse(readFileSync(tourCopyFile(), 'utf8'));
  const withTourChange = (change: (copy: TourCopy) => void) => {
    const copy = structuredClone(tour);
    change(copy);
    return loadTourCopy(contentFixture({ 'pages/tour.json': copy }));
  };

  it('accepts the live file', () => {
    expect(loadTourCopy().problems).toEqual([]);
  });

  it('rejects a missing field, naming the file', () => {
    const result = withTourChange((c) => delete (c.facts as Partial<TourCopy['facts']>).nextDeparture);
    expect(result.problems.map((p) => p.field)).toEqual(['facts.nextDeparture']);
    expect(result.problems[0].file).toMatch(/pages\/tour\.json$/);
  });

  it('rejects a token the field does not take', () => {
    const result = withTourChange((c) => Object.assign(c, { title: '{tour}, {days} from Lahore' }));
    expect(result.problems.map((p) => p.field)).toEqual(['title']);
    expect(result.problems[0].message).toBe('Unknown token {days}. Use only {tour}, {duration}');
  });
});

describe('tours page copy', () => {
  const tours: ToursCopy = JSON.parse(readFileSync(toursCopyFile(), 'utf8'));
  const withToursChange = (change: (copy: ToursCopy) => void) => {
    const copy = structuredClone(tours);
    change(copy);
    return loadToursCopy(contentFixture({ 'pages/tours.json': copy }));
  };

  it('accepts the live file', () => {
    expect(loadToursCopy().problems).toEqual([]);
  });

  it('rejects a missing field, naming the file', () => {
    const result = withToursChange((c) => delete (c.header as Partial<ToursCopy['header']>).lead);
    expect(result.problems.map((p) => p.field)).toEqual(['header.lead']);
    expect(result.problems[0].file).toMatch(/pages\/tours\.json$/);
  });

  it('needs a label for every option of the fixed groups', () => {
    const result = withToursChange((c) => delete (c.filters.options.dur as Partial<ToursCopy['filters']['options']['dur']>)['8plus']);
    expect(result.problems.map((p) => p.field)).toEqual(['filters.options.dur.8plus']);
    expect(withToursChange((c) => delete (c.filters.options.type as Partial<ToursCopy['filters']['options']['type']>).corporate).problems).not.toEqual([]);
  });

  it('needs a label for every sort, and no others', () => {
    expect(withToursChange((c) => delete (c.sorts as Partial<ToursCopy['sorts']>).shortest).problems.map((p) => p.field)).toEqual([
      'sorts.shortest',
    ]);
    expect(withToursChange((c) => Object.assign(c.sorts, { cheapest: 'Cheapest' })).problems).not.toEqual([]);
  });

  it('rejects a token the field does not take', () => {
    const result = withToursChange((c) => Object.assign(c.results, { sortedBy: 'Sorted by {order}' }));
    expect(result.problems.map((p) => p.field)).toEqual(['results.sortedBy']);
    expect(result.problems[0].message).toBe('Unknown token {order}. Use only {sort}');
  });
});

describe('destination page copy', () => {
  const destination: DestinationCopy = JSON.parse(readFileSync(destinationCopyFile(), 'utf8'));
  const load = (change: (copy: DestinationCopy) => void) => {
    const copy = structuredClone(destination);
    change(copy);
    return loadDestinationCopy(contentFixture({ 'pages/destination.json': copy }));
  };
  const problems = (result: ReturnType<typeof loadDestinationCopy>) => result.problems.map((p) => p.field);

  it('accepts the live file', () => {
    expect(loadDestinationCopy().problems).toEqual([]);
  });

  it('rejects a missing field', () => {
    expect(problems(load((c) => delete (c.facts as Partial<DestinationCopy['facts']>).altitude))).toEqual(['facts.altitude']);
  });

  it('takes {destination} in the title, and no other token', () => {
    expect(load((c) => Object.assign(c, { title: 'Trips to {destination}' })).problems).toEqual([]);
    const result = load((c) => Object.assign(c, { title: '{name} tours from Lahore' }));
    expect(problems(result)).toEqual(['title']);
    expect(result.problems[0].message).toBe('Unknown token {name}. Use only {destination}');
    expect(problems(load((c) => Object.assign(c.hero, { backLabel: 'All {destination}' })))).toEqual(['hero.backLabel']);
  });
});

describe('destination calendar copy', () => {
  const destination: DestinationCopy = JSON.parse(readFileSync(destinationCopyFile(), 'utf8'));
  const load = (change: (copy: DestinationCopy) => void) => {
    const copy = structuredClone(destination);
    change(copy);
    return loadDestinationCopy(contentFixture({ 'pages/destination.json': copy })).problems.map((p) => p.field);
  };

  it('takes {destination} in the tours and banner wording, and no other token', () => {
    expect(load((c) => Object.assign(c.tours, { seeAll: 'Every {destination} trip' }))).toEqual([]);
    expect(load((c) => Object.assign(c.banner, { headline: '{valley}, on your own dates' }))).toEqual(['banner.headline']);
    expect(load((c) => Object.assign(c.banner, { lead: 'Trips to {destination}' }))).toEqual(['banner.lead']);
  });

  it('needs a label for every level and every season', () => {
    expect(load((c) => delete (c.calendar.levels as Partial<DestinationCopy['calendar']['levels']>).good)).toEqual(['calendar.levels.good']);
    expect(load((c) => delete (c.calendar.seasons as Partial<DestinationCopy['calendar']['seasons']>).winter)).toEqual(['calendar.seasons.winter']);
  });
});

describe('planner page copy', () => {
  const planner: PlannerCopy = JSON.parse(readFileSync(plannerCopyFile(), 'utf8'));
  const load = (change: (copy: PlannerCopy) => void) => {
    const copy = structuredClone(planner);
    change(copy);
    return loadPlannerCopy(contentFixture({ 'pages/planner.json': copy }));
  };
  const problems = (result: ReturnType<typeof loadPlannerCopy>) => result.problems.map((p) => p.field);

  it('accepts the live file', () => {
    expect(loadPlannerCopy().problems).toEqual([]);
  });

  it('needs a label for every option', () => {
    const result = load((c) => delete (c.whereWhen.length.options as Partial<PlannerCopy['whereWhen']['length']['options']>)['8-10']);
    expect(problems(result)).toEqual(['whereWhen.length.options.8-10']);
    expect(problems(load((c) => delete (c.whereWhen.dates.modes as Partial<PlannerCopy['whereWhen']['dates']['modes']>).exact))).toEqual([
      'whereWhen.dates.modes.exact',
    ]);
    expect(problems(load((c) => delete (c.whosComing.budget.options as Partial<PlannerCopy['whosComing']['budget']['options']>)['not-sure']))).toEqual([
      'whosComing.budget.options.not-sure',
    ]);
    expect(problems(load((c) => delete (c.whosComing.departingFrom.options as Partial<PlannerCopy['whosComing']['departingFrom']['options']>).other))).toEqual([
      'whosComing.departingFrom.options.other',
    ]);
  });

  it('takes {replyTime} in the lead and {step} and {title} in the progress, and no other token', () => {
    expect(load((c) => Object.assign(c.header, { lead: 'We reply {replyTime}.' })).problems).toEqual([]);
    const result = load((c) => Object.assign(c.header, { lead: 'We reply in {replyHours}.' }));
    expect(problems(result)).toEqual(['header.lead']);
    expect(result.problems[0].message).toBe('Unknown token {replyHours}. Use only {replyTime}');
    expect(problems(load((c) => Object.assign(c.progress, { step: 'Step {step} of {total}' })))).toEqual(['progress.step']);
    expect(problems(load((c) => Object.assign(c.errors, { month: 'Pick a month by {replyTime}.' })))).toEqual(['errors.month']);
    expect(load((c) => Object.assign(c.whosComing.ages, { child: 'Kid {count}' })).problems).toEqual([]);
    expect(problems(load((c) => Object.assign(c.whosComing.ages, { child: 'Child {number}' })))).toEqual(['whosComing.ages.child']);
    expect(load((c) => Object.assign(c.next, { steps: ['Reply {replyTime}.', 'A plan.', 'A {advancePercent}% advance.'] })).problems).toEqual([]);
    expect(problems(load((c) => Object.assign(c.next, { licence: 'Licence {licence}' })))).toEqual(['next.licence']);
  });

  it('needs exactly three next steps and a label for every row', () => {
    expect(problems(load((c) => c.next.steps.pop()))).toEqual(['next.steps']);
    expect(problems(load((c) => delete (c.aside.rows as Partial<PlannerCopy['aside']['rows']>).budget))).toEqual(['aside.rows.budget']);
  });
});

describe('about page copy', () => {
  const about: AboutCopy = JSON.parse(readFileSync(aboutCopyFile(), 'utf8'));
  /** The chosen reviews' files, so a fixture's choices have something to point at. */
  const reviews = Object.fromEntries(
    about.reviews.chosen.map((slug) => [`reviews/${slug}.json`, readFileSync(path.join(CONTENT_DIR, 'reviews', `${slug}.json`), 'utf8')]),
  );
  const load = (change: (copy: AboutCopy) => void) => {
    const copy = structuredClone(about);
    change(copy);
    return loadAboutCopy(contentFixture({ 'pages/about.json': copy, ...reviews }));
  };
  const problems = (result: ReturnType<typeof loadAboutCopy>) => result.problems.map((p) => p.field);

  it('accepts the live file', () => {
    expect(loadAboutCopy().problems).toEqual([]);
  });

  it('rejects a missing field, naming the file', () => {
    const result = load((c) => delete (c.header as Partial<AboutCopy['header']>).lead);
    expect(problems(result)).toEqual(['header.lead']);
    expect(result.problems[0].file).toMatch(/pages\/about\.json$/);
    expect(problems(load((c) => delete (c.story.founder as Partial<AboutCopy['story']['founder']>).name))).toEqual(['story.founder.name']);
  });

  it('takes {foundedYear} in the story headline, and no other token', () => {
    expect(load((c) => Object.assign(c.story, { headline: 'Since {foundedYear}' })).problems).toEqual([]);
    const result = load((c) => Object.assign(c.story, { headline: 'Running trips north since {year}' }));
    expect(problems(result)).toEqual(['story.headline']);
    expect(result.problems[0].message).toBe('Unknown token {year}. Use only {foundedYear}');
    expect(problems(load((c) => Object.assign(c.header, { headline: 'Since {foundedYear}' })))).toEqual(['header.headline']);
  });

  it('marks invented claims with sample: true, and nothing else (ADR-0019)', () => {
    expect(load((c) => Object.assign(c.story, { sample: true })).problems).toEqual([]);
    expect(load((c) => delete c.story.sample).problems).toEqual([]);
    const result = load((c) => Object.assign(c.story, { sample: false }));
    expect(problems(result)).toEqual(['story.sample']);
    expect(result.problems[0].message).toMatch(/ADR-0019/);
    expect(problems(load((c) => Object.assign(c.principles.items[1], { sample: 'yes' })))).toEqual(['principles.items.1.sample']);
    expect(problems(load((c) => Object.assign(c.principles.items[0], { sample: 1 })))).toEqual(['principles.items.0.sample']);
  });

  it('takes only its own tokens in the profile’s words', () => {
    expect(load((c) => Object.assign(c.guides.profile, { counter: '{index}/{total}' })).problems).toEqual([]);
    expect(problems(load((c) => Object.assign(c.guides.profile, { since: 'Since {joined}' })))).toEqual(['guides.profile.since']);
    expect(problems(load((c) => Object.assign(c.guides, { intro: 'Meet {name}' })))).toEqual(['guides.intro']);
  });

  it('needs a photo with alt text for each vehicle, and the fleet age', () => {
    expect(problems(load((c) => delete (c.vehicles.items[0] as Partial<AboutCopy['vehicles']['items'][0]>).image))).toEqual(['vehicles.items.0.image']);
    expect(problems(load((c) => Object.assign(c.vehicles.items[1].image, { alt: '' })))).toEqual(['vehicles.items.1.image.alt']);
    expect(problems(load((c) => Object.assign(c.vehicles.items[0], { image: { placeholder: 'A coaster', alt: 'A coaster' } })))).toContain(
      'vehicles.items.0.image.src',
    );
    expect(problems(load((c) => delete (c.vehicles as Partial<AboutCopy['vehicles']>).fleetAge))).toEqual(['vehicles.fleetAge']);
  });

  it('takes {dtsLicence} in the licence, and no other token', () => {
    expect(load((c) => Object.assign(c.credentials.licence, { value: 'Licence {dtsLicence}' })).problems).toEqual([]);
    const result = load((c) => Object.assign(c.credentials.licence, { value: 'DTS licence No. {licence}' }));
    expect(problems(result)).toEqual(['credentials.licence.value']);
    expect(result.problems[0].message).toBe('Unknown token {licence}. Use only {dtsLicence}');
    expect(problems(load((c) => Object.assign(c.numbers.travellers, { value: '{trips}' })))).toEqual(['numbers.travellers.value']);
  });

  it('accepts no memberships, and flags the sample one', () => {
    expect(load((c) => Object.assign(c.credentials.memberships, { items: [] })).problems).toEqual([]);
    expect(problems(load((c) => Object.assign(c.credentials.memberships.items[0], { sample: 'yes' })))).toEqual([
      'credentials.memberships.items.0.sample',
    ]);
  });

  it('needs one to three chosen reviews, each with a file', () => {
    expect(problems(load((c) => Object.assign(c.reviews, { chosen: [] })))).toEqual(['reviews.chosen']);
    const four = [...about.reviews.chosen, about.reviews.chosen[0]];
    expect(problems(load((c) => Object.assign(c.reviews, { chosen: four })))).toEqual(['reviews.chosen']);
    const result = load((c) => Object.assign(c.reviews, { chosen: [about.reviews.chosen[0], 'hunza-2026-13-nobody'] }));
    expect(problems(result)).toEqual(['reviews.chosen.1']);
    expect(result.problems[0].message).toBe('No review "hunza-2026-13-nobody" (expected a file in content/reviews)');
    expect(result.problems[0].file).toMatch(/pages\/about\.json$/);
  });

  it('keeps the founder’s portrait the owner’s: never a stock photo of a person (ADR-0009)', () => {
    const stock = { ...about.header.image, alt: 'A founder' };
    expect(problems(load((c) => Object.assign(c.story.founder, { portrait: stock })))).toEqual(['story.founder.portrait']);
  });
});
