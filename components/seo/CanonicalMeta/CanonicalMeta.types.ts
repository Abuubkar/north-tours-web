export type CanonicalMetaProps = {
  /** The page's path from the route map, e.g. "/tours"; filtered views share it. */
  path: string;
  /** From settings: a `[placeholder]` until the domain is known. */
  siteUrl: string;
};
