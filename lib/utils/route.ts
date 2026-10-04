/** A tour's route as one line: ["Lahore", "Hunza", "Skardu"] → "Lahore → Hunza → Skardu". */
export function routeLine(stops: readonly string[]): string {
  return stops.join(' → ');
}

/** The same route as a screen reader says it, without the arrows: "Lahore to Hunza to Skardu". */
export function spokenRoute(stops: readonly string[]): string {
  return stops.join(' to ');
}
