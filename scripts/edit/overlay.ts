// The edit-mode overlay (ADR-0034), loaded into the dev site by `pnpm content:edit` only. It finds the
// content behind each piece of text by matching it against content's strings, lets the owner edit
// it in place, and sends the edit to the edit server, which saves it into the content file.
import { contentMatcher, normalizeText, type ContentEntry, type ContentMatch } from '../../lib/utils/contentMatch.ts';

const SERVER = new URL(import.meta.url).origin;
const ON_KEY = 'edit-mode-on';
const SCROLL_KEY = 'edit-mode-scroll';
/** Longer text than this is a whole section, not one piece of content. */
const MAX_TEXT = 1200;

const read = (key: string) => {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
};
const write = (key: string, value: string | null) => {
  try {
    if (value === null) sessionStorage.removeItem(key);
    else sessionStorage.setItem(key, value);
  } catch {
    // Without storage, edit mode just starts off after a reload.
  }
};

let on = read(ON_KEY) === '1';
let values = new Map<string, string>();
let match: (text: string) => ContentMatch | null = () => null;
const targets = new Map<Element, ContentMatch>();
let editing: { element: HTMLElement; id: string; before: string } | null = null;
let saving = false;

// The switch, the status line and the panel, in a shadow root so the site's styles don't reach them.
const host = document.createElement('div');
host.setAttribute('data-edit-ui', '');
const shadow = host.attachShadow({ mode: 'open' });
shadow.innerHTML = `
  <style>
    :host { all: initial; }
    .bar { position: fixed; left: 16px; bottom: 16px; z-index: 2147483647; display: flex; flex-direction: column; gap: 8px; align-items: flex-start;
      font: 14px/1.4 system-ui, sans-serif; color: #f1eee8; max-width: min(520px, calc(100vw - 32px)); }
    button { font: inherit; cursor: pointer; border-radius: 6px; border: 1px solid #5c6871; background: #0c1216; color: inherit; min-height: 36px; padding: 0 14px; }
    .switch[aria-pressed="true"] { background: #d9b44a; color: #0c1216; border-color: #d9b44a; font-weight: 600; }
    .status { background: #0c1216; border: 1px solid #5c6871; border-radius: 6px; padding: 8px 12px; }
    .status:empty { display: none; }
    .status.error { border-color: #e5484d; color: #ffb4b4; white-space: pre-wrap; }
    code { font: 12px ui-monospace, Menlo, monospace; color: #d9b44a; }
    .panel { background: #0c1216; border: 1px solid #5c6871; border-radius: 8px; padding: 12px; display: flex; flex-direction: column; gap: 10px; width: 100%; box-sizing: border-box; }
    .panel[hidden] { display: none; }
    label { display: flex; gap: 8px; align-items: baseline; }
    textarea { font: 14px/1.4 system-ui, sans-serif; width: 100%; box-sizing: border-box; min-height: 80px; border-radius: 6px; border: 1px solid #5c6871; background: #121a1f; color: #f1eee8; padding: 8px; }
    .row { display: flex; gap: 8px; justify-content: flex-end; }
    .hint { color: #b7bfc5; font-size: 12px; }
    .box { position: fixed; z-index: 2147483646; pointer-events: none; border: 2px dashed #d9b44a; border-radius: 2px; display: none; }
    .box.active { border-style: solid; background: rgba(217, 180, 74, 0.14); }
  </style>
  <div class="box"></div>
  <div class="bar">
    <div class="panel" hidden>
      <div class="choices"></div>
      <textarea aria-label="Text"></textarea>
      <div class="hint">Tokens in {braces} are filled in by the site; keep them. Ctrl or ⌘ + Enter saves.</div>
      <div class="row"><button class="cancel" type="button">Cancel</button><button class="save" type="button">Save</button></div>
    </div>
    <div class="status" role="status"></div>
    <button class="switch" type="button" aria-pressed="false" title="Alt + E">Edit text</button>
  </div>`;
const $ = <T extends Element>(selector: string) => shadow.querySelector(selector) as T;
const switchButton = $<HTMLButtonElement>('.switch');
const status = $<HTMLDivElement>('.status');
const panel = $<HTMLDivElement>('.panel');
const choices = $<HTMLDivElement>('.choices');
const textarea = $<HTMLTextAreaElement>('textarea');
const box = $<HTMLDivElement>('.box');

/*
 * The page's own elements are never marked (an attribute added before React hydrates would
 * mismatch): targets are kept here, and the outline is a box drawn over the element.
 */
let outlined: Element | null = null;

