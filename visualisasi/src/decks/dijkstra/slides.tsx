import { useMemo, useState } from 'react';
import { DIJKSTRA_PSEUDOCODE, runDijkstra } from '../../algorithms/dijkstra';
import { type NodeId, cost, edgeKey, fmtTex, INF, tracePath } from '../../core/graph';
import { krGraph, krTieOrder } from '../../core/presets';
import { GraphView, LegendDot } from '../../core/components/GraphView';
import { Tex } from '../../core/components/Tex';
import { Rich } from '../../core/components/Rich';
import { PseudoCode } from '../../core/components/PseudoCode';

const kr = runDijkstra(krGraph, 'u', { tieOrder: krTieOrder });

/* ---------- Slide 2: coba cari rute sendiri ---------- */

export function TryRoute() {
  const [path, setPath] = useState<NodeId[]>(['u']);
  const [showBest, setShowBest] = useState(false);
  const last = path[path.length - 1];
  const total = path.slice(1).reduce((sum, n, i) => sum + cost(krGraph, path[i], n), 0);
  const done = last === 'z';
  const best = kr.D.z;
  const bestPath = tracePath(kr.p, 'u', 'z');

  const shown = showBest ? bestPath : path;
  const used = new Set(shown.slice(1).map((n, i) => edgeKey(shown[i], n)));

  const click = (id: NodeId) => {
    if (showBest || done) return;
    if (id === path[path.length - 2]) return setPath(path.slice(0, -1)); // klik node sebelumnya = mundur
    if (cost(krGraph, last, id) === INF || path.includes(id)) return;
    setPath([...path, id]);
  };

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 600, flex: 'none' }}>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={krGraph}
            onNodeClick={click}
            nodeStyle={(id) => ({
              role: id === 'u' ? 'source' : shown.includes(id) ? 'settled' : id === 'z' ? 'checking' : 'default',
            })}
            edgeStyle={(a, b) => (used.has(edgeKey(a, b)) ? { tone: 'path' } : {})}
            ariaLabel="Graf contoh untuk mencari rute u ke z"
          />
          <div className="legend" style={{ padding: '4px 10px 6px' }}>
            <LegendDot color="var(--c-source)" label="asal (u)" />
            <LegendDot color="var(--c-check)" label="tujuan (z)" />
            <LegendDot color="var(--c-settled)" label="rute pilihanmu" />
          </div>
        </div>
      </div>
      <div className="col grow">
        <div className="callout">
          <b>Tantangan:</b> kirim paket dari <Tex>u</Tex> ke <Tex>z</Tex> dengan <b>total biaya sekecil mungkin</b>. Klik node satu per satu mulai dari
          tetangga <Tex>u</Tex>. Klik node sebelumnya untuk mundur.
        </div>
        <div className="card">
          <div className="muted" style={{ fontSize: 15 }}>
            Rute kamu
          </div>
          <div className="mono" style={{ fontSize: 28, fontWeight: 700 }}>
            {shown.join(' → ')}
          </div>
          <div style={{ fontSize: 22, marginTop: 6 }}>
            Total biaya:{' '}
            <b style={{ color: 'var(--c-current)' }}>
              {showBest ? best : total}
            </b>
          </div>
        </div>
        {done && !showBest && (
          <div className={`callout ${total === best ? 'ok' : 'warn'}`}>
            {total === best ? (
              <>
                <b>Hebat!</b> Biaya {total} sudah yang paling murah. Algoritma Dijkstra menemukannya <i>tanpa menebak</i> — itu yang akan kita bongkar.
              </>
            ) : (
              <>
                Biaya {total}, padahal ada rute berbiaya <b>{best}</b>. Mencoba semua kemungkinan bisa sangat banyak; Dijkstra punya cara sistematis.
              </>
            )}
          </div>
        )}
        <div className="toolbar">
          <button
            className="btn"
            onClick={() => {
              setPath(['u']);
              setShowBest(false);
            }}
          >
            ⟲ Ulang
          </button>
          <button className="btn" onClick={() => setShowBest((v) => !v)}>
            {showBest ? 'Kembali ke rutemu' : 'Tampilkan rute terbaik'}
          </button>
        </div>
        <p className="muted" style={{ fontSize: 18 }}>
          Di jaringan nyata, "biaya" bisa berarti kebalikan bandwidth, delay, atau kepadatan. Router harus memilih rute termurah ke <b>semua</b> tujuan —
          bukan hanya satu.
        </p>
      </div>
    </div>
  );
}

