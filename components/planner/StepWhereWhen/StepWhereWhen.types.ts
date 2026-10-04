import type { PlannerCopy } from '@/lib/content/pages';
import type { DestinationChoicesProps } from '../DestinationChoices/DestinationChoices.types';

export type StepWhereWhenProps = {
  destinations: DestinationChoicesProps['destinations'];
  copy: PlannerCopy['whereWhen'];
};
