import { Chip } from '@/components/ui/Chip/Chip';
import { helpCategoryAnchor } from '@/lib/routes';
import type { CategoryNavProps } from './CategoryNav.types';
import styles from './CategoryNav.module.css';

/**
 * Help's categories: from 820px a sticky list beside the questions, below it a row of chips
 * above them that scrolls sideways on its own. CSS shows one, so one nav is in the
 * accessibility tree. Each link goes to its category's heading and says how many answers it holds.
 * With no categories to show (a search with no match), there's no list.
 */
export function CategoryNav({ label, links }: CategoryNavProps) {
  if (links.length === 0) return null;
  return (
    <>
      <nav aria-label={label} className={styles.side}>
        <ul className={styles.list}>
          {links.map(({ id, title, count, name }) => (
            <li key={id}>
              <a href={`#${helpCategoryAnchor(id)}`} aria-label={name} className={styles.row}>
                {title}
                <span className={styles.count}>{count}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <nav aria-label={label} className={styles.chips}>
        <ul className={styles.chipList}>
          {links.map(({ id, title, count, name }) => (
            <li key={id} className={styles.chip}>
              <Chip variant="link" href={`#${helpCategoryAnchor(id)}`} count={count} label={name}>
                {title}
              </Chip>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
