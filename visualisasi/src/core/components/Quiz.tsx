import { useState } from 'react';
import { Rich } from './Rich';

export interface QuizQuestion {
  q: string;
  options: string[];
  /** indeks jawaban benar */
  answer: number;
  why: string;
}

export function Quiz({ items }: { items: QuizQuestion[] }) {
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <div className="card">
        <div className="quiz-q">
          Skor kamu: {score} / {items.length}
        </div>
        <p className="muted">
          {score === items.length ? 'Sempurna! Kamu siap ke topik berikutnya.' : 'Coba ulang dan perhatikan penjelasan tiap jawaban.'}
        </p>
        <button
          className="btn primary"
          onClick={() => {
            setI(0);
            setPicked(null);
            setScore(0);
            setFinished(false);
          }}
        >
          ⟲ Ulangi kuis
        </button>
      </div>
    );
  }

  const item = items[i];
  const answered = picked !== null;
  return (
    <div className="card">
      <div className="muted" style={{ fontSize: 14, marginBottom: 6 }}>
        Soal {i + 1} dari {items.length}
      </div>
      <div className="quiz-q">
        <Rich>{item.q}</Rich>
      </div>
      <div className="quiz-opts">
        {item.options.map((o, k) => (
          <button
            key={k}
            className={`quiz-opt${answered ? (k === item.answer ? ' right' : k === picked ? ' wrong' : '') : ''}`}
            disabled={answered}
            onClick={() => {
              setPicked(k);
              if (k === item.answer) setScore((s) => s + 1);
            }}
          >
            <Rich>{o}</Rich>
          </button>
        ))}
      </div>
      {answered && (
        <div className="quiz-why">
          <div className={`callout ${picked === item.answer ? 'ok' : 'bad'}`}>
            <b>{picked === item.answer ? 'Benar! ' : 'Belum tepat. '}</b>
            <Rich>{item.why}</Rich>
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              className="btn primary"
              onClick={() => {
                if (i + 1 >= items.length) setFinished(true);
                else {
                  setI(i + 1);
                  setPicked(null);
                }
              }}
            >
              {i + 1 >= items.length ? 'Lihat skor' : 'Soal berikutnya ▶'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
