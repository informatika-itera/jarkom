import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { useReveal } from '@revealjs/react';
import type { Stepper } from './useStepper';

/**
 * Stepper yang terhubung ke tombol "next/prev" reveal.js.
 *
 * Setiap langkah (selain langkah 0) dipetakan ke satu fragment reveal yang tak terlihat. Karena
 * reveal menghabiskan fragment sebelum pindah slide, panah di layar, keyboard (→ ← spasi PageDown),
 * dan geser sentuh otomatis menjalankan simulasi dulu; slide baru berganti setelah langkah terakhir.
 * Tombol di dalam slide memakai jalur yang sama, jadi semuanya selalu sinkron.
 *
 * Pasang `fragments` sekali di dalam slide.
 */
export function useFragmentStepper(length: number, autoplayMs = 1400): Stepper & { fragments: ReactNode } {
  const deck = useReveal();
  const anchor = useRef<HTMLSpanElement>(null);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const last = Math.max(0, length - 1);

  const section = useCallback(() => anchor.current?.closest('section') as HTMLElement | null, []);
  const read = useCallback(() => {
    const sec = section();
    if (sec) setIndex(sec.querySelectorAll('.fragment.visible[data-step]').length);
  }, [section]);

  // Sinkronkan state dari reveal (navigasi bisa datang dari panah, keyboard, atau swipe).
  useEffect(() => {
    if (!deck) return;
    const events = ['fragmentshown', 'fragmenthidden', 'slidechanged', 'ready'] as const;
    for (const e of events) deck.on(e, read);
    read();
    return () => {
      for (const e of events) deck.off(e, read);
    };
  }, [deck, read]);

  // Jumlah langkah berubah (mis. bobot graf diubah): daftarkan ulang fragment dan mulai dari awal.
  useEffect(() => {
    const sec = section();
    if (!deck || !sec) return;
    deck.syncFragments(sec);
    deck.navigateFragment(-1);
    setIndex(0);
    setPlaying(false);
  }, [deck, length, section]);

  const isCurrent = () => !!section()?.classList.contains('present');
  const next = useCallback(() => {
    if (isCurrent()) deck?.nextFragment();
  }, [deck]); // eslint-disable-line react-hooks/exhaustive-deps
  const prev = useCallback(() => {
    if (isCurrent()) deck?.prevFragment();
  }, [deck]); // eslint-disable-line react-hooks/exhaustive-deps
  const goTo = useCallback(
    (i: number) => {
      if (isCurrent()) deck?.navigateFragment(Math.max(0, Math.min(i, last)) - 1);
    },
    [deck, last], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const reset = useCallback(() => {
    setPlaying(false);
    if (isCurrent()) deck?.navigateFragment(-1);
  }, [deck]); // eslint-disable-line react-hooks/exhaustive-deps
  const toggle = useCallback(() => setPlaying((p) => !p), []);

  useEffect(() => {
    if (!playing) return;
    if (index >= last || !isCurrent()) {
      setPlaying(false);
      return;
    }
    const id = window.setTimeout(next, autoplayMs);
    return () => window.clearTimeout(id);
  }, [playing, index, last, next, autoplayMs]); // eslint-disable-line react-hooks/exhaustive-deps

  const fragments = (
    <span ref={anchor} aria-hidden="true" style={{ position: "absolute" }}>
      {Array.from({ length: last }, (_, k) => (
        <span key={k} className="fragment" data-step="" data-fragment-index={k} />
      ))}
    </span>
  );

  return { index: Math.min(index, last), last, length, playing, next, prev, reset, goTo, toggle, atStart: index === 0, atEnd: index >= last, fragments };
}
