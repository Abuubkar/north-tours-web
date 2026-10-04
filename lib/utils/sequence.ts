/** A step's or stop's number in a real sequence, two digits: 3 → "03". */
export function sequenceNumber(n: number): string {
  return String(n).padStart(2, '0');
}
