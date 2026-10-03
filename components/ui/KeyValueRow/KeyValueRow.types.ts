import type { ReactNode } from 'react';

export type KeyValueRowProps = {
  /** What the value is, e.g. "Phone". */
  label: string;
  /** Text or a link, e.g. a tel: link. */
  children: ReactNode;
};
