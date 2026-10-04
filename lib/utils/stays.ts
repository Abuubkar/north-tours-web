/** A stay's nights and place: "Night 1 · Islamabad", "Nights 3–5 · Hunza". */
export function nightsLabel(nights: { from: number; to: number }, place: string): string {
  const which = nights.from === nights.to ? `Night ${nights.from}` : `Nights ${nights.from}–${nights.to}`;
  return `${which} · ${place}`;
}
