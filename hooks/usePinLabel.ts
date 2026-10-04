import { useLayoutEffect, type RefObject } from 'react';
import { coveredLabels, placePinLabel, type Box } from '@/lib/utils/pinLabel';

const box = (element: Element): Box => {
  const { left, top, width, height } = element.getBoundingClientRect();
  return { x: left, y: top, width, height };
};

/**
 * Keeps the places map's names clear (lib/utils/pinLabel): the lit pin's name takes the first
 * spot that stays in the map and clears the other pins, as the design does, and any context
 * label it covers, or that a pin covers at this size, is hidden. It measures after each change
 * and on resize, before paint, then sets the name's `data-spot` and marks hidden context labels
 * `data-covered`. PlacesMap and PlacePin mark the parts it measures: `data-pin` (each pin),
 * `data-pin-circle`, `data-pin-label` and `data-context-label`.
 */
export function usePinLabel(mapRef: RefObject<HTMLElement | null>, lit: string | null) {
  useLayoutEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    function place(map: HTMLElement) {
      const context = [...map.querySelectorAll('[data-context-label]')];
      const circles = [...map.querySelectorAll('[data-pin-circle]')];
      const covered = new Set(coveredLabels(context.map(box), circles.map(box)));

      const name = map.querySelector<HTMLElement>('[data-pin-label]');
      const own = name?.closest('[data-pin]')?.querySelector('[data-pin-circle]');
      if (name && own) {
        const gap = parseFloat(getComputedStyle(name).getPropertyValue('--pin-label-gap')) || 0;
        const { spot, hidden } = placePinLabel(
          box(own),
          { width: name.offsetWidth, height: name.offsetHeight },
          box(map),
          { pins: circles.filter((circle) => circle !== own).map(box), labels: context.map(box) },
          gap,
        );
        name.dataset.spot = spot;
        for (const i of hidden) covered.add(i);
      }
      context.forEach((label, i) => label.toggleAttribute('data-covered', covered.has(i)));
    }

    place(map);
    const onResize = () => place(map);
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, [mapRef, lit]);
}
