import type { ReactNode } from 'react';
import type { PlannerConfig } from '@/hooks/usePlanner';

export type PlannerProviderProps = PlannerConfig & {
  children: ReactNode;
};