/* ---------- Slide 3: kamus notasi ---------- */

const NOTATION = [
  {
    key: 'c',
    tex: 'c(x,y)',
    title: 'Biaya link langsung',
    color: 'var(--c-bad)',
    body: (
      <>
        Biaya kabel yang langsung menghubungkan <Tex>x</Tex> dan <Tex>y</Tex>. Bila keduanya bukan tetangga langsung, nilainya <Tex>\infty</Tex>.
      </>
    ),
  },
  {
    key: 'D',
    tex: 'D(v)',
    title: 'Estimasi biaya terkecil',
    color: 'var(--c-current)',
    body: (
      <>
        Tebakan terbaik sejauh ini untuk biaya jalur termurah dari sumber <Tex>u</Tex> ke <Tex>v</Tex>. Bisa berubah sampai <Tex>v</Tex> dinyatakan final.
      </>
    ),
  },
  {
    key: 'p',
    tex: 'p(v)',
    title: 'Predecessor',
    color: 'var(--c-check)',
    body: (
      <>
        Node tepat sebelum <Tex>v</Tex> pada jalur termurah saat ini. Rangkai <Tex>p(v),\ p(p(v)),\ \dots</Tex> mundur untuk membaca seluruh jalurnya.
      </>
    ),
  },
  {
    key: 'N',
    tex: "N'",
    title: 'Himpunan node yang sudah final',
    color: 'var(--c-settled)',
    body: (
      <>
        Node yang jalur termurahnya sudah pasti. <Tex>{"N'"}</Tex> mulai dari <Tex>{'\\{u\\}'}</Tex> dan terus bertambah sampai berisi semua node.
      </>
    ),
  },
] as const;

export function NotationBoard() {
  const [sel, setSel] = useState<(typeof NOTATION)[number]['key']>('c');
  // Keadaan setelah u, x, y final DAN tetangga y sudah diperbarui (baris "uxy" pada tabel buku).
  const snap = kr.steps.find((s) => s.kind === 'select' && s.inN.length === 3)!;
  const n = NOTATION.find((x) => x.key === sel)!;
  const settled = new Set(snap.inN);
  const chain = (() => {
    const out: NodeId[] = ['z'];
    while (snap.p[out[out.length - 1]]) out.push(snap.p[out[out.length - 1]]!);
    return out;
  })();

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 600, flex: 'none' }}>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={krGraph}
            nodeStyle={(id) => ({
              role: sel === 'N' && settled.has(id) ? 'settled' : id === 'u' ? 'source' : 'default',
              badgeTex: sel === 'D' ? `D=${fmtTex(snap.D[id])}` : sel === 'p' ? `p=${snap.p[id] ?? '\\text{—}'}` : undefined,
              badgeTone: 'normal',
              emph: sel === 'D' || sel === 'p',
            })}
            edgeStyle={(a, b) => {
              if (sel === 'c') return { tone: 'current' };
              if (sel === 'p' && (snap.p[a] === b || snap.p[b] === a)) return { tone: 'checking' };
              return {};
            }}
            ariaLabel="Graf dengan notasi"
          />
        </div>
        <div className="muted" style={{ fontSize: 16 }}>
          Contoh kondisi graf setelah <Tex>u</Tex>, <Tex>x</Tex>, <Tex>y</Tex> final.
        </div>
      </div>
      <div className="col grow">
        <div className="toolbar" role="tablist">
          {NOTATION.map((x) => (
            <button key={x.key} role="tab" aria-selected={sel === x.key} className={`btn${sel === x.key ? ' active' : ''}`} onClick={() => setSel(x.key)}>
              <Tex className="tex-chip">{x.tex}</Tex>
            </button>
          ))}
        </div>
        <div className="card pop" key={sel} style={{ borderTop: `5px solid ${n.color}` }}>
          <h3 style={{ display: 'flex', gap: 10, alignItems: 'baseline' }}>
            <Tex style={{ color: n.color }}>{n.tex}</Tex>
            <span>— {n.title}</span>
          </h3>
          <p>{n.body}</p>
          {sel === 'c' && (
            <p className="muted" style={{ fontSize: 18 }}>
              Contoh: <Tex>{`c(u,x)=${cost(krGraph, 'u', 'x')}`}</Tex>, <Tex>{`c(u,w)=${cost(krGraph, 'u', 'w')}`}</Tex>, <Tex>{`c(u,z)=${fmtTex(cost(krGraph, 'u', 'z'))}`}</Tex> (u dan z tidak bertetangga).
            </p>
          )}
          {sel === 'D' && (
            <p className="muted" style={{ fontSize: 18 }}>
              Sekarang <Tex>{`D(w)=${fmtTex(snap.D.w)}`}</Tex> dan <Tex>{`D(z)=${fmtTex(snap.D.z)}`}</Tex>. Nilai ini masih bisa turun karena w dan z belum final.
            </p>
          )}
          {sel === 'p' && (
            <p className="muted" style={{ fontSize: 18 }}>
              Dari z mundur: <Tex>{chain.slice(0, -1).map((v) => `p(${v})=${snap.p[v]}`).join('\\ \\rightarrow\\ ')}</Tex>. Jalurnya: {[...chain].reverse().join(' → ')}.
            </p>
          )}
          {sel === 'N' && (
            <p className="muted" style={{ fontSize: 18 }}>
              Sekarang <Tex>{`N'=\\{${snap.inN.join(',')}\\}`}</Tex>. Node hijau di graf adalah anggotanya.
            </p>
          )}
        </div>
        <div className="callout warn">
          Tip: seluruh algoritma hanyalah menjaga dan memperbarui tiga hal ini — <Tex>D</Tex>, <Tex>p</Tex>, dan <Tex>{"N'"}</Tex>.
        </div>
      </div>
    </div>
  );
}

