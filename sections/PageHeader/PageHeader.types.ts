export type PageHeaderProps = {
  /** The page's <h1>. */
  headline: string;
  /** The line under it; the slim planner header has none. */
  lead?: string;
  /**
   * default: the <h1> at the statement size over the lead (Tours). planner: the same on the light
   * page with a shorter lead and less room below (Trip Planner, step 1). plannerSlim: the planner's
   * later steps, where the same <h1> reads as a slim line ("Planning your private trip").
   */
  variant?: 'default' | 'planner' | 'plannerSlim';
};
