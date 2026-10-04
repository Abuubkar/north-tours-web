import type { TextOrLinkProps } from './TextOrLink.types';

/**
 * A contact value from settings: a link once it's real, plain text while it's a `[placeholder]`
 * (its href is undefined), so nobody reaches a made-up number or address (ADR-0010).
 */
export function TextOrLink({ href, className, children }: TextOrLinkProps) {
  return href ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    children
  );
}
