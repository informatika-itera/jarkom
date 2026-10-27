import type { ReactNode } from 'react';
import { Slide } from '@revealjs/react';

interface Props {
  title: string;
  notes?: string;
  children: ReactNode;
}

/** Slide standar: judul, isi, dan catatan pembicara (tekan S). */
export function SlideFrame({ title, notes, children }: Props) {
  return (
    <Slide notes={notes}>
      <div className="frame">
        <header>
          <div className="frame-head">
            <h2>{title}</h2>
          </div>
        </header>
        <div className="frame-body">{children}</div>
      </div>
    </Slide>
  );
}

export function TitleSlide({ kicker, title, subtitle, children }: { kicker?: string; title: string; subtitle: string; children?: ReactNode }) {
  return (
    <Slide>
      <div className="title-slide">
        <div className="title-box">
          {kicker && <span className="pill">{kicker}</span>}
          <h1>{title}</h1>
          <div className="subtitle">{subtitle}</div>
          {children && <div style={{ marginTop: 24, fontSize: 20 }}>{children}</div>}
        </div>
      </div>
    </Slide>
  );
}