/* ---------- Slide 4: intuisi air mengalir ---------- */

export function WaterFlow() {
  const maxT = Math.max(...Object.values(kr.D));
  const [t, setT] = useState(0);
  const wet = (id: NodeId) => kr.D[id] <= t;
  const arrived = [...kr.order].filter(wet);

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 600, flex: 'none' }}>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={krGraph}
            nodeStyle={(id) => ({
              role: id === 'u' ? 'source' : wet(id) ? 'settled' : 'default',
              badge: wet(id) ? `t=${kr.D[id]}` : undefined,
              badgeTone: 'good',
            })}
            edgeStyle={(a, b) => {
              const wa = wet(a);
              const wb = wet(b);
              if (wa && wb) return kr.p[a] === b || kr.p[b] === a ? { tone: 'path' } : { tone: 'dim' };
              if (wa !== wb) return { tone: 'checking', flow: true, reverse: !wa };
              return {};
            }}
            ariaLabel="Animasi air merambat dari u"
          />
        </div>
        <div className="toolbar">
          <span className="mono" style={{ fontSize: 18, minWidth: 90 }}>
            t = {t}
          </span>
          <input aria-label="Waktu" data-prevent-swipe type="range" min={0} max={maxT} step={0.5} value={t} onChange={(e) => setT(Number(e.target.value))} style={{ flex: 1 }} />
          <button className="btn small" onClick={() => setT(0)}>
            ⟲
          </button>
        </div>
      </div>
      <div className="col grow">
        <div className="callout">
          Bayangkan <b>air</b> dikucurkan di <Tex>u</Tex> dan merambat sepanjang kabel. Kabel berbiaya <b>2</b> butuh <b>2 detik</b> untuk dilalui. Geser
          slider waktu.
        </div>
        <div className="card">
          <h3>Urutan air tiba</h3>
          <div className="mono" style={{ fontSize: 22 }}>
            {arrived.map((id) => `${id}(${kr.D[id]})`).join('  →  ')}
          </div>
        </div>
        <ul style={{ fontSize: 21 }}>
          <li>
            Air <b>pertama kali</b> tiba di suatu node lewat jalur tercepat — itulah jalur termurahnya.
          </li>
          <li>
            Dijkstra = mensimulasikan air ini tanpa menunggu: <b>lompat</b> ke node berikutnya yang akan basah (D terkecil).
          </li>
          <li>
            Mengapa pilihan itu <b>pasti final</b>? Tidak ada air lain yang lebih cepat tiba — kecuali biaya boleh negatif.
          </li>
        </ul>
      </div>
    </div>
  );
}

/* ---------- Slide 5: pseudocode ---------- */

