import { Fragment, type ReactNode } from 'react';
/** Satu baris pseudocode; `meaning` memakai notasi `$…$` (Rich), `kinds` menandai fase algoritma. */
export interface PseudoLine {
  code: string;
  kinds?: readonly string[];
  meaning?: string;
}

const TOKEN = new RegExp(
  [
    String.raw`(?<cmt>/\*.*?\*/)`,
    String.raw`(?<head>\b(?:Initialization|Loop)\b:?)`,
    String.raw`(?<kw>\b(?:for|all|nodes|each|neighbors?|destinations?|if|adjacent|to|from|then|else|find|not|in|such|that|is|a|minimum|add|update|until|and|or|wait|send|receive|see|any|changed|forever|loop|distance|vector|link|cost|change|I)\b)`,
    String.raw`(?<set>N')`,
    String.raw`(?<fn>\b(?:D[a-z]?|c|min[a-z]?)(?=[({]))`,
    String.raw`(?<var>\b[uvwxy]\b)`,
    String.raw`(?<num>\b\d+\b|∞)`,
    String.raw`(?<op>[=+])`,
  ].join('|'),
  'g',
);

/** Pewarnaan sintaks ringan untuk pseudocode: kata kunci, fungsi, variabel, himpunan, angka. */
export function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const i = m.index!;
    if (i > last) out.push(code.slice(last, i));
    const kind = Object.entries(m.groups!).find(([, v]) => v !== undefined)![0];
    out.push(
      <span key={i} className={`tk-${kind}`}>
        {m[0]}
      </span>,
    );
    last = i + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

interface Props {
  lines: readonly PseudoLine[];
  /** Baris yang sedang aktif (disorot). */
  isActive: (line: PseudoLine, index: number) => boolean;
  /** Bila diberikan, baris yang punya `meaning` bisa diklik/ditekan. */
  onPick?: (index: number) => void;
  fontSize?: number;
}

export function PseudoCode({ lines, isActive, onPick, fontSize, label = 'Pseudocode' }: Props & { label?: string }) {
  return (
    <pre className="pseudo" style={fontSize ? { fontSize } : undefined} aria-label={label}>
      {lines.map((l, i) => {
        const pickable = !!(onPick && l.meaning);
        return (
          <span
            key={i}
            role={pickable ? 'button' : undefined}
            tabIndex={pickable ? 0 : undefined}
            className={`ln${isActive(l, i) ? ' active' : ''}${pickable ? ' clickable' : ''}`}
            onClick={pickable ? () => onPick!(i) : undefined}
            onKeyDown={
              pickable
                ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPick!(i);
                    }
                  }
                : undefined
            }
          >
            {l.code ? <Fragment>{highlight(l.code)}</Fragment> : ' '}
          </span>
        );
      })}
    </pre>
  );
}