function outline(element: Element | null, active = false) {
  outlined = element;
  box.classList.toggle('active', active);
  if (!element) {
    box.style.display = 'none';
    return;
  }
  const { left, top, width, height } = element.getBoundingClientRect();
  Object.assign(box.style, { display: 'block', left: `${left - 4}px`, top: `${top - 4}px`, width: `${width + 8}px`, height: `${height + 8}px` });
}

/** The content element an event happened in: the nearest one up from where it happened. */
function targetOf(node: EventTarget | null): HTMLElement | null {
  for (let element = node instanceof Element ? node : null; element && element !== document.body; element = element.parentElement) {
    if (targets.has(element)) return element instanceof HTMLElement ? element : null;
  }
  return null;
}

function say(message: string, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

/** Marks every element whose text is one piece of content, the deepest one when nested elements show the same text. */
function scan() {
  targets.clear();
  if (!on) return;
  for (const element of document.body.querySelectorAll('*')) {
    if (element === host || element instanceof HTMLScriptElement || element instanceof HTMLStyleElement || element.closest('svg')) continue;
    const named = element.getAttribute('data-content');
    if (named) {
      targets.set(element, { kind: 'exact', ids: [named] });
      continue;
    }
    const text = element.textContent ?? '';
    if (text.length === 0 || text.length > MAX_TEXT) continue;
    const found = match(text);
    if (found) targets.set(element, found);
  }
  for (const [element] of targets) {
    const text = normalizeText(element.textContent ?? '');
    for (const inner of element.querySelectorAll('*')) {
      if (targets.has(inner) && normalizeText(inner.textContent ?? '') === text) {
        targets.delete(element);
        break;
      }
    }
  }
  if (on && !editing) switchButton.textContent = `Editing: ${targets.size} texts on this page`;
}

function setOn(next: boolean) {
  on = next;
  write(ON_KEY, on ? '1' : null);
  switchButton.setAttribute('aria-pressed', String(on));
  switchButton.textContent = 'Edit text';
  if (!on) {
    cancel();
    outline(null);
    say('');
  }
  scan();
}

/** Reloads the page where it is, so the saved content shows. */
function reload() {
  write(SCROLL_KEY, String(window.scrollY));
  location.reload();
}

async function save(id: string, expected: string, value: string) {
  if (saving) return false;
  saving = true;
  say(`Saving ${id}…`);
  try {
    const response = await fetch(`${SERVER}/save`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, expected, value }),
    });
    const text = await response.text();
    let body: { message?: string; problems?: string[]; changed?: boolean };
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
    if (!response.ok) {
      say([body.message, ...(body.problems ?? [])].filter(Boolean).join('\n'), true);
      return false;
    }
    if (body.changed) reload();
    else finish();
    return true;
  } catch {
    say('The edit server isn’t answering. Is `pnpm content:edit` still running?', true);
    return false;
  } finally {
    saving = false;
  }
}

function finish() {
  // Cleared first, so nothing that runs as the element loses contenteditable sees an edit in progress.
  const done = editing;
  editing = null;
  panel.hidden = true;
  outline(null);
  done?.element.removeAttribute('contenteditable');
}

/** Ends an edit without saving; if the text on the page was changed, reloads to show the saved text again. */
function cancel() {
  const changed = editing && normalizeText(editing.element.textContent ?? '') !== normalizeText(editing.before);
  finish();
  if (changed) reload();
}

/** Plain text with one source: edited where it is on the page. */
function editInPlace(element: HTMLElement, id: string) {
  editing = { element, id, before: element.textContent ?? '' };
  outline(element, true);
  element.setAttribute('contenteditable', 'plaintext-only');
  element.focus();
  const range = document.createRange();
  range.selectNodeContents(element);
  getSelection()?.removeAllRanges();
  getSelection()?.addRange(range);
  say(`Editing ${id} · Enter saves · Esc cancels`);
}

async function commitInPlace() {
  if (!editing) return;
  const { id, element, before } = editing;
  const value = normalizeText(element.textContent ?? '');
  if (value === normalizeText(before)) return finish();
  const saved = await save(id, values.get(id) ?? before, value);
  if (!saved) element.focus();
}

