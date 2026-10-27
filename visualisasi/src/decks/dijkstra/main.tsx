import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DeckShell } from '../../core/DeckShell';
import { SlideFrame, TitleSlide } from '../../core/components/SlideFrame';
import { Tex } from '../../core/components/Tex';
import { Quiz } from '../../core/components/Quiz';
import { DijkstraSim } from './DijkstraSim';
import { NotationBoard, PseudoExplorer, ResultExplorer, TryRoute, WaterFlow } from './slides';


function Deck() {
  return (
    <DeckShell>
      <TitleSlide title="Dijkstra's Link-State Routing" subtitle="Cara router menemukan jalur termurah — dijelaskan langkah demi langkah, bisa dicoba sendiri.">
        Tekan <code>→</code> untuk lanjut · <code>S</code> catatan pembicara · <code>Esc</code> ringkasan semua slide
      </TitleSlide>

      <SlideFrame title="Mencari jalur termurah" notes="Beri waktu 1–2 menit agar mahasiswa mencoba sendiri sebelum menunjukkan rute terbaik.">
        <TryRoute />
      </SlideFrame>

      <SlideFrame
        title="Kamus notasi"
        notes="Klik tiap simbol. Untuk D(v) dan p(v), perhatikan badge besar di graf. Tanyakan: mengapa D(z) masih bisa turun, sedangkan D(v) tidak?"
      >
        <NotationBoard />
      </SlideFrame>

      <SlideFrame title="Seperti air yang merambat" notes="Kunci intuisi: node yang pertama kali basah = jalur tercepat. Dijkstra hanya mempercepat simulasi ini.">
        <WaterFlow />
      </SlideFrame>

      <SlideFrame
        title="Pseudocode, diterjemahkan"
        notes="Klik baris satu per satu. Tekankan dua baris inti: pilih D terkecil, lalu perbarui tetangganya (relaksasi)."
      >
        <PseudoExplorer />
      </SlideFrame>

      <SlideFrame
        title="Dijkstra langkah demi langkah"
        notes="Nyalakan 'Mode tebak dulu' dan minta mahasiswa menyebut node berikutnya sebelum diklik. Perhatikan seri antara v dan y."
      >
        <DijkstraSim />
      </SlideFrame>

      <SlideFrame
        title="Pohon jalur & forwarding table"
        notes="Klik z: jalurnya u-x-y-z, tetapi forwarding table di u hanya menyimpan (u,x). Router berikutnya melanjutkan sendiri."
      >
        <ResultExplorer />
      </SlideFrame>

      <SlideFrame
        title="Sandbox: ubah bobot, ganti sumber"
        notes="Minta mahasiswa memprediksi: jika bobot A–C dinaikkan menjadi 9, jalur ke D berubah menjadi apa? Lalu buktikan. Panah/spasi juga memajukan langkah simulasi."
      >
        <DijkstraSim editable presetKey="latihan" />
      </SlideFrame>

      <SlideFrame
        title="Kompleksitas & jebakan"
        notes="Diskusi 1 menit: apa yang terjadi bila ada biaya negatif? Jawaban ada di kartu merah."
      >
        <div className="row">
          <div className="col grow">
            <div className="card">
              <h3>Kompleksitas</h3>
              <ul style={{ fontSize: 20 }}>
                <li>
                  Implementasi sederhana: <Tex>{'O(n^2)'}</Tex> perbandingan.
                </li>
                <li>
                  Dengan heap: <Tex>{'O((n+m)\\log n)'}</Tex>, <Tex>m</Tex> = jumlah link.
                </li>
                <li>
                  Pesan: setiap router menyiarkan link-state ke semua router → <Tex>{'O(n\\cdot m)'}</Tex> pesan.
                </li>
              </ul>
            </div>
            <div className="callout bad">
              <b>Biaya negatif</b> merusak Dijkstra: ia mengasumsikan menambah link tidak pernah mengurangi biaya, sehingga node yang sudah "dikunci" bisa saja
              salah. Bellman-Ford sendiri bisa menangani biaya negatif selama tidak ada siklus negatif; namun link jaringan dua arah, sehingga biaya link
              negatif tetap tidak dipakai pada routing.
            </div>
          </div>
          <div className="col grow">
            <div className="callout warn">
              <b>Osilasi rute.</b> Bila biaya link bergantung pada beban lalu lintas, rute bisa bolak-balik: rute baru → beban pindah → biaya berubah → rute berubah
              lagi.
              <br />
              Solusi: router tidak menghitung ulang serempak, dan memakai penundaan sebelum mengiklankan perubahan.
            </div>
          </div>
        </div>
      </SlideFrame>

      <SlideFrame title="Kuis singkat" notes="Soal 4 menjembatani ke Distance Vector (Bellman-Ford).">
        <Quiz
          items={[
            {
              q: "Pada setiap iterasi, node mana yang dimasukkan ke $N'$ berikutnya?",
              options: ['Node terdekat secara geografis', "Node di luar $N'$ dengan $D(w)$ paling kecil", 'Node dengan tetangga paling banyak', 'Node berikutnya menurut abjad'],
              answer: 1,
              why: "Node dengan $D$ terkecil di luar $N'$ sudah pasti punya jalur terbaik — tidak ada jalan lain yang bisa lebih murah.",
            },
            {
              q: "Mengapa $D(w)$ dijamin final setelah $w$ masuk $N'$?",
              options: ['Karena w sudah dikunjungi paling lama', 'Karena semua biaya link tidak negatif, jalan memutar tidak bisa lebih murah', 'Karena $D(w)$ dihitung dua kali', 'Karena algoritma selalu benar'],
              answer: 1,
              why: "Jalan lewat node lain yang belum final sudah setidaknya sama mahalnya, dan menambah link tidak pernah menurunkan biaya.",
            },
            {
              q: 'Apa yang disimpan forwarding table di $u$ untuk tujuan $z$?',
              options: ['Seluruh jalur $u \\to x \\to y \\to z$', 'Biaya total saja', 'Hanya link keluar pertama: $(u,x)$', 'Daftar semua node di jaringan'],
              answer: 2,
              why: 'Forwarding table hanya memuat link keluar pertama. Router berikutnya melanjutkan dengan tabelnya sendiri.',
            },
            {
              q: 'Satu link berbiaya $-1$ ditambahkan. Apa akibatnya pada Dijkstra?',
              options: ['Tidak ada, hasil tetap benar', 'Hasil bisa salah, karena node yang sudah "dikunci" mungkin masih bisa diperbaiki', 'Algoritma lebih cepat', 'Hanya forwarding table yang berubah'],
              answer: 1,
              why: 'Dijkstra mengandaikan menambah link tidak pernah menurunkan biaya. Dengan biaya negatif, anggapan itu runtuh.',
            },
          ]}
        />
      </SlideFrame>
    </DeckShell>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Deck />
  </StrictMode>,
);
