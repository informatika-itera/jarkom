import type { Stepper } from '../hooks/useStepper';

interface Props {
  s: Stepper;
  /** Label bagian "Langkah 3 / 12". */
  unit?: string;
  /** Mulai dari 0 atau 1 pada tampilan. */
  offset?: number;
  /** Tahan tombol Maju (mis. menunggu tebakan). */
  blockNext?: boolean;
  /** Sembunyikan putar otomatis. */
  noPlay?: boolean;
}

export function StepControls({ s, unit = 'Langkah', offset = 0, blockNext, noPlay }: Props) {
  return (
    <div className="toolbar">
      <button className="btn" onClick={s.reset} disabled={s.atStart && !s.playing} title="Ulang dari awal" aria-label="Ulang dari awal">
        ⟲
      </button>
      <button className="btn" onClick={s.prev} disabled={s.atStart} title="Langkah sebelumnya">
        ◀ Mundur
      </button>
      <button className="btn primary" onClick={s.next} disabled={s.atEnd || blockNext} title="Langkah berikutnya">
        Maju ▶
      </button>
      {!noPlay && (
        <button className="btn" onClick={s.toggle} disabled={s.atEnd && !s.playing}>
          {s.playing ? '⏸ Jeda' : '⏵ Putar'}
        </button>
      )}
      <span className="step-count">
        {unit} {s.index + offset} / {s.last + offset}
      </span>
    </div>
  );
}
