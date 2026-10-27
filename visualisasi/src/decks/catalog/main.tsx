import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../../core/theme.css';
import { decks } from '../registry';

function initTheme() {
  let t: string | null = null;
  try {
    t = localStorage.getItem('jarkom-theme');
  } catch {
    /* abaikan */
  }
  const dark = t ? t === 'dark' : window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}
initTheme();

function Catalog() {
  return (
    <main style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 20px 80px', fontSize: 17, lineHeight: 1.5 }}>
      <span className="pill">Jaringan Komputer</span>
      <h1 style={{ fontSize: 44, margin: '0 0 8px' }}>Visualisasi Algoritma Jaringan</h1>
      <p className="muted" style={{ fontSize: 19, maxWidth: 680 }}>
        Slide interaktif untuk memahami algoritma jaringan langkah demi langkah. Pilih topik di bawah, lalu gunakan tombol panah atau klik komponen interaktif.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, marginTop: 28 }}>
        {decks.map((d) => {
          const body = (
            <>
              <span className="pill">{d.topic}</span>
              <h2 style={{ fontSize: 22, margin: '12px 0 6px' }}>{d.title}</h2>
              <p className="muted" style={{ margin: '0 0 10px' }}>
                {d.description}
              </p>
              {d.status === 'ready' ? (
                <ul className="muted" style={{ margin: 0, paddingLeft: 18, fontSize: 15 }}>
                  {d.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ) : (
                <span className="muted" style={{ fontSize: 14 }}>
                  Segera hadir
                </span>
              )}
            </>
          );
          return d.status === 'ready' ? (
            <a key={d.id} href={d.href} className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              {body}
            </a>
          ) : (
            <div key={d.id} className="card soft" style={{ opacity: 0.7 }}>
              {body}
            </div>
          );
        })}
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Catalog />
  </StrictMode>,
);
