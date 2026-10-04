/** A tour's route as one line: ["Lahore", "Hunza", "Skardu"] → "Lahore → Hunza → Skardu". */
export function routeLine(stops: readonly string[]): string {
  return stops.join(' → ');
}
