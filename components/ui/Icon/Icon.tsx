import { icons } from './icons';
import type { IconProps } from './Icon.types';

export function Icon({ name, size, label, className }: IconProps) {
  const { kind, body } = icons[name];
  const paint =
    kind === 'stroke'
      ? {
          fill: 'none',
          stroke: 'currentColor',
          strokeWidth: 2,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        }
      : { fill: 'currentColor' };

  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      focusable="false"
      {...paint}
    >
      {body}
    </svg>
  );
}
