const pkr = new Intl.NumberFormat('en-PK');

/** "PKR 145,000": whole rupees, grouped in thousands. */
export function formatPkr(amount: number): string {
  return `PKR ${pkr.format(amount)}`;
}
