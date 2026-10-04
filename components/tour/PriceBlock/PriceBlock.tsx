import { formatPkr } from '@/lib/utils/price';
import type { PriceBlockProps } from './PriceBlock.types';
import styles from './PriceBlock.module.css';

/** "from / PKR 145,000 / per person". The amount takes the colour of its container. */
export function PriceBlock({ amount }: PriceBlockProps) {
  return (
    <p className={styles.priceBlock}>
      <span className={styles.meta}>from</span>
      <span className={styles.amount}>{formatPkr(amount)}</span>
      <span className={styles.meta}>per person</span>
    </p>
  );
}
