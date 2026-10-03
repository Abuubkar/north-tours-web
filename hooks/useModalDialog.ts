import { useCallback, useEffect, useRef } from 'react';

/**
 * Keeps a <dialog> in step with `open`: showModal() when it turns true, close() when false.
 * The browser then handles inertness, Escape and focus return; `close` closes it from inside.
 */
export function useModalDialog(open: boolean) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const close = useCallback(() => ref.current?.close(), []);

  return { ref, close };
}
