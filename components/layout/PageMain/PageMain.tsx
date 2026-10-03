import type { PageMainProps } from './PageMain.types';

/** Every page's <main>: the skip link's target, focusable so the next Tab starts inside it. */
export function PageMain({ children }: PageMainProps) {
  return (
    <main id="main" tabIndex={-1}>
      {children}
    </main>
  );
}
