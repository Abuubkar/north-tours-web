import { SPIED_SECTIONS } from '@/lib/utils/nav';
import styles from '../components/ui/stories.module.css';

/** A stand-in Homepage below the story: room for the hero and departures, then the sections the nav follows. */
export function SpySections() {
  return (
    <>
      <div className={styles.scrollRoom} />
      {SPIED_SECTIONS.map((id) => (
        <section key={id} id={id} className={styles.scrollRoom} />
      ))}
    </>
  );
}

/** Puts a section's top just under the header, as the nav's anchors do. */
export const scrollToSection = (id: string) =>
  document.getElementById(id)!.scrollIntoView({ block: 'start', behavior: 'instant' });

/** The marked links inside `container`, e.g. ["Reviews (location)"]. */
export const markedLinks = (container: HTMLElement) =>
  [...container.querySelectorAll('a[aria-current]')].map((link) => `${link.textContent} (${link.getAttribute('aria-current')})`);
