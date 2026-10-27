# Jarkom Visual

Kumpulan slide interaktif **reveal.js + React** untuk memvisualisasikan algoritma Jaringan Komputer, ditujukan bagi mahasiswa yang masih awam.

| Deck | Isi |
|------|-----|
| `dijkstra.html` | Dijkstra (Link-State): coba rute sendiri, kamus notasi, intuisi "air mengalir", pseudocode, simulasi langkah demi langkah + mode tebak, pohon jalur & forwarding table, sandbox, kuis |
| `distance-vector.html` | Distance Vector: rumus Bellman-Ford, kalkulator, simulator grid 3×3 (rincian perhitungan per node), kabar baik vs kabar buruk (count-to-infinity, poisoned reverse), kuis |
| `index.html` | Katalog semua deck |

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit test algoritma (angka Kurose & Ross)
npm run build      # typecheck + build ke dist/ (siap diunggah ke GitHub Pages; deploy otomatis lewat GitHub Actions)
```

Navigasi: panah / spasi · `S` catatan pembicara · `Esc` ringkasan semua slide · `F` layar penuh. Tombol bulan/matahari di kanan atas mengganti tema.

## Tema

Catppuccin **Latte** (terang) dan **Mocha** (gelap), font **Google Sans Flex** dan **Google Sans Code**. Semua warna berasal dari variabel `--ctp-*` di `src/core/theme.css`.

## Struktur

* `src/algorithms/` — logika murni + test (tanpa React). Menghasilkan *trace* langkah yang diputar oleh UI.
* `src/core/` — komponen lintas deck: `GraphView` (graf SVG), `StepControls`, `Quiz`, `SlideFrame`, `DeckShell`, tema.
* `src/decks/<nama>/` — slide tiap deck. `src/decks/registry.ts` mendaftarkan deck untuk katalog.

Menambah deck baru: lihat `docs/PLAN.md` bagian 6.
