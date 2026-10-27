import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DeckShell } from '../../core/DeckShell';
import { SlideFrame, TitleSlide } from '../../core/components/SlideFrame';
import { Quiz } from '../../core/components/Quiz';
import { BFCalculator, DVPseudoExplorer, DVSimulator, FormulaBoard, LinkChange } from './slides';

function Deck() {
  return (
    <DeckShell>
      <TitleSlide title="Distance Vector & Bellman-Ford" subtitle="Router yang hanya bertanya pada tetangga — namun akhirnya tahu jalur termurah ke seluruh jaringan.">
        Tekan <code>→</code> untuk lanjut · <code>S</code> catatan pembicara · <code>Esc</code> ringkasan semua slide
      </TitleSlide>

      <SlideFrame
        title="Analogi: bertanya pada tetangga"
        notes="Bandingkan dengan Link-State: di sana setiap router punya peta lengkap. Di sini tidak ada yang punya peta. Tanyakan: apa risikonya bila tetangga memberi informasi yang salah atau usang?"
      >
        <div className="row">
          <div className="col grow">
            <div className="card">
              <h3>Kamu tersesat di kota asing</h3>
              <p>
                Kamu tidak punya peta. Tapi kamu bisa bertanya pada <b>tiga tetangga</b>: "Berapa jauh ke stasiun menurutmu?" Mereka menjawab angka masing-masing.
              </p>
              <p>
                Kamu tambahkan <b>jarak ke rumah tetangga itu</b> pada jawabannya, lalu pilih yang totalnya paling kecil. Selesai — tanpa pernah melihat peta kota.
              </p>
            </div>
            <div className="callout">
              Itulah <b>Distance Vector</b>: setiap router hanya tahu (1) biaya ke tetangga langsung, dan (2) apa yang <i>dilaporkan</i> tetangga.
            </div>
          </div>
          <div className="col grow">
            <div className="card soft">
              <h3>Link-State vs Distance Vector</h3>
              <table className="algo" style={{ fontSize: 17 }}>
                <thead>
                  <tr>
                    <th className="left"></th>
                    <th>Link-State</th>
                    <th>Distance Vector</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="left">Pengetahuan</td>
                    <td>Peta lengkap</td>
                    <td>Hanya tetangga</td>
                  </tr>
                  <tr>
                    <td className="left">Algoritma</td>
                    <td>Dijkstra</td>
                    <td>Bellman-Ford</td>
                  </tr>
                  <tr>
                    <td className="left">Bertukar info</td>
                    <td>Siaran ke semua</td>
                    <td>Ke tetangga saja</td>
                  </tr>
                  <tr>
                    <td className="left">Contoh</td>
                    <td>OSPF</td>
                    <td>RIP</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SlideFrame>

      <SlideFrame
        title="Persamaan Bellman-Ford"
        notes="Klik tiap suku. Pesan utama: x tidak pernah melihat jaringan; ia hanya percaya pada laporan tetangganya. Tanyakan: dari mana v mendapat D_v(y)?"
      >
        <FormulaBoard />
      </SlideFrame>

      <SlideFrame
        title="Kalkulator Bellman-Ford"
        notes="Mulai dari nilai buku (2,1,5 dan 5,3,3) → hasil 4 via x. Lalu ajak mahasiswa mengubah satu D dan menebak pemenang baru sebelum melihat hasilnya."
      >
        <BFCalculator />
      </SlideFrame>

      <SlideFrame
        title="Terima → Hitung → Kirim"
        notes="Tekankan dua sifat: asinkron (tidak ada jam bersama) dan self-stopping (tanpa perubahan, tanpa pesan). Gelombang informasi merambat satu hop per ronde."
      >
        <div className="row">
          {[
            ['1', 'Terima', 'Node menerima DV (daftar biaya ke semua tujuan) dari setiap tetangga.', 'info'],
            ['2', 'Hitung', 'Hitung ulang DV sendiri memakai persamaan Bellman-Ford untuk setiap tujuan.', 'warn'],
            ['3', 'Kirim', 'Kirim DV baru ke tetangga — hanya bila ada yang berubah.', 'good'],
          ].map(([n, t, d, c]) => (
            <div key={n} className="card grow">
              <span className={`tag ${c}`} style={{ display: 'inline-block', color: 'var(--c-on-accent)', padding: '2px 10px', borderRadius: 99, fontWeight: 700 }}>
                {n}
              </span>
              <h3 style={{ marginTop: 8 }}>{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <div className="callout grow">
            <b>Asinkron &amp; self-stopping.</b> Tidak ada jam bersama. Bila tidak ada yang berubah, tidak ada pesan — dan algoritma berhenti dengan sendirinya.
          </div>
          <div className="callout warn grow">
            <b>Konvergen bertahap.</b> Informasi merambat sejauh <i>satu hop</i> tiap ronde, seperti gelombang dari titik asalnya.
          </div>
        </div>
      </SlideFrame>

      <SlideFrame
        title="Pseudocode, diterjemahkan"
        notes="Klik baris satu per satu. Soroti baris 'wait': node tidak melakukan apa pun sampai ada pemicu. Itu sebabnya DV disebut asinkron."
      >
        <DVPseudoExplorer />
      </SlideFrame>

      <SlideFrame
        title="Distance Vector pada grid 3×3"
        notes="Pilih 'Lacak tujuan: c' dan tekan next/panah kanan: gelombang informasi merambat 1 hop per ronde. Nyalakan 'Mode tebak dulu', pilih node b dan baris tujuan d, lalu minta mahasiswa menebak D_b(d). Panah/spasi juga memajukan ronde."
      >
        <DVSimulator />
      </SlideFrame>

      <SlideFrame
        title="Sandbox: ubah bobot, ganti topologi"
        notes="Coba 'Contoh buku': pilih node u dan tujuan z, hasilnya harus 4 via x. Naikkan biaya u–x dan lihat next hop berpindah. Bandingkan dengan hasil Dijkstra pada graf yang sama."
      >
        <DVSimulator editable />
      </SlideFrame>

      <SlideFrame
        title="Kabar baik cepat, kabar buruk lambat"
        notes="Tampilkan 'kabar buruk' tanpa poisoned reverse sampai akhir (≈47 ronde), lalu ulangi dengan poisoned reverse. Soroti saat y dan z saling menunjuk (routing loop)."
      >
        <LinkChange />
      </SlideFrame>

      <SlideFrame title="Kuis singkat" notes="Soal 3 adalah inti topik ini; minta mahasiswa menjelaskan dengan kata-kata sendiri.">
        <Quiz
          items={[
            {
              q: 'Dalam $D_x(y)=\\min_v\\{c(x,v)+D_v(y)\\}$, apa arti $D_v(y)$?',
              options: ['Biaya kabel langsung dari $v$ ke $y$', 'Estimasi biaya terkecil $v$ ke $y$ menurut laporan $v$ sendiri', 'Jumlah hop dari $x$ ke $v$', 'Biaya total seluruh jaringan'],
              answer: 1,
              why: '$x$ tidak melihat seluruh jaringan; ia mengandalkan angka $D_v(y)$ yang dikirim tetangganya.',
            },
            {
              q: 'Kapan sebuah node mengirim DV barunya ke tetangga?',
              options: ['Setiap detik', 'Hanya bila DV-nya berubah', 'Hanya saat dimulai', 'Hanya bila diminta controller'],
              answer: 1,
              why: 'Distance Vector bersifat self-stopping: tanpa perubahan tidak ada pesan, sehingga algoritma berhenti sendiri.',
            },
            {
              q: 'Mengapa kabar buruk (biaya link naik) menyebar lambat?',
              options: ['Kabelnya lambat', 'Node saling mengandalkan estimasi usang satu sama lain sehingga angkanya merambat naik pelan-pelan (count to infinity)', 'Karena Bellman-Ford tidak bisa menjumlah', 'Karena semua node mengirim bersamaan'],
              answer: 1,
              why: '$y$ mengira $z$ punya jalan murah ke $x$, padahal jalan itu lewat $y$ sendiri. Poisoned reverse mencegah loop dua-node seperti ini.',
            },
            {
              q: 'Pada Dijkstra, node berikutnya dipilih dari $D$ terkecil. Apa padanannya di Distance Vector?',
              options: ['Tidak ada pemilihan; tiap node menghitung $\\min$ atas tetangganya untuk setiap tujuan', 'Node dengan tetangga paling banyak dipilih lebih dulu', 'Node diproses berurutan menurut abjad', 'Pusat kendali memilih node berikutnya'],
              answer: 0,
              why: 'DV bersifat terdistribusi: setiap node memperbarui dirinya sendiri begitu menerima vektor baru dari tetangga, tanpa urutan global.',
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
