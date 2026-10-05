import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, within } from 'storybook/test';
import {
  noSavedPlanner,
  sampleAnswers,
  sampleBarWords,
  samplePlannerCopy,
  samplePlannerDestinations,
  withAnswers,
  withAnsweredPlanner,
  withPlanner,
} from '../samplePlanner';
import { PlannerAside } from './PlannerAside';

const meta = {
  title: 'Planner/PlannerAside',
  component: PlannerAside,
  args: { copy: samplePlannerCopy.aside, next: samplePlannerCopy.next, destinations: samplePlannerDestinations, barWords: sampleBarWords },
  beforeEach: noSavedPlanner,
  globals: { viewport: { value: 'desktop' } },
} satisfies Meta<typeof PlannerAside>;

export default meta;
type Story = StoryObj<typeof meta>;

type Canvas = ReturnType<typeof within>;

const postcard = (canvas: Canvas) => within(canvas.getByRole('heading', { name: 'Your trip so far' }).closest('section')!);

/**
 * From 1100px: a named aside, 380px wide, sticky under the header. The postcard: Hunza's photo
 * with its name over it, the road from Lahore, the count and the rows; then what happens next.
 */
export const Desktop: Story = {
  decorators: [withAnsweredPlanner],
  play: async ({ canvas }) => {
    const aside = canvas.getByRole('complementary', { name: 'Your trip so far' });
    await expect(getComputedStyle(aside).flexBasis).toBe('380px');
    await expect(getComputedStyle(aside).position).toBe('sticky');
    await expect(await canvas.findByText('7 of 9')).toBeVisible();
    await expect(canvas.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)).toEqual(['Your trip so far', 'What happens next']);
    const card = postcard(canvas);
    await expect(card.getByRole('img', { name: 'A view of Hunza' })).toBeVisible();
    await expect(card.getByText('Hunza', { selector: 'p' })).toBeVisible();
    await expect(card.getByText('Lahore → Hunza')).toBeVisible();
    await expect(card.getByText('Lahore to Hunza')).toBeInTheDocument();
    // The raised dark card: 8px, a hairline border.
    const box = getComputedStyle(card.getByRole('heading', { name: 'Your trip so far' }).closest('section')!);
    await expect([box.borderRadius, box.borderTopWidth]).toEqual(['8px', '1px']);
  },
};

export const DesktopOnLight: Story = { ...Desktop, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Nothing chosen yet: the page's own photo and "Your trip", no road, and each empty row reads "Not yet". */
export const NoDestination: Story = {
  decorators: [withPlanner],
  play: async ({ canvas }) => {
    const card = postcard(canvas);
    await expect(card.getByRole('img', { name: samplePlannerCopy.aside.image.alt })).toBeVisible();
    await expect(card.getByText('Your trip', { selector: 'p' })).toBeVisible();
    await expect(card.queryByText(/→/)).toBeNull();
    await expect(card.getAllByText('Not yet')).toHaveLength(7);
    await expect(card.getByText('2 of 9')).toBeVisible();
  },
};

export const NoDestinationOnLight: Story = { ...NoDestination, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** Only "Help me choose": still the page's photo and "Your trip". */
export const HelpMeChoose: Story = {
  decorators: [withAnswers({ ...sampleAnswers, destinations: ['unsure'] })],
  play: async ({ canvas }) => {
    const card = postcard(canvas);
    await expect(await card.findByText('Your trip', { selector: 'p' })).toBeVisible();
    await expect(card.getByRole('img', { name: samplePlannerCopy.aside.image.alt })).toBeVisible();
  },
};

/** Several places: "Hunza + Skardu" on the first one's photo, and the road through both. */
export const SeveralDestinations: Story = {
  decorators: [withAnswers({ ...sampleAnswers, destinations: ['hunza', 'skardu'] })],
  play: async ({ canvas }) => {
    const card = postcard(canvas);
    await expect(await card.findByText('Hunza + Skardu')).toBeVisible();
    await expect(card.getByRole('img', { name: 'A view of Hunza' })).toBeVisible();
    await expect(card.getByText('Lahore → Hunza → Skardu')).toBeVisible();
  },
};

/** Below 1100px it isn't shown (the summary bar takes over). */
export const Phone: Story = {
  decorators: [withAnsweredPlanner],
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('complementary')).toBeNull();
  },
};
