import { Button } from '@/components/ui/Button/Button';
import styles from './SkipLink.module.css';

/** First on every page: jumps past the header to the page's <main id="main">. */
export function SkipLink() {
  return (
    <Button href="#main" size={44} className={styles.skipLink}>
      Skip to content
    </Button>
  );
}