/** Text from a template, or the same text in several places: edited in the panel, which shows the source. */
function editInPanel(element: HTMLElement, found: ContentMatch) {
  editing = { element, id: found.ids[0], before: element.textContent ?? '' };
  outline(element, true);
  choices.replaceChildren();
  const pick = (id: string) => {
    if (editing) editing.id = id;
    textarea.value = values.get(id) ?? '';
  };
  const intro = document.createElement('div');
  intro.textContent =
    found.ids.length > 1
      ? 'This text comes from more than one place. Pick the one to change:'
      : found.kind === 'template'
        ? 'This text is built from a template:'
        : 'This text comes from:';
  choices.append(intro);
  for (const [index, id] of found.ids.entries()) {
    const label = document.createElement('label');
    const radio = document.createElement('input');
    radio.type = 'radio';
    radio.name = 'edit-source';
    radio.checked = index === 0;
    radio.addEventListener('change', () => pick(id));
    const name = document.createElement('code');
    name.textContent = id;
    label.append(radio, name);
    if (found.ids.length === 1) radio.hidden = true;
    choices.append(label);
  }
  pick(found.ids[0]);
  panel.hidden = false;
  say(`Editing ${found.ids[0]}`);
  textarea.focus();
}

async function commitPanel() {
  if (!editing) return;
  const { id } = editing;
  const before = values.get(id) ?? '';
  await save(id, before, textarea.value.trim());
}

/** The text being edited in place has changes not yet saved. */
const unsaved = () => !!editing && panel.hidden && normalizeText(editing.element.textContent ?? '') !== normalizeText(editing.before);

function startEdit(element: HTMLElement) {
  const found = targets.get(element);
  if (!found) return;
  if (unsaved()) {
    say(`${editing!.id} has changes: Enter saves them, Esc drops them.`, true);
    editing!.element.focus();
    return;
  }
  if (editing) cancel();
  if (found.kind === 'exact' && found.ids.length === 1) editInPlace(element, found.ids[0]);
  else editInPanel(element, found);
}

// While edit mode is on, a click on content edits it instead of following a link or pressing a button.
document.addEventListener(
  'click',
  (event) => {
    if (!on || event.composedPath().includes(host)) return;
    const element = targetOf(event.target);
    if (!element) return;
    event.preventDefault();
    event.stopPropagation();
    if (editing?.element !== element) startEdit(element);
  },
  true,
);

document.addEventListener(
  'mouseover',
  (event) => {
    if (!on || editing || event.composedPath().includes(host)) return;
    const element = targetOf(event.target);
    const found = element && targets.get(element);
    outline(element);
    if (found) say(found.ids.length > 1 ? `${found.ids.length} sources · click to choose` : `${found.ids[0]}${found.kind === 'template' ? ' (template)' : ''}`);
  },
  true,
);

// The outline follows its element as the page scrolls or resizes.
const follow = () => outlined && outline(outlined, !!editing);
window.addEventListener('scroll', follow, { passive: true, capture: true });
window.addEventListener('resize', follow);

document.addEventListener(
  'keydown',
  (event) => {
    if (event.altKey && event.code === 'KeyE') {
      event.preventDefault();
      setOn(!on);
      return;
    }
    if (!editing || !panel.hidden) return;
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      void commitInPlace();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      cancel();
    }
  },
  true,
);

textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    void commitPanel();
  } else if (event.key === 'Escape') {
    event.preventDefault();
    cancel();
  }
});
$<HTMLButtonElement>('.save').addEventListener('click', () => void commitPanel());
$<HTMLButtonElement>('.cancel').addEventListener('click', () => cancel());
switchButton.addEventListener('click', () => setOn(!on));

/**
 * A modal dialog (the mobile menu, a sheet) makes the rest of the page inert and sits in the top
 * layer, so the switch and the panel move into the open dialog while it's open.
 */
function place() {
  const modal = document.querySelector('dialog:modal');
  const parent = modal ?? document.body;
  if (host.parentElement !== parent) parent.append(host);
}

// Content shown later (a sheet, the planner's next step) is picked up shortly after it appears.
let rescan = 0;
new MutationObserver(() => {
  place();
  if (!on || editing) return;
  clearTimeout(rescan);
  rescan = window.setTimeout(scan, 250);
}).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['open'] });

async function start() {
  document.body.append(host);
  try {
    const entries = (await (await fetch(`${SERVER}/content`)).json()) as ContentEntry[];
    values = new Map(entries.map(({ id, value }) => [id, value]));
    match = contentMatcher(entries);
  } catch {
    say('The edit server isn’t answering. Is `pnpm content:edit` still running?', true);
  }
  setOn(on);
  const scroll = read(SCROLL_KEY);
  if (scroll !== null) {
    write(SCROLL_KEY, null);
    // Instant: the site's smooth scrolling would glide down from the top.
    window.scrollTo({ top: Number(scroll), behavior: 'instant' });
  }
}

if (document.readyState === 'complete') void start();
else window.addEventListener('load', () => void start(), { once: true });
