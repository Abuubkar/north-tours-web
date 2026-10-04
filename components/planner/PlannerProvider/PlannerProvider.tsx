'use client';

import { PlannerContext, usePlannerState } from '@/hooks/usePlanner';
import type { PlannerProviderProps } from './PlannerProvider.types';

/** Holds the Trip Planner's one state (answers, details, step, problems, messages) for everything inside it. */
export function PlannerProvider({ children, ...config }: PlannerProviderProps) {
  return <PlannerContext value={usePlannerState(config)}>{children}</PlannerContext>;
}
