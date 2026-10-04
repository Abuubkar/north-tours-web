import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, waitFor, within } from 'storybook/test';
import { realUser } from '../../../.storybook/realUser';
import { Button } from '../Button/Button';
import { IconButton } from '../IconButton/IconButton';
import { Sheet } from './Sheet';
import type { SheetProps } from './Sheet.types';

type DemoProps = { title: string; variant?: SheetProps['variant']; handle?: boolean; startOpen?: boolean; withFooter?: boolean };

function SheetDemo({ variant, handle, title, startOpen = false, withFooter = false }: DemoProps) {
  const [open, setOpen] = useState(startOpen);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show {title.toLowerCase()}
      </Button>
      {variant === 'drawer' ? (
        <Sheet open={open} onClose={() => setOpen(false)} title={title} variant="drawer">
          <p>Lead guide, Hunza. Speaks Burushaski, Urdu and English.</p>
        </Sheet>
      ) : (
        <Sheet
          open={open}
          onClose={() => setOpen(false)}
          title={title}
          handle={handle}
          footer={withFooter ? <Button onClick={() => setOpen(false)}>Show 8 trips</Button> : undefined}
        >
          {(withFooter ? REPEATS : [0]).map((n) => (
            <p key={n}>Choose the dates that suit your family. Prices are per person, twin sharing.</p>
          ))}
          {withFooter ? <Button variant="secondary">Any dates</Button> : <Button>Show 8 trips</Button>}
        </Sheet>
      )}
    </>
  );
}

/** Enough paragraphs to make the body scroll. */
const REPEATS = Array.from({ length: 30 }, (_, n) => n);

const meta = { title: 'Base/Sheet', component: Sheet } satisfies Meta<typeof Sheet>;

export default meta;
type RenderStory = StoryObj;

export const BottomSheet: RenderStory = {
  render: () => <SheetDemo title="Filters" variant="bottom" handle startOpen />,
};

export const BottomSheetOnLight: RenderStory = {
  ...BottomSheet,
  globals: { surface: 'light' },
};

export const BottomSheetNoHandle: RenderStory = {
  render: () => <SheetDemo title="Sort" variant="bottom" startOpen />,
};

export const BottomSheetNoHandleOnLight: RenderStory = {
  ...BottomSheetNoHandle,
  globals: { surface: 'light' },
};

export const Drawer: RenderStory = {
  render: () => <SheetDemo title="Guide profile" variant="drawer" startOpen />,
};

export const DrawerOnLight: RenderStory = { ...Drawer, globals: { surface: 'light' } };

/** Opens from its trigger as a modal: the page behind is inert. */
export const Opens: RenderStory = {
  render: () => <SheetDemo title="Filters" handle />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show filters' }));
    const dialog = canvas.getByRole('dialog', { name: 'Filters' });
    await expect(dialog).toBeVisible();
    await expect(dialog.matches(':modal')).toBe(true);
    // The page behind is inert: its trigger can't take focus while the sheet is open.
    const trigger = canvas.getByRole('button', { name: 'Show filters', hidden: true });
    trigger.focus();
    await expect(trigger).not.toHaveFocus();
  },
};

/** The close button is labelled, closes the sheet and returns focus to the trigger. */
export const CloseButton: RenderStory = {
  render: () => <SheetDemo title="Filters" />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show filters' });
    await userEvent.click(trigger);
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

/** Clicking the backdrop closes it. */
export const Backdrop: RenderStory = {
  render: () => <SheetDemo title="Sort" />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show sort' }));
    const dialog = canvas.getByRole('dialog', { name: 'Sort' });
    await userEvent.click(dialog);
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
  },
};

/** Escape closes it and focus goes back to the trigger (real key press under `pnpm test`). */
export const Escape: RenderStory = {
  render: () => <SheetDemo title="Filters" />,
  play: async ({ canvas, userEvent }) => {
    const trigger = canvas.getByRole('button', { name: 'Show filters' });
    await userEvent.click(trigger);
    await expect(canvas.getByRole('dialog', { name: 'Filters' })).toBeVisible();

    const keys = await realUser();
    if (!keys) return;
    await keys.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('dialog')).toBeNull());
    await expect(trigger).toHaveFocus();
  },
};

/** A pinned footer stays in view under the body, which scrolls on its own. */
export const WithFooter: RenderStory = {
  render: () => <SheetDemo title="Filters" handle startOpen withFooter />,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas }) => {
    const dialog = canvas.getByRole('dialog', { name: 'Filters' });
    const button = canvas.getByRole('button', { name: 'Show 8 trips' });
    // Once it has slid up into place.
    await waitFor(() => expect(button.getBoundingClientRect().bottom).toBeLessThanOrEqual(window.innerHeight));
    const body = dialog.querySelector('p')!.parentElement!;
    await expect(body.scrollHeight).toBeGreaterThan(body.clientHeight);
  },
};

export const WithFooterOnLight: RenderStory = { ...WithFooter, globals: { surface: 'light', viewport: { value: 'phone' } } };

function ActionsDemo({ variant }: { variant: 'bottom' | 'drawer' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show profile
      </Button>
      <Sheet
        open={open}
        onClose={() => setOpen(false)}
        title="Karim Baig"
        variant={variant}
        actions={
          <>
            <span>2 of 6</span>
            <IconButton icon="arrowLeft" label="Previous profile" />
            <IconButton icon="arrowRight" label="Next profile" />
          </>
        }
      >
        <p>Lead guide, Hunza. Speaks Burushaski, Urdu and English.</p>
      </Sheet>
    </>
  );
}

/**
 * Header actions sit between the title and Close (a guide profile's counter, previous and next).
 * Close still takes focus when the sheet opens.
 */
export const WithActions: RenderStory = {
  render: () => <ActionsDemo variant="drawer" />,
  globals: { viewport: { value: 'desktop' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show profile' }));
    const dialog = canvas.getByRole('dialog', { name: 'Karim Baig' });
    const close = canvas.getByRole('button', { name: 'Close' });
    await waitFor(() => expect(close).toHaveFocus());
    const buttons = within(dialog).getAllByRole('button').map((b) => b.getAttribute('aria-label'));
    await expect(buttons).toEqual(['Previous profile', 'Next profile', 'Close']);
    const title = canvas.getByRole('heading', { level: 2, name: 'Karim Baig' }).getBoundingClientRect();
    await expect(canvas.getByText('2 of 6').getBoundingClientRect().left).toBeGreaterThan(title.left);
    await expect(close.getBoundingClientRect().left).toBeGreaterThan(canvas.getByRole('button', { name: 'Next profile' }).getBoundingClientRect().left);
  },
};

export const WithActionsOnLight: RenderStory = { ...WithActions, globals: { surface: 'light', viewport: { value: 'desktop' } } };

/** On a phone the bottom sheet's header fits the title, the actions and Close in one row. */
export const WithActionsPhone: RenderStory = {
  render: () => <ActionsDemo variant="bottom" />,
  globals: { viewport: { value: 'phone' } },
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show profile' }));
    const close = canvas.getByRole('button', { name: 'Close' });
    await waitFor(() => expect(close).toHaveFocus());
    const next = canvas.getByRole('button', { name: 'Next profile' }).getBoundingClientRect();
    await expect(Math.round(next.top)).toBe(Math.round(close.getBoundingClientRect().top));
    await expect(close.getBoundingClientRect().right).toBeLessThanOrEqual(window.innerWidth);
  },
};

/** Close takes focus on open in every sheet. */
export const FocusesClose: RenderStory = {
  render: () => <SheetDemo title="Filters" handle />,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Show filters' }));
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Close' })).toHaveFocus());
  },
};
