/** An element's opacity as seen, multiplying every ancestor's up to (and including) `stop`. */
export function opacityUpTo(element: Element, stop: Element): number {
  let opacity = 1;
  for (let el: Element | null = element; el && el !== stop.parentElement; el = el.parentElement) {
    opacity *= Number(getComputedStyle(el).opacity);
  }
  return opacity;
}
