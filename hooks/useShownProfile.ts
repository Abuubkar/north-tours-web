import { useEffect, useRef, useState } from 'react';

/**
 * The guide the profile sheet shows: the open one, or, while the sheet slides away after closing,
 * the last one. `content` goes on the profile inside the sheet's scrolling body, so a new guide
 * starts at the top.
 */
export function useShownProfile(shown: number | null) {
  const content = useRef<HTMLDivElement>(null);
  const [kept, setKept] = useState(0);
  if (shown !== null && shown !== kept) setKept(shown);
  const index = shown ?? kept;

  // The sheet's body is the profile's parent.
  useEffect(() => {
    content.current?.parentElement?.scrollTo({ top: 0 });
  }, [index]);

  return { index, content };
}
