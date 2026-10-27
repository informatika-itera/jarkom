# Rencana Proyek — Jarkom Visual

Kumpulan slide **reveal.js + React** berisi visualisasi interaktif algoritma
Jaringan Komputer. Target audiens: mahasiswa yang masih awam. Deck pertama
melanjutkan Pertemuan 9 (Routing): **Dijkstra (Link-State)** dan
**Distance Vector (Bellman-Ford)**.

## 1. Prinsip desain

1. **Algoritma terpisah dari tampilan.** Setiap algoritma adalah fungsi TypeScript
   murni yang menghasilkan *trace* (daftar snapshot langkah). Komponen React hanya
   "memutar" trace itu. Konsekuensinya: algoritma bisa di-unit-test terhadap angka
   di buku (Kurose & Ross), dan satu trace bisa dipakai di banyak slide (stepper,
   tabel, pohon jalur, forwarding table).
2. **Satu konsep per slide, lalu satu slide "coba sendiri".** Urutan setiap topik:
   masalah → intuisi → notasi/rumus → simulasi langkah demi langkah → hasil →
   sandbox → cek pemahaman.
3. **Pembelajaran aktif.** Ada mode *tebak dulu* (mahasiswa memprediksi langkah
   berikutnya sebelum dibuka), kuis singkat, dan graf yang bisa diubah bobotnya.
4. **Bahasa sederhana.** Setiap langkah simulasi disertai penjelasan kalimat biasa
   ("kita cek tetangga v: 1 + 2 = 3, lebih mahal dari 2 → tidak berubah").
5. **Komponen bersama dipakai ulang lintas deck.** Graf SVG, kontrol langkah,
   kuis, dan tata letak slide ada di `src/core`, sehingga deck berikutnya
   (mis. Sliding Window, CSMA/CD) cukup menulis algoritma + slide-nya saja.

## 1b. Keputusan visual

* Tema **Catppuccin Latte** (terang) dan **Mocha** (gelap), diatur lewat variabel `--ctp-*`; peran warna algoritma (sumber, final, sedang dicek, biaya) dipetakan ke variabel `--c-*`.
* Font **Google Sans Flex** (teks) dan **Google Sans Code** (monospace).
* Tema bawaan reveal (`white.css`) tidak dipakai karena menanam font base64 (±570 kB); variabel dasar dibuat ulang di `theme.css`.

## 2. Arsitektur

```
index.html                 katalog semua deck
dijkstra.html              deck Link-State (Dijkstra)
distance-vector.html       deck Distance Vector (Bellman-Ford)
src/
  core/                    komponen & util lintas deck
    graph.ts               tipe Graph, tetangga, biaya link
    presets.ts             topologi contoh (K&R, latihan, grid 3×3, x-y-z)
    components/            GraphView, StepControls, Quiz, SlideFrame, ...
    hooks/useStepper.ts    state langkah + autoplay
    theme.css              tema (mengikuti pkom-theme, terang/gelap)
  algorithms/              logika murni + test (vitest)
    dijkstra.ts            trace Dijkstra, tabel K&R, pohon & forwarding table
    distanceVector.ts      simulasi DV sinkron, poisoned reverse, rumus BF
  decks/
    registry.ts            daftar deck (dipakai halaman katalog)
    catalog/               halaman katalog
    dijkstra/              slide-slide Dijkstra
    distance-vector/       slide-slide Distance Vector
```

* Multi-page Vite: satu file HTML per deck, sehingga URL tetap bergaya
  `dijkstra.html#/5` seperti situs mata kuliah dan bisa langsung di-host di
  GitHub Pages (`base: './'`).
* `@revealjs/react` (wrapper resmi reveal.js) untuk `Deck`/`Slide`.
* Slide berukuran tetap 1280×720; reveal menskalakan dengan `transform`, jadi
  interaksi pointer di SVG dihitung dari `getBoundingClientRect`.

## 3. Isi deck

### Deck A — Dijkstra / Link-State
| # | Slide | Interaksi |
|---|-------|-----------|
| 1 | Judul | — |
| 2 | Masalah: jalur termurah | **Tebak rute**: klik node satu per satu untuk membuat rute u→z, lihat totalnya, bandingkan dengan optimum |
| 3 | Link-state & notasi | Kamus notasi c(x,y), D(v), p(v), N′ — sorot di graf saat dipilih |
| 4 | Intuisi "air mengalir" | Slider/putar: air dari u merambat sepanjang kabel; node "basah" = jaraknya final. Menjelaskan *mengapa* selalu memilih D minimum |
| 5 | Pseudocode (ref. #/13) | Klik baris → arti dalam bahasa sehari-hari |
| 6 | Simulasi langkah demi langkah (ref. #/14) | Graf + pseudocode tersorot + tabel yang terisi bertahap; mode detail/per-baris; **mode tebak** |
| 7 | Hasil: pohon jalur & forwarding table | Klik tujuan → jalur & link keluar tersorot |
| 8 | Coba sendiri | Ubah bobot link, ganti sumber, pilih preset (termasuk soal latihan A–E) |
| 9 | Cek pemahaman | Kuis 3 soal dengan umpan balik |

### Deck B — Distance Vector / Bellman-Ford
| # | Slide | Interaksi |
|---|-------|-----------|
| 1 | Judul | — |
| 2 | Analogi "tanya tetangga" | — |
| 3 | Persamaan Bellman-Ford (ref. #23) | Sorot tiap suku rumus |
| 4 | Kalkulator BF (ref. #24) | Ubah c(u,v) dan D_v(z) dengan slider → minimum & next hop berubah langsung |
| 5 | Siklus Terima → Hitung → Kirim | — |
| 6 | Simulator DV (ref. #27–32) | Putar t = 0,1,2,…; klik node → tabel jarak lengkap (komputasi BF tiap tujuan); lacak "gelombang" informasi suatu node |
| 7 | Perubahan biaya link | *Good news* (4→1) vs *bad news* (4→60), grafik count-to-infinity, toggle poisoned reverse |
| 8 | LS vs DV + kuis | Kuis |

## 4. Verifikasi

* `npm test` — unit test algoritma terhadap angka Kurose & Ross:
  D(·) dari u = v2 x1 y2 w3 z4, forwarding table, tabel langkah, DV node b/e pada
  t=1 (grid 3×3), konvergensi count-to-infinity, efek poisoned reverse.
* `npm run build` — typecheck + build produksi.
* Uji manual di browser: navigasi panah tidak bentrok dengan input, interaksi
  tetap akurat saat jendela di-resize/fullscreen, mode gelap.

## 5. Roadmap deck berikutnya (kandidat)

Komponen inti sudah mendukung graf + stepper, sehingga kandidat yang murah:

1. Link-state flooding (penyebaran LSA) — reuse GraphView.
2. Spanning Tree Protocol (pemilihan root bridge).
3. BGP path selection (atribut AS-PATH, LOCAL_PREF).
4. Reliable data transfer: Stop-and-Wait, Go-Back-N, Selective Repeat
   (perlu komponen timeline/sequence diagram baru).
5. TCP congestion control (slow start, AIMD) — perlu komponen grafik waktu.
6. CSMA/CD & backoff eksponensial.
7. Subnetting / CIDR (kalkulator interaktif).

## 6. Cara menambah deck

1. Tulis algoritma murni di `src/algorithms/<nama>.ts` + test-nya.
2. Buat folder `src/decks/<nama>/` berisi `main.tsx` dan slide-slide.
3. Tambah `<nama>.html` di root dan daftarkan di `vite.config.ts`.
4. Daftarkan di `src/decks/registry.ts` agar muncul di katalog.
