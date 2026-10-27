import { useCallback, useEffect, useState } from 'react';

/** State langkah (0 … length-1) dengan autoplay. */
export function useStepper(length: number, autoplayMs = 1400) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = Math.max(0, length - 1);
  const at = Math.min(index, last);

  const next = useCallback(() => setIndex((i) => Math.min(i + 1, last)), [last]);
  const prev = useCallback(() => setIndex((i) => Math.max(i - 1, 0)), []);
  const reset = useCallback(() => {
    setPlaying(false);
    setIndex(0);
  }, []);
  const goTo = useCallback((i: number) => setIndex(Math.max(0, Math.min(i, last))), [last]);
  const toggle = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    if (!playing) return;
    if (at >= last) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(next, autoplayMs);
    return () => window.clearTimeout(id);
  }, [playing, at, last, next, autoplayMs]);

  return { index: at, last, length, playing, next, prev, reset, goTo, toggle, atStart: at === 0, atEnd: at === last };
}

export type Stepper = ReturnType<typeof useStepper>;
