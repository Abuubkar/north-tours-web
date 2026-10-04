import { Icon } from '@/components/ui/Icon/Icon';
import { TextOrLink } from '@/components/ui/TextOrLink/TextOrLink';
import type { ContactChannelCardProps } from './ContactChannelCard.types';
import styles from './ContactChannelCard.module.css';

const ICON_SIZE = 18;

/**
 * One way to reach the company: its name, the number or address (a link only once it's real, so
 * nobody reaches a made-up one), a line about it and, for WhatsApp, "Chat now".
 */
export function ContactChannelCard({ label, icon, value, href, size = 'default', line, children }: ContactChannelCardProps) {
  return (
    <div className={styles.card}>
      <h3 className={styles.label}>
        {icon && <Icon name={icon} size={ICON_SIZE} />}
        {label}
      </h3>
      <p className={size === 'feature' ? styles.featureValue : styles.value}>
        <TextOrLink href={href} className={styles.link}>
          {value}
        </TextOrLink>
      </p>
      <p className={styles.line}>{line}</p>
      {children && <div className={styles.action}>{children}</div>}
    </div>
  );
}
