import { realUser } from './realUser';

/**
 * Moves the real pointer onto a small target at the bottom-right corner, away from every link. A
 * hovered link is gold (`a:hover`), and the pointer stays where the previous story left it, so park
 * it before reading link colours.
 */
export async function parkPointer(canvasElement: HTMLElement) {
  const user = await realUser();
  if (!user) return;
  const spot = document.createElement('div');
  spot.style.cssText = 'position:fixed;right:0;bottom:0;width:8px;height:8px';
  canvasElement.append(spot);
  await user.hover(spot);
  spot.remove();
}
