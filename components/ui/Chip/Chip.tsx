import { Icon } from '../Icon/Icon';
import type { ChipProps, CountProps } from './Chip.types';
import styles from './Chip.module.css';

const ICON_SIZE = 16;

function Count({ value }: CountProps) {
  return value === undefined ? null : <span className={styles.count}>{value}</span>;
}

export function Chip(props: ChipProps) {
  switch (props.variant) {
    case 'link': {
      const { href, children, count } = props;
      return (
        <a href={href} className={styles.chip}>
          {children}
          <Count value={count} />
        </a>
      );
    }
    case 'toggle': {
      const { variant, pressed, children, count, type = 'button', ...rest } = props;
      return (
        <button {...rest} type={type} aria-pressed={pressed} className={styles.chip}>
          {children}
          <Count value={count} />
        </button>
      );
    }
    case 'trigger': {
      const { variant, expanded, active = false, children, count, type = 'button', ...rest } =
        props;
      const classes = active ? `${styles.chip} ${styles.active}` : styles.chip;
      return (
        <button {...rest} type={type} aria-expanded={expanded} className={classes}>
          {children}
          <Count value={count} />
          <Icon name="caret" size={ICON_SIZE} className={styles.caret} />
        </button>
      );
    }
    case 'removable': {
      const { variant, children, onRemove, type = 'button', ...rest } = props;
      return (
        <button
          {...rest}
          type={type}
          onClick={onRemove}
          aria-label={`Remove filter ${children}`}
          className={`${styles.chip} ${styles.active} ${styles.removable}`}
        >
          {children}
          <Icon name="close" size={ICON_SIZE} className={styles.remove} />
        </button>
      );
    }
  }
}
