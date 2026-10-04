import { formatPkr } from '@/lib/utils/price';
import type { PriceBlockProps } from './PriceBlock.types';
import styles from './PriceBlock.module.css';

const amountClass = { card: styles.amount, fact: styles.factAmount, panel: styles.panelAmount };

/** "from / PKR 145,000 / per person". The amount takes the colour of its container. */
export function PriceBlock({ amount, size = 'card', from = true, note = 'per person' }: PriceBlockProps) {
  return (
    <p className={styles.priceBlock}>
      {from && <span className={styles.meta}>from</span>}
      <span className={amountClass[size]}>{formatPkr(amount)}</span>
      <span className={styles.meta}>{note}</span>
    </p>
  );
}
