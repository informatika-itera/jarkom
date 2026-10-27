import { useState, type ReactNode } from 'react';
import { Deck } from '@revealjs/react';
import RevealNotes from 'reveal.js/plugin/notes';
import './styles.css';

type Theme = 'light' | 'dark';

/** Tema awal sudah dipasang oleh skrip di <head> (tanpa kilatan); di sini hanya dibaca. */
function currentTheme(): Theme {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(currentTheme);
  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try {
      localStorage.setItem('jarkom-theme', next); // hanya disimpan bila pengguna memilih sendiri
    } catch {
      /* penyimpanan diblokir — abaikan */
    }
    setTheme(next);
  };
  return (
    <button
      className="theme-toggle"
      aria-label={theme === 'dark' ? 'Ganti ke tema terang (Latte)' : 'Ganti ke tema gelap (Mocha)'}
      title={theme === 'dark' ? 'Tema: Mocha → Latte' : 'Tema: Latte → Mocha'}
      onClick={toggle}
    >
      {theme === 'dark' ? '☀' : '☾'}
    </button>
  );
}

export function DeckShell({ children, home = true }: { children: ReactNode; home?: boolean }) {
  return (
    <>
      <Deck
        config={{
          width: 1280,
          height: 720,
          margin: 0.04,
          hash: true,
          slideNumber: 'c/t',
          transition: 'slide',
          controls: true,
          progress: true,
          center: false,
          // Geser (swipe) tetap dipakai untuk pindah slide; kontrol yang butuh drag horizontal
          // (mis. slider) menandai dirinya dengan data-prevent-swipe.
          touch: true,
          // Jangan rebut tombol keyboard dari kontrol yang memakainya: select/input selalu;
          // tombol dan elemen role=button hanya untuk Enter/Spasi (panah tetap menggerakkan slide/langkah).
          keyboardCondition: (e: KeyboardEvent) => {
            const el = e.target as Element | null;
            if (el?.closest?.('select,input,textarea')) return false;
            if ((e.key === ' ' || e.key === 'Enter') && el?.closest?.('button,[role="button"],[tabindex="0"]')) return false;
            return true;
          },
        }}
        plugins={[RevealNotes]}
      >
        {children}
      </Deck>
      <ThemeToggle />
      {home && (
        <a className="home-link" href="./index.html">
          ⌂ Katalog
        </a>
      )}
    </>
  );
}
