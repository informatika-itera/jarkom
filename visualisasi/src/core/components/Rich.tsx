import { Fragment } from 'react';
import { Tex } from './Tex';

/**
 * Teks biasa dengan matematika inline: bagian di antara tanda `$…$` dirender dengan KaTeX.
 * Contoh: "Jarak $u$ ke $v$ adalah $D(v)=3$."
 */
export function Rich({ children }: { children: string }) {
  const parts = children.split(/\$([^$]+)\$/g);
  return (
    <>
      {parts.map((p, i) => (i % 2 === 1 ? <Tex key={i}>{p}</Tex> : <Fragment key={i}>{p}</Fragment>))}
    </>
  );
}

/** Bungkus ekspresi LaTeX menjadi `$…$` untuk dipakai dalam string `Rich`. */
export const T = (tex: string) => `$${tex}$`;
