import { useMemo } from 'react';
import katex from 'katex';

interface Props {
  /** Ekspresi LaTeX. */
  children: string;
  /** Tampil sebagai blok (display mode). */
  block?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/** Render rumus/simbol matematika dengan font KaTeX. Input berasal dari kode kita, bukan dari pengguna. */
export function Tex({ children, block, className, style }: Props) {
  const html = useMemo(
    () => katex.renderToString(children, { displayMode: !!block, throwOnError: false, output: 'html', strict: false }),
    [children, block],
  );
  return block ? (
    <div className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
  ) : (
    <span className={className} style={style} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
