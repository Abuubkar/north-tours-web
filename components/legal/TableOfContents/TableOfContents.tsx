'use client';

import type { MouseEvent } from 'react';
import { Accordion } from '@/components/ui/Accordion/Accordion';
import type { ContentsEntry, TableOfContentsProps } from './TableOfContents.types';
import styles from './TableOfContents.module.css';

function Links({ sections, linkClass }: { sections: ContentsEntry[]; linkClass: string }) {
  return (
    <ol className={styles.list}>
      {sections.map(({ id, number, heading }) => (
        <li key={id}>
          <a href={`#${id}`} className={linkClass}>
            <span className={styles.number}>{number}</span> {heading}
          </a>
        </li>
      ))}
    </ol>
  );
}

/** On phones, picking a section closes the list first, so the page lands on the text. */
function closeOnPick(event: MouseEvent<HTMLElement>) {
  if ((event.target as Element).closest('a')) event.currentTarget.querySelector('details')?.removeAttribute('open');
}

/**
 * A legal document's contents: from 820px a sticky list beside the text; below it a one-item
 * disclosure, "Contents (9)", above the text. CSS shows one form, so only one nav is in the
 * accessibility tree. The links are plain anchors: without JavaScript they still jump, and the
 * disclosure just stays open.
 */
export function TableOfContents({ label, toggleLabel, sections }: TableOfContentsProps) {
  return (
    <>
      <nav aria-label={label} className={styles.side}>
        <p className={styles.label}>{label}</p>
        <Links sections={sections} linkClass={styles.sideLink} />
      </nav>
      {/* The click is a link's activation (mouse, touch or Enter), handled where it bubbles to. */}
      <nav aria-label={label} className={styles.phone} onClick={closeOnPick}>
        <Accordion
          size="compact"
          marker="caret"
          items={[{ id: 'contents', summary: toggleLabel, content: <Links sections={sections} linkClass={styles.phoneLink} /> }]}
        />
      </nav>
    </>
  );
}
