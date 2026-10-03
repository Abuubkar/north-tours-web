const metres = new Intl.NumberFormat('en-PK');

/** "2,438 m". */
export function formatElevation(elevation: number): string {
  return `${metres.format(elevation)} m`;
}