export function PseudoExplorer() {
  const [sel, setSel] = useState<number | null>(8);
  const line = sel !== null ? DIJKSTRA_PSEUDOCODE[sel] : null;
  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 640, flex: 'none' }}>
        <PseudoCode lines={DIJKSTRA_PSEUDOCODE} label="Pseudocode Dijkstra" fontSize={17} isActive={(_, i) => sel === i} onPick={setSel} />
        <div className="muted" style={{ fontSize: 16 }}>
          Klik sebuah baris untuk melihat artinya.
        </div>
      </div>
      <div className="col grow">
        <div className="card pop" key={sel} style={{ minHeight: 120 }}>
          <div className="muted" style={{ fontSize: 15 }}>
            Dalam bahasa sehari-hari
          </div>
          <div style={{ fontSize: 24 }}>
            <Rich>{line?.meaning ?? 'Pilih baris pseudocode di kiri.'}</Rich>
          </div>
        </div>
        <div className="card soft">
          <h3>Analogi: peta kota</h3>
          <p style={{ fontSize: 19 }}>
            Kamu di titik <Tex>u</Tex> dan mencatat perkiraan jarak ke tiap perempatan. Setiap kali, pilih perempatan dengan perkiraan <b>terdekat</b> yang belum
            "dikunci", kunci jaraknya, lalu periksa apakah <b>lewat perempatan itu</b> memberi jalan pintas ke perempatan di sebelahnya.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------- Slide 7: hasil — pohon jalur & forwarding table ---------- */

export function ResultExplorer() {
  const [dest, setDest] = useState<NodeId>('z');
  const f = useMemo(() => kr.forwarding.find((x) => x.dest === dest)!, [dest]);
  const onPath = new Set(f.path.slice(1).map((n, i) => edgeKey(f.path[i], n)));
  const tree = new Set(kr.columns.map((c) => edgeKey(c, kr.p[c]!)));

  return (
    <div className="row" style={{ alignItems: 'flex-start' }}>
      <div className="col" style={{ width: 560, flex: 'none' }}>
        <div className="card" style={{ padding: 8 }}>
          <GraphView
            graph={krGraph}
            onNodeClick={(id) => id !== 'u' && setDest(id)}
            nodeStyle={(id) => ({
              role: id === 'u' ? 'source' : f.path.includes(id) ? 'settled' : 'default',
              badge: id === dest ? `biaya ${kr.D[id]}` : undefined,
              badgeTone: 'good',
            })}
            edgeStyle={(a, b) => {
              const k = edgeKey(a, b);
              if (onPath.has(k)) return { tone: 'path' };
              return tree.has(k) ? {} : { tone: 'dim' };
            }}
            ariaLabel="Pohon jalur termurah dari u"
          />
          <div className="legend" style={{ padding: '4px 10px 6px' }}>
            <span>Klik node tujuan. Garis redup = tidak dipakai rute termurah mana pun.</span>
          </div>
        </div>
      </div>
      <div className="col grow">
        <div className="card">
          <h3>
            Rute <Tex>{`u\\to ${dest}`}</Tex>
          </h3>
          <div className="mono" style={{ fontSize: 26, fontWeight: 700 }}>
            {f.path.join(' → ')}
          </div>
          <div className="muted" style={{ fontSize: 18 }}>
            Total biaya {f.cost}. Link keluar pertama dari <Tex>u</Tex>: <Tex>{`(u,${f.nextHop})`}</Tex>
          </div>
        </div>
        <div className="card" style={{ padding: 8 }}>
          <div style={{ padding: '4px 8px', fontWeight: 700 }}>Forwarding table di <Tex>u</Tex>
          </div>
          <table className="algo">
            <thead>
              <tr>
                <th className="left">Tujuan</th>
                <th className="left">Link keluar</th>
                <th>Biaya</th>
              </tr>
            </thead>
            <tbody>
              {kr.forwarding.map((r) => (
                <tr
                  key={r.dest}
                  className={`clickable${r.dest === dest ? ' selected' : ''}`}
                  tabIndex={0}
                  aria-selected={r.dest === dest}
                  onClick={() => setDest(r.dest)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setDest(r.dest);
                    }
                  }}
                >
                  <td className="left mono">{r.dest}</td>
                  <td className="left">
                    <Tex>{`(u,${r.nextHop})`}</Tex>
                  </td>
                  <td>{r.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="callout" style={{ fontSize: 18 }}>
          Forwarding table hanya menyimpan <b>langkah pertama</b>. Setiap router di jalan menjalankan algoritma yang sama dan meneruskan sisanya.
        </div>
      </div>
    </div>
  );
}
