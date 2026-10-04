'use client';

import { PlannerContext, usePlannerState } from '@/hooks/usePlanner';
import type { PlannerProviderProps } from './PlannerProvider.types';

/** Holds the Trip Planner's one state (answers, step, problems) for everything inside it. */
export function PlannerProvider({ destinations, builtOn, messages, children }: PlannerProviderProps) {
  return <PlannerContext value={usePlannerState(destinations, builtOn, messages)}>{children}</PlannerContext>;
}
